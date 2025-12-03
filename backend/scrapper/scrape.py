import requests
import json
from bs4 import BeautifulSoup

class Scraper:
    def __init__(self):
        self._salary_URL = {
            "levels_fyi":"https://www.levels.fyi/companies/{company_name}/salaries/software-engineer/locations/india?country=113",
            "weekday": "https://www.weekday.works/salary/what-salary-does-{company_name}-pay",
            "ambitionbox": "https://www.ambitionbox.com/salaries/{company_name}-salaries"
        }
        self._company = None
        self._salaries = dict()

    def set_company(self, company_name):
        self._company = company_name

    def get_company(self):
        return self._company
    
    def set_salaries(self, salaries):
        self._salaries = salaries

    def get_salaries(self):
        return self._salaries

    def scrape_salary_levels_fyi(self):
        company_name = self._company.lower()
        url = self._salary_URL["levels_fyi"].format(company_name=company_name)
        r = requests.get(url)

        soup = BeautifulSoup(r.text, 'html.parser')
        next_data = soup.find('script', id='__NEXT_DATA__')

        output_data = list()
        if next_data:
            try:
                data = json.loads(next_data.string)
                data = data['props']['pageProps']
                
                salaries = data['averages']

                exchange_rate = data['locationExchangeRate']

                for salary in salaries:
                    primary_level_name = salary['primaryLevelName']
                    secondary_level_name = salary['secondaryLevelName'] if 'secondaryLevelName' in salary else None

                    compensation = {
                        'base': salary['rawValues']['base'] * exchange_rate,
                        'bonus': salary['rawValues']['bonus'] * exchange_rate,
                        'stock': salary['rawValues']['stock'] * exchange_rate,
                        'total_compensation': salary['rawValues']['total'] * exchange_rate
                    }

                    output_data.append({
                        'primary_level_name': primary_level_name,
                        'secondary_level_name': secondary_level_name,
                        'compensation': compensation
                    })

                return output_data

            except json.JSONDecodeError:
                print("Failed to parse JSON data from script tag")
                return None

    def scrape_salary_weekdays(self):
        company_name = self._company.lower()
        url = self._salary_URL["weekday"].format(company_name=company_name)
        r = requests.get(url)
        output = r.text

        soup = BeautifulSoup(output, 'html.parser')
        next_data = soup.find('script', id='__NEXT_DATA__')

        if next_data:
            try:
                data = json.loads(next_data.string)
                data = data['props']['pageProps']["salaryData"]

                roles = data['roles']
                output_data = dict()
                
                for role in roles:
                    role_name = role["role"]

                    salaries = role["individualSalaries"]

                    output_data[role_name] = list()

                    for salary in salaries:
                        level_name = salary['role']
                        years_of_experience = salary['yearsOfExperience']
                        compensation = salary['salary']

                        output_data[role_name].append({
                            'level_name': level_name,
                            'years_of_experience': years_of_experience,
                            'compensation': compensation
                        })

                return output_data

            except json.JSONDecodeError:
                print("Failed to parse JSON data from script tag")
                return None
    
    def set_salary_levels_fyi(self):
        data = {
            "company_name": self._company,
            "salaries": self.scrape_salary_levels_fyi()
        }

        salaries = self.get_salaries()
        salaries["levels_fyi"] = data
        self.set_salaries(salaries)

    def set_salary_weekdays(self):
        data = {
            "company_name": self._company,
            "salaries": self.scrape_salary_weekdays()
        }

        salaries = self.get_salaries()
        salaries["weekday"] = data
        self.set_salaries(salaries)
    
    def set_all_salaries(self):
        self.set_salary_levels_fyi()
        self.set_salary_weekdays()

if __name__ == "__main__":
    with open("companies.json", "r") as f:
        companies = json.load(f)

    salaries = dict()
    for company in companies:
        sc = Scraper()

        sc.set_company(company)

        sc.set_all_salaries()
        salaries[company] = sc.get_salaries()
    
    with open("salaries.json", "w") as f:
        json.dump(salaries, f, indent=2)