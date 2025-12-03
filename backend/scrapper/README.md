# Salary Scraper with Supabase Integration

A production-ready salary scraper that integrates with Supabase database. Automatically checks for existing data and only scrapes companies that need updates.

## 🌟 Features

- **Smart Scraping**: Only scrapes companies without recent data (configurable freshness)
- **Multiple Sources**: Supports levels.fyi, weekday.works, and ambitionbox
- **Supabase Integration**: Stores all data in PostgreSQL via Supabase
- **Comprehensive Schema**: Extensive database schema with proper indexing
- **Duplicate Prevention**: Checks for existing data before inserting
- **Scrape History**: Tracks all scraping operations with timestamps
- **Error Handling**: Robust error handling and logging

## 📋 Prerequisites

- Python 3.8+
- Supabase account and project
- pip (Python package manager)

## 🚀 Setup

### 1. Install Dependencies

```bash
cd scrapper
pip install -r requirements.txt
```

### 2. Set Up Supabase Database

Run the schema SQL in your Supabase SQL Editor:

1. Go to: https://app.supabase.com/project/<your-project>/sql
2. Click "New Query"
3. Copy contents of `schema.sql`
4. Click "Run"

This creates:
- `companies` table
- `salaries` table
- `scrape_history` table
- `data_sources` table
- `salary_trends` table
- All necessary indexes and policies

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find these:**
- Go to: https://app.supabase.com/project/<your-project>/settings/api
- Copy the "Project URL" and "service_role" key (NOT anon key!)

### 4. Load Environment Variables

```bash
# Option 1: Use python-dotenv (automatically loads .env)
# (Already configured in the scripts)

# Option 2: Export manually
export SUPABASE_URL="your_url_here"
export SUPABASE_SERVICE_ROLE_KEY="your_key_here"
```

## 📊 Usage

### Migrate Existing Data (One-time)

If you have existing salary data in JSON format:

```bash
python migrate_existing_data.py
```

This will:
- Read from `../src/data/salaries.json`
- Create companies if they don't exist
- Insert salary records (skipping duplicates)
- Provide migration summary

### Add Companies to Scrape

Edit `companies.json`:

```json
["Google", "Microsoft", "Amazon", "Apple", "Meta"]
```

### Run the Scraper

```bash
python scrape_supabase.py
```

This will:
1. Check each company for recent scrapes
2. Skip companies scraped in the last 7 days (configurable)
3. Scrape from all sources (levels.fyi, weekday)
4. Store data in Supabase
5. Track scraping history

### Output Example

```
2025-10-26 23:30:00 - INFO - Supabase client initialized successfully
2025-10-26 23:30:00 - INFO - Loaded 5 companies to scrape
============================================================
Starting scrape for: Google
============================================================

2025-10-26 23:30:01 - INFO - Scraping levels_fyi for Google...
2025-10-26 23:30:05 - INFO - Inserted 15 salary records
2025-10-26 23:30:05 - INFO - Successfully scraped 15 records from levels_fyi

2025-10-26 23:30:05 - INFO - Skipping weekday for Google (recently scraped)

============================================================
Completed scrape for Google: 15 total records
Breakdown: {'levels_fyi': 15, 'weekday': 0}
============================================================
```

## 🔧 Configuration

### Scrape Freshness

Change how often to re-scrape companies:

```python
# In scrape_supabase.py
scraper.should_scrape(source_platform, hours=168)  # 168 = 1 week
```

### Add New Sources

1. Add URL pattern to `_salary_URL` in `SupabaseScraper`
2. Create scraping method (e.g., `scrape_salary_newsource()`)
3. Add to `scrape_all_sources()`

## 📁 File Structure

```
scrapper/
├── schema.sql                    # Database schema
├── supabase_client.py           # Supabase integration
├── scrape_supabase.py           # Main scraper
├── scrape.py                     # Original scraper (deprecated)
├── migrate_existing_data.py     # Data migration script
├── companies.json                # Companies to scrape
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment template
├── .env                          # Your credentials (not in git)
└── README.md                     # This file
```

## 🗄️ Database Schema

### Companies Table
- Stores company metadata
- Automatically created when scraping

### Salaries Table
Comprehensive salary information:
- Company and job details
- Location data
- Compensation breakdown (base, bonus, stock, etc.)
- Years of experience
- Source tracking
- Data quality metrics

### Scrape History Table
- Tracks all scraping operations
- Records success/failure
- Stores error messages
- Useful for debugging

## 🔍 Querying Data

### View Latest Salaries

```sql
SELECT * FROM latest_salaries
WHERE company_name = 'Google'
ORDER BY total_compensation DESC;
```

### Company Statistics

```sql
SELECT * FROM company_salary_stats
WHERE company_name = 'Microsoft';
```

### Salary by Experience

```sql
SELECT * FROM salary_by_experience
WHERE company_name = 'Amazon'
ORDER BY experience_bracket;
```

## 🛡️ Security

- Uses service role key (stored in .env, not committed)
- RLS policies protect data
- Public can read, only service role can write
- Environment variables for credentials

## 🐛 Troubleshooting

### "Missing Supabase credentials"
- Make sure `.env` file exists with correct credentials
- Or export environment variables

### "Failed to insert salaries"
- Check Supabase connection
- Verify database schema is created
- Check service role key permissions

### "No data found"
- Company name might be incorrect
- Source website might have changed structure
- Check logs for detailed error messages

## 📝 Notes

- Scraper respects recent scrapes (won't re-scrape within configured time)
- All timestamps in UTC
- Salaries stored in INR
- Data sources tracked with reliability scores

## 🚀 Next Steps

1. Run `schema.sql` in Supabase
2. Configure `.env` with credentials
3. (Optional) Migrate existing data
4. Add companies to `companies.json`
5. Run the scraper!

## 📞 Support

For issues:
1. Check logs for error messages
2. Verify Supabase schema is created
3. Confirm environment variables are set
4. Check network connectivity

## 🎯 Production Tips

- Set up cron job for regular scraping
- Monitor scrape_history table
- Configure alerts for failed scrapes
- Adjust scrape frequency based on needs
- Consider rate limiting for sources
