#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p data

# Install required Python packages
echo "Installing required Python packages..."
pip install requests beautifulsoup4

# Run the scraper
echo "Running the scraper..."
python scripts/mantech_scraper.py

# Install required Node.js packages
echo "Installing required Node.js packages..."
npm install dotenv @supabase/supabase-js

# Import data to Supabase
echo "Importing data to Supabase..."
node scripts/import_to_supabase.js

echo "Done!"

