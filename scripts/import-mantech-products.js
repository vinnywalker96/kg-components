// This script imports products from Mantech.co.za
// Run with: node scripts/import-mantech-products.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mantech categories mapping to our database categories
const categoryMapping = {
  'Tools': ['Tools', 'Hand Tools', 'Power Tools', 'Soldering Equipment'],
  'Accessories': ['Accessories', 'Cables & Connectors', 'Enclosures', 'Prototyping'],
  'Instruments': ['Test & Measurement', 'Oscilloscopes', 'Multimeters', 'Function Generators'],
  'Components': ['Components', 'Resistors', 'Capacitors', 'Semiconductors', 'ICs', 'LEDs'],
  'Power Products': ['Power', 'Power Supplies', 'Batteries', 'Chargers', 'Adapters'],
  'Test and Measurements': ['Test & Measurement', 'Oscilloscopes', 'Multimeters', 'Signal Generators']
};

// Base URL for Mantech
const MANTECH_BASE_URL = 'https://mantech.co.za';
const CATEGORIES_URL = 'https://mantech.co.za/Categories.aspx';

async function fetchCategoryLinks() {
  console.log('Fetching category links from Mantech...');
  try {
    const response = await axios.get(CATEGORIES_URL);
    const $ = cheerio.load(response.data);
    
    const categoryLinks = [];
    
    // Find category links on the page
    $('.CategoryItem a').each((i, element) => {
      const link = $(element).attr('href');
      const name = $(element).text().trim();
      
      if (link && name) {
        // Check if this category matches any of our mapped categories
        for (const [ourCategory, mantechCategories] of Object.entries(categoryMapping)) {
          if (mantechCategories.some(cat => name.includes(cat))) {
            categoryLinks.push({
              url: link.startsWith('http') ? link : `${MANTECH_BASE_URL}/${link}`,
              name,
              ourCategory
            });
            break;
          }
        }
      }
    });
    
    console.log(`Found ${categoryLinks.length} relevant category links`);
    return categoryLinks;
  } catch (error) {
    console.error('Error fetching category links:', error);
    return [];
  }
}

async function fetchProductsFromCategory(categoryLink) {
  console.log(`Fetching products from category: ${categoryLink.name}`);
  try {
    const response = await axios.get(categoryLink.url);
    const $ = cheerio.load(response.data);
    
    const products = [];
    
    // Find product items on the page
    $('.ProductItem').each((i, element) => {
      // Limit to 10 products per category for initial import
      if (i >= 10) return;
      
      const name = $(element).find('.ProductName').text().trim();
      const priceText = $(element).find('.ProductPrice').text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const imageUrl = $(element).find('img').attr('src');
      const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${MANTECH_BASE_URL}/${imageUrl}`) : null;
      
      // Get product description if available
      const description = $(element).find('.ProductDescription').text().trim() || 
                         `${name} - ${categoryLink.name} category product`;
      
      if (name && price > 0) {
        products.push({
          name,
          description,
          price,
          image_url: fullImageUrl,
          stock: Math.floor(Math.random() * 50) + 1, // Random stock between 1-50
          featured: Math.random() < 0.2 // 20% chance of being featured
        });
      }
    });
    
    console.log(`Found ${products.length} products in category: ${categoryLink.name}`);
    return { products, ourCategory: categoryLink.ourCategory };
  } catch (error) {
    console.error(`Error fetching products from category ${categoryLink.name}:`, error);
    return { products: [], ourCategory: categoryLink.ourCategory };
  }
}

async function importProducts() {
  console.log('Starting product import from Mantech.co.za...');
  
  try {
    // Get our category IDs from the database
    const { data: dbCategories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (categoryError) {
      throw categoryError;
    }
    
    if (!dbCategories || dbCategories.length === 0) {
      throw new Error('No categories found in the database. Please run seed-categories.js first.');
    }
    
    // Create a mapping of category names to IDs
    const categoryIds = {};
    dbCategories.forEach(cat => {
      categoryIds[cat.name] = cat.id;
    });
    
    // Fetch category links from Mantech
    const categoryLinks = await fetchCategoryLinks();
    
    if (categoryLinks.length === 0) {
      throw new Error('No category links found on Mantech.co.za');
    }
    
    // Process each category
    let totalImported = 0;
    
    for (const categoryLink of categoryLinks) {
      const { products, ourCategory } = await fetchProductsFromCategory(categoryLink);
      
      if (products.length === 0) continue;
      
      // Get the category ID for these products
      const categoryId = categoryIds[ourCategory];
      
      if (!categoryId) {
        console.warn(`Category "${ourCategory}" not found in database. Skipping ${products.length} products.`);
        continue;
      }
      
      // Add category ID to all products
      const productsWithCategory = products.map(product => ({
        ...product,
        category_id: categoryId
      }));
      
      // Insert products into database
      const { data: insertedProducts, error: insertError } = await supabase
        .from('products')
        .insert(productsWithCategory)
        .select();
      
      if (insertError) {
        console.error(`Error inserting products for category ${ourCategory}:`, insertError);
        continue;
      }
      
      console.log(`Successfully imported ${insertedProducts.length} products into category "${ourCategory}"`);
      totalImported += insertedProducts.length;
    }
    
    console.log(`Import completed. Total products imported: ${totalImported}`);
    
  } catch (error) {
    console.error('Error during product import:', error);
  }
}

// Run the import function
importProducts()
  .then(() => console.log('Import process completed.'))
  .catch(err => console.error('Import process failed:', err));

