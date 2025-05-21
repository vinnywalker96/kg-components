import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to import categories
async function importCategories() {
  try {
    const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
    
    if (!fs.existsSync(categoriesPath)) {
      console.error('Categories file not found. Please run the scraper first.');
      return;
    }
    
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    console.log(`Importing ${categoriesData.length} categories...`);
    
    // Prepare categories for import
    const categories = categoriesData.map(category => ({
      name: category.name,
      description: `${category.name} from Mantech`,
      image_url: null,
      slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
      external_url: category.url
    }));
    
    // Insert categories into Supabase
    const { data, error } = await supabase
      .from('categories')
      .upsert(categories, { 
        onConflict: 'slug',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error importing categories:', error);
      return;
    }
    
    console.log(`Successfully imported ${categories.length} categories.`);
    return true;
  } catch (error) {
    console.error('Error in importCategories:', error);
    return false;
  }
}

// Function to import products
async function importProducts() {
  try {
    const allProductsPath = path.join(process.cwd(), 'data', 'all_products.json');
    
    if (!fs.existsSync(allProductsPath)) {
      console.error('Products file not found. Please run the scraper first.');
      return;
    }
    
    const productsData = JSON.parse(fs.readFileSync(allProductsPath, 'utf8'));
    
    console.log(`Importing ${productsData.length} products...`);
    
    // Get categories from Supabase to map names to IDs
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    // Create a map of category names to IDs
    const categoryMap = {};
    categoriesData.forEach(category => {
      categoryMap[category.name] = category.id;
      // Also map with lowercase for case-insensitive matching
      categoryMap[category.name.toLowerCase()] = category.id;
    });
    
    // Prepare products for import
    const products = productsData.map(product => {
      // Find category ID
      let categoryId = null;
      if (product.category) {
        categoryId = categoryMap[product.category] || categoryMap[product.category.toLowerCase()];
      }
      
      // Parse price if available
      let price = 0;
      if (product.price) {
        // Remove 'R' and convert to number
        const priceStr = product.price.replace('R', '').trim();
        price = parseFloat(priceStr) || 0;
      }
      
      return {
        name: product.part_number || product.code,
        description: product.description || '',
        price: price,
        stock: Math.floor(Math.random() * 100) + 1, // Random stock for demo
        image_url: null,
        category_id: categoryId,
        sku: product.code,
        manufacturer: product.manufacturer || '',
        featured: Math.random() < 0.1, // 10% chance to be featured
        external_url: product.url,
        part_number: product.part_number || ''
      };
    });
    
    // Insert products in batches to avoid timeouts
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('products')
        .upsert(batch, { 
          onConflict: 'sku',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`Error importing products batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`Successfully imported products batch ${i / batchSize + 1} of ${Math.ceil(products.length / batchSize)}`);
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Finished importing ${products.length} products.`);
    return true;
  } catch (error) {
    console.error('Error in importProducts:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting import process...');
  
  // Import categories first
  const categoriesImported = await importCategories();
  
  if (categoriesImported) {
    // Then import products
    await importProducts();
  }
  
  console.log('Import process completed.');
}

main();

