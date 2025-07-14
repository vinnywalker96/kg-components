// This script adds the Electrolytic Capacitor product to the database

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addCapacitorProduct() {
  console.log('Adding Electrolytic Capacitor product to the database...');
  
  // First, check if the Capacitors category exists
  const { data: existingCategory, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Capacitors')
    .single();
  
  let categoryId;
  
  if (categoryError || !existingCategory) {
    // Create the Capacitors category if it doesn't exist
    console.log('Creating Capacitors category...');
    const { data: newCategory, error: createCategoryError } = await supabase
      .from('categories')
      .insert({
        name: 'Capacitors',
        description: 'Electronic components that store electrical energy in an electric field.'
      })
      .select()
      .single();
    
    if (createCategoryError) {
      console.error('Error creating Capacitors category:', createCategoryError);
      return;
    }
    
    categoryId = newCategory.id;
    console.log('Capacitors category created with ID:', categoryId);
  } else {
    categoryId = existingCategory.id;
    console.log('Found existing Capacitors category with ID:', categoryId);
  }
  
  // Check if the product already exists
  const { data: existingProduct, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('name', 'Electrolytic Capacitor 100uF 35V')
    .single();
  
  if (!productError && existingProduct) {
    console.log('Electrolytic Capacitor product already exists with ID:', existingProduct.id);
    return;
  }
  
  // Add the Electrolytic Capacitor product
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: 'Electrolytic Capacitor 100uF 35V',
      description: 'ELECTROLYTIC CAPACITOR RADIAL 100uF 35V ST 8x12 P=3.5\nELECTROLYTIC RADIAL CAPACITOR, 85-DEGREES HIGH TEMPERATURE, LOW IMPEDANCE / LOW ESR, 8x12',
      price: 0.75,
      stock: 100,
      category_id: categoryId,
      image_url: '/images/products/electrolytic-capacitor-100uf-35v.jpg',
      featured: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding Electrolytic Capacitor product:', error);
    return;
  }
  
  console.log('Electrolytic Capacitor product added successfully with ID:', product.id);
}

// Run the function
addCapacitorProduct()
  .catch(err => {
    console.error('Error in script execution:', err);
  })
  .finally(() => {
    process.exit(0);
  });

