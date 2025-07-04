// This script seeds the database with the required categories
// Run with: node scripts/seed-categories.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories to seed
const categories = [
  {
    name: 'Tools',
    description: 'Hand tools, power tools, and specialized tools for electronics work'
  },
  {
    name: 'Accessories',
    description: 'Add-ons and accessories for electronic components and devices'
  },
  {
    name: 'Instruments',
    description: 'Measurement and testing instruments for electronic projects'
  },
  {
    name: 'Components',
    description: 'Electronic components including resistors, capacitors, ICs, and more'
  },
  {
    name: 'Power Products',
    description: 'Power supplies, batteries, chargers, and power management solutions'
  },
  {
    name: 'Test and Measurements',
    description: 'Equipment and tools for testing, measuring, and analyzing electronic circuits'
  }
];

async function seedCategories() {
  console.log('Starting to seed categories...');
  
  try {
    // Check for existing categories to avoid duplicates
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name');
    
    if (fetchError) {
      throw fetchError;
    }
    
    const existingNames = existingCategories.map(cat => cat.name);
    const newCategories = categories.filter(cat => !existingNames.includes(cat.name));
    
    if (newCategories.length === 0) {
      console.log('All categories already exist. No new categories added.');
      return;
    }
    
    // Insert new categories
    const { data, error } = await supabase
      .from('categories')
      .insert(newCategories)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully added ${data.length} new categories:`);
    data.forEach(cat => console.log(`- ${cat.name}`));
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Run the seed function
seedCategories()
  .then(() => console.log('Seeding completed.'))
  .catch(err => console.error('Seeding failed:', err));

