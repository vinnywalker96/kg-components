require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCapacitorProduct() {
  console.log('Adding electrolytic capacitor product to database...');
  
  try {
    // First, ensure the Capacitors category exists
    const { data: existingCategory, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Capacitors')
      .single();
    
    let categoryId;
    
    if (categoryError || !existingCategory) {
      console.log('Capacitors category not found, creating it...');
      const { data: newCategory, error: createCategoryError } = await supabase
        .from('categories')
        .insert({
          name: 'Capacitors',
          description: 'Electronic components that store electrical energy in an electric field.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createCategoryError) {
        throw new Error(`Failed to create Capacitors category: ${createCategoryError.message}`);
      }
      
      categoryId = newCategory.id;
      console.log(`Created Capacitors category with ID: ${categoryId}`);
    } else {
      categoryId = existingCategory.id;
      console.log(`Found existing Capacitors category with ID: ${categoryId}`);
    }
    
    // Now add the capacitor product
    const capacitorProduct = {
      name: 'Electrolytic Capacitor 100uF 35V',
      description: 'ELECTROLYTIC CAPACITOR RADIAL 100uF 35V ST 8x12 P=3.5\nELECTROLYTIC RADIAL CAPACITOR, 85-DEGREES HIGH TEMPERATURE, LOW IMPEDANCE / LOW ESR, 8x12',
      price: 0.75, // Set an appropriate price
      stock: 100,  // Set initial stock
      image_url: '/images/products/electrolytic-capacitor-100uf-35v.jpg',
      category_id: categoryId,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Check if product already exists
    const { data: existingProduct, error: productCheckError } = await supabase
      .from('products')
      .select('id')
      .eq('name', capacitorProduct.name)
      .single();
    
    if (!productCheckError && existingProduct) {
      console.log(`Product "${capacitorProduct.name}" already exists with ID: ${existingProduct.id}`);
      console.log('Updating existing product...');
      
      const { error: updateError } = await supabase
        .from('products')
        .update({
          description: capacitorProduct.description,
          price: capacitorProduct.price,
          stock: capacitorProduct.stock,
          image_url: capacitorProduct.image_url,
          updated_at: capacitorProduct.updated_at
        })
        .eq('id', existingProduct.id);
      
      if (updateError) {
        throw new Error(`Failed to update product: ${updateError.message}`);
      }
      
      console.log(`Successfully updated product "${capacitorProduct.name}"`);
    } else {
      // Insert new product
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert(capacitorProduct)
        .select()
        .single();
      
      if (insertError) {
        throw new Error(`Failed to insert product: ${insertError.message}`);
      }
      
      console.log(`Successfully added product "${capacitorProduct.name}" with ID: ${newProduct.id}`);
    }
    
    console.log('Product operation completed successfully!');
    
  } catch (error) {
    console.error('Error adding capacitor product:', error);
  }
}

// Run the function
addCapacitorProduct()
  .then(() => {
    console.log('Script completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });

