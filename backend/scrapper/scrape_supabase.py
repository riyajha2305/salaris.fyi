"""
Enhanced Salary Scraper with Supabase Integration
Only scrapes companies that don't have recent data
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import requests
import json
from bs4 import BeautifulSoup
import logging
from typing import List, Dict, Optional, Any
from supabase_client import SupabaseClient, normalize_salary_data

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SupabaseScraper:
    def __init__(self, supabase_client: SupabaseClient):
        """Initialize scraper with Supabase client"""
        self._salary_URL = {
            "levels_fyi": "https://www.levels.fyi/companies/{company_name}/salaries/software-engineer/locations/india?country=113",
            "weekday": "https://www.weekday.works/salary/what-salary-does-{company_name}-pay",
            "ambitionbox": "https://www.ambitionbox.com/salaries/{company_name}-salaries"
        }
        self.db = supabase_client
        self._company = None
        self._company_id = None

    def set_company(self, company_name: str):
        """Set company and get/create company ID"""
        self._company = company_name
        self._company_id = self.db.get_or_create_company(company_name)
        logger.info(f"Set company to: {company_name} (ID: {self._company_id})")

    def should_scrape(self, source_platform: str, hours: int = 168) -> bool:
        """
        Check if we should scrape this company from this source
        Returns False if company was scraped recently
        """
        if not self._company:
            raise ValueError("Company not set. Call set_company() first.")

        return not self.db.has_recent_scrape(self._company, source_platform, hours)

    def scrape_salary_levels_fyi(self) -> List[Dict]:
        """Scrape salary data from levels.fyi"""
        source = "levels_fyi"

        # Check if we should scrape
        if not self.should_scrape(source):
            logger.info(f"Skipping {source} for {self._company} (recently scraped)")
            return []

        scrape_id = self.db.start_scrape(self._company, source, self._company_id)

        try:
            company_name = self._company.lower()
            url = self._salary_URL[source].format(company_name=company_name)

            logger.info(f"Scraping {source} for {self._company}: {url}")
            r = requests.get(url, timeout=30)
            soup = BeautifulSoup(r.text, 'html.parser')
            next_data = soup.find('script', id='__NEXT_DATA__')

            if not next_data:
                logger.warning(f"No data found on {source} for {self._company}")
                self.db.complete_scrape(scrape_id, "failed", 0, "No __NEXT_DATA__ found")
                return []

            data = json.loads(next_data.string)
            data = data['props']['pageProps']

            salaries_raw = data.get('averages', [])
            exchange_rate = data.get('locationExchangeRate', 1)

            salary_records = []

            for salary in salaries_raw:
                primary_level = salary.get('primaryLevelName', 'Unknown')
                secondary_level = salary.get('secondaryLevelName')
                level_name = f"{primary_level} ({secondary_level})" if secondary_level else primary_level

                # Extract compensation
                raw_values = salary.get('rawValues', {})
                compensation = {
                    'base': raw_values.get('base', 0) * exchange_rate,
                    'bonus': raw_values.get('bonus', 0) * exchange_rate,
                    'stock': raw_values.get('stock', 0) * exchange_rate,
                    'total_compensation': raw_values.get('total', 0) * exchange_rate
                }

                # Get years of experience
                yoe = salary.get('yearsOfExperience')

                # Get location
                location = salary.get('location', 'India')

                # Normalize and create salary record
                salary_record = normalize_salary_data(
                    company_id=self._company_id,
                    company_name=self._company,
                    designation=f"Software Engineer - {level_name}",
                    location=location,
                    source_platform=source,
                    compensation=compensation,
                    years_of_experience=yoe,
                    level=primary_level,
                    data_points=salary.get('numDataPoints', 1),
                    source_url=url
                )

                salary_records.append(salary_record)

            # Insert into database
            if salary_records:
                count = self.db.insert_salaries(salary_records)
                self.db.complete_scrape(scrape_id, "success", count)
                self.db.update_data_source_last_scraped(source)
                logger.info(f"Successfully scraped {count} records from {source}")
            else:
                self.db.complete_scrape(scrape_id, "success", 0, "No salary data found")

            return salary_records

        except Exception as e:
            error_msg = f"Error scraping {source}: {str(e)}"
            logger.error(error_msg)
            self.db.complete_scrape(scrape_id, "failed", 0, str(e))
            return []

    def scrape_salary_weekdays(self) -> List[Dict]:
        """Scrape salary data from weekday.works"""
        source = "weekday"

        # Check if we should scrape
        if not self.should_scrape(source):
            logger.info(f"Skipping {source} for {self._company} (recently scraped)")
            return []

        scrape_id = self.db.start_scrape(self._company, source, self._company_id)

        try:
            company_name = self._company.lower()
            url = self._salary_URL[source].format(company_name=company_name)

            logger.info(f"Scraping {source} for {self._company}: {url}")
            r = requests.get(url, timeout=30)
            soup = BeautifulSoup(r.text, 'html.parser')
            next_data = soup.find('script', id='__NEXT_DATA__')

            if not next_data:
                logger.warning(f"No data found on {source} for {self._company}")
                self.db.complete_scrape(scrape_id, "failed", 0, "No __NEXT_DATA__ found")
                return []

            data = json.loads(next_data.string)
            data = data['props']['pageProps'].get("salaryData", {})

            roles = data.get('roles', [])
            salary_records = []

            for role in roles:
                role_name = role.get("role", "Unknown Role")
                salaries_list = role.get("individualSalaries", [])

                for salary in salaries_list:
                    level_name = salary.get('role', role_name)
                    yoe = salary.get('yearsOfExperience')
                    total_comp = salary.get('salary', 0)

                    compensation = {
                        'base': total_comp,  # Weekday typically shows total compensation
                        'total_compensation': total_comp
                    }

                    # Normalize and create salary record
                    salary_record = normalize_salary_data(
                        company_id=self._company_id,
                        company_name=self._company,
                        designation=level_name,
                        location="India",  # Weekday doesn't always specify location
                        source_platform=source,
                        compensation=compensation,
                        years_of_experience=yoe,
                        role_category=role_name,
                        source_url=url
                    )

                    salary_records.append(salary_record)

            # Insert into database
            if salary_records:
                count = self.db.insert_salaries(salary_records)
                self.db.complete_scrape(scrape_id, "success", count)
                self.db.update_data_source_last_scraped(source)
                logger.info(f"Successfully scraped {count} records from {source}")
            else:
                self.db.complete_scrape(scrape_id, "success", 0, "No salary data found")

            return salary_records

        except Exception as e:
            error_msg = f"Error scraping {source}: {str(e)}"
            logger.error(error_msg)
            self.db.complete_scrape(scrape_id, "failed", 0, str(e))
            return []

    def scrape_all_sources(self) -> Dict[str, int]:
        """
        Scrape all available sources for the current company
        Returns: dict with source names and record counts
        """
        if not self._company:
            raise ValueError("Company not set. Call set_company() first.")

        results = {}

        logger.info(f"\n{'='*60}")
        logger.info(f"Starting scrape for: {self._company}")
        logger.info(f"{'='*60}\n")

        # Scrape levels.fyi
        levels_records = self.scrape_salary_levels_fyi()
        results['levels_fyi'] = len(levels_records)

        # Scrape weekday
        weekday_records = self.scrape_salary_weekdays()
        results['weekday'] = len(weekday_records)

        total_records = sum(results.values())
        logger.info(f"\n{'='*60}")
        logger.info(f"Completed scrape for {self._company}: {total_records} total records")
        logger.info(f"Breakdown: {results}")
        logger.info(f"{'='*60}\n")

        return results


def main():
    """Main function to run the scraper"""
    # Initialize Supabase client
    try:
        db = SupabaseClient()
    except ValueError as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        logger.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")
        return

    # Load companies to scrape
    try:
        with open("companies.json", "r") as f:
            companies = json.load(f)
        logger.info(f"Loaded {len(companies)} companies to scrape")
    except FileNotFoundError:
        logger.error("companies.json not found")
        return
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing companies.json: {e}")
        return

    # Initialize scraper
    scraper = SupabaseScraper(db)

    # Scrape each company
    total_results = {}
    for company in companies:
        try:
            scraper.set_company(company)
            results = scraper.scrape_all_sources()
            total_results[company] = results
        except Exception as e:
            logger.error(f"Error scraping {company}: {e}")
            total_results[company] = {"error": str(e)}

    # Print summary
    logger.info("\n" + "="*60)
    logger.info("SCRAPING SUMMARY")
    logger.info("="*60)
    for company, results in total_results.items():
        if "error" in results:
            logger.info(f"{company}: ERROR - {results['error']}")
        else:
            total = sum(results.values())
            logger.info(f"{company}: {total} records ({results})")
    logger.info("="*60)


if __name__ == "__main__":
    main()
