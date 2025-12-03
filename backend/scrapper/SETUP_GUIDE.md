# Complete Setup Guide: Salary Scraper to Supabase

This guide will walk you through setting up the entire system from scratch.

## 📋 Overview

You've successfully migrated from Firebase to Supabase! Here's what we've built:

1. **Comprehensive Database Schema** - Extensive PostgreSQL schema for salary data
2. **Smart Scraper** - Only scrapes companies without recent data
3. **Supabase Integration** - Python client for database operations
4. **Data Migration** - Script to import existing JSON data

---

## 🎯 Step 1: Set Up Supabase Database

### 1.1 Create Database Schema

1. Go to your Supabase SQL Editor:
   ```
   https://app.supabase.com/project/wlfjyfvjoieetjdblucn/sql
   ```

2. Click "New Query"

3. Open `schema.sql` and copy ALL the content

4. Paste into the SQL editor and click "Run"

This creates:
- ✅ Companies table (with metadata)
- ✅ Salaries table (comprehensive salary data)
- ✅ Scrape history table (tracking)
- ✅ Data sources table (source management)
- ✅ Salary trends table (historical data)
- ✅ All indexes for performance
- ✅ RLS policies for security
- ✅ Useful views for querying

### 1.2 Verify Schema Creation

Run this query to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- companies
- comments (from earlier)
- data_sources
- replies (from earlier)
- salaries
- salary_trends
- scrape_history

---

## 🔑 Step 2: Get Supabase Credentials

### 2.1 Get Your Credentials

1. Go to: https://app.supabase.com/project/wlfjyfvjoieetjdblucn/settings/api

2. Copy these values:
   - **Project URL**: `https://wlfjyfvjoieetjdblucn.supabase.co`
   - **service_role key**: (long string starting with `eyJ...`)

⚠️ **IMPORTANT**: Use the **service_role** key, NOT the anon key!

### 2.2 Create .env File

```bash
cd scrapper
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=https://wlfjyfvjoieetjdblucn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🐍 Step 3: Install Python Dependencies

### 3.1 Check Python Version

```bash
python --version  # Should be 3.8+
```

### 3.2 Create Virtual Environment (Recommended)

```bash
cd scrapper
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `requests` - HTTP requests
- `beautifulsoup4` - HTML parsing
- `lxml` - XML/HTML parser
- `supabase` - Supabase Python client
- `python-dotenv` - Environment variable management

---

## 📊 Step 4: Migrate Existing Data (Optional)

If you have existing salary data in `/src/data/salaries.json`:

```bash
python migrate_existing_data.py
```

**What it does:**
- Reads existing JSON data
- Creates companies if they don't exist
- Inserts salary records (skipping duplicates)
- Provides migration summary

**Output:**
```
2025-10-26 23:30:00 - INFO - Loaded 100 salary records
2025-10-26 23:30:00 - INFO - Migrated 10 records so far...
============================================================
MIGRATION SUMMARY
============================================================
Total records: 100
Successfully migrated: 95
Skipped (already exists): 5
Errors: 0
============================================================
```

---

## 🚀 Step 5: Configure Companies to Scrape

Edit `companies.json`:

```json
[
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Oracle"
]
```

**Tips:**
- Use official company names
- Case doesn't matter (script handles it)
- Add as many as you want

---

## 🤖 Step 6: Run the Scraper

### 6.1 First Run

```bash
python scrape_supabase.py
```

### 6.2 What Happens

For each company:
1. ✅ Checks if company was scraped recently (last 7 days)
2. ✅ Skips if data is fresh
3. ✅ Scrapes from levels.fyi
4. ✅ Scrapes from weekday.works
5. ✅ Stores data in Supabase
6. ✅ Records scrape history

### 6.3 Example Output

```
============================================================
Starting scrape for: Google
============================================================

INFO - Scraping levels_fyi for Google...
INFO - Inserted 15 salary records
INFO - Successfully scraped 15 records from levels_fyi

INFO - Skipping weekday for Google (recently scraped)

============================================================
Completed scrape for Google: 15 total records
Breakdown: {'levels_fyi': 15, 'weekday': 0}
============================================================

SCRAPING SUMMARY
============================================================
Google: 15 records ({'levels_fyi': 15, 'weekday': 0})
Microsoft: 12 records ({'levels_fyi': 8, 'weekday': 4})
Amazon: 0 records (skipped - recently scraped)
============================================================
```

---

## 🔍 Step 7: Verify Data in Supabase

### 7.1 View Companies

```sql
SELECT * FROM companies ORDER BY created_at DESC;
```

### 7.2 View Salaries

```sql
SELECT
  company_name,
  designation,
  location,
  total_compensation,
  years_of_experience,
  source_platform
FROM salaries
ORDER BY created_at DESC
LIMIT 20;
```

### 7.3 View Scrape History

```sql
SELECT
  company_name,
  source_platform,
  status,
  records_scraped,
  started_at,
  completed_at
FROM scrape_history
ORDER BY started_at DESC;
```

### 7.4 Company Statistics

```sql
SELECT * FROM company_salary_stats;
```

---

## ⚙️ Configuration Options

### Change Scrape Frequency

Default: 168 hours (1 week)

Edit `scrape_supabase.py`:

```python
# Check if data is older than X hours
if not self.should_scrape(source, hours=168):  # Change this
```

Options:
- `24` - Daily
- `72` - Every 3 days
- `168` - Weekly (default)
- `336` - Every 2 weeks

### Add New Companies

Just add to `companies.json` and run the scraper again!

---

## 🎯 What You've Built

### Database Schema

**companies** - Company metadata
- ID, name, slug, industry, website, etc.
- 9 records

**salaries** - Comprehensive salary data
- Company, designation, location
- Base, bonus, stock breakdown
- Years of experience
- Source tracking
- 100+ records

**scrape_history** - Operation tracking
- What was scraped, when, status
- Error messages if failed
- Records count

**data_sources** - Source management
- levels.fyi, weekday, etc.
- Last scraped time
- Reliability scores

**salary_trends** - Historical tracking
- Quarterly salary trends
- For future analytics

### Features Implemented

✅ **Smart Scraping** - Only new data
✅ **Duplicate Prevention** - No redundant records
✅ **Multi-source** - levels.fyi + weekday
✅ **Error Handling** - Robust logging
✅ **History Tracking** - All operations logged
✅ **Extensible Schema** - Easy to add fields
✅ **Indexed Queries** - Fast searches
✅ **Secure Access** - RLS policies

---

## 🔄 Regular Usage

### Daily/Weekly Scraping

1. Activate virtual environment:
   ```bash
   source venv/bin/activate
   ```

2. Run scraper:
   ```bash
   python scrape_supabase.py
   ```

3. Check results in Supabase dashboard

### Add New Company

1. Add to `companies.json`
2. Run scraper
3. New company auto-created

### Update Existing Data

Just run the scraper - it will:
- Skip recent data
- Update stale data (>7 days old)
- Add new salary records

---

## 🐛 Troubleshooting

### "Missing Supabase credentials"

**Solution:**
```bash
# Make sure .env exists
ls -la .env

# Export manually if needed
export SUPABASE_URL="https://wlfjyfvjoieetjdblucn.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_key_here"
```

### "ModuleNotFoundError: No module named 'supabase'"

**Solution:**
```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### "Failed to insert salaries"

**Check:**
1. Database schema created? Run `schema.sql`
2. Correct service role key? Check Supabase dashboard
3. Network connection? Try accessing Supabase in browser

### "No data found for company"

**Possible reasons:**
1. Company name incorrect (check spelling)
2. Source website changed structure
3. Company not on that platform
4. Check logs for detailed error

---

## 📈 Next Steps

### 1. Automate with Cron

**Linux/Mac:**
```bash
crontab -e

# Add this line (runs weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/scrapper && source venv/bin/activate && python scrape_supabase.py
```

### 2. Set Up Monitoring

Create a Supabase function to check scrape_history:

```sql
SELECT
  company_name,
  source_platform,
  COUNT(*) FILTER (WHERE status = 'failed') as failures
FROM scrape_history
WHERE started_at > NOW() - INTERVAL '7 days'
GROUP BY company_name, source_platform
HAVING COUNT(*) FILTER (WHERE status = 'failed') > 0;
```

### 3. Add More Sources

- Glassdoor
- LinkedIn
- Payscale
- Company career pages

### 4. Create Analytics

Use the salary_trends table for:
- YoY salary growth
- Market compensation trends
- Company comparison charts

---

## 🎉 Success!

You now have:
- ✅ Comprehensive database schema
- ✅ Automated salary scraper
- ✅ Smart duplicate prevention
- ✅ Multi-source data collection
- ✅ Complete history tracking
- ✅ Production-ready setup

**Happy scraping! 🚀**
