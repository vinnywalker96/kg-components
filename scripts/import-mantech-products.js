require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample products data
const products = [
  // Resistors
  {
    name: '10K Ohm Resistor Pack',
    description: 'Pack of 100 10K Ohm resistors, 1/4W, 5% tolerance',
    price: 4.99,
    stock: 50,
    image_url: 'https://example.com/images/10k-resistors.jpg',
    category_name: 'Resistors',
    featured: true
  },
  {
    name: 'Resistor Assortment Kit',
    description: '600pcs resistor kit with various values from 0 Ohm to 10M Ohm',
    price: 12.99,
    stock: 25,
    image_url: 'https://example.com/images/resistor-kit.jpg',
    category_name: 'Resistors',
    featured: false
  },
  
  // Capacitors
  {
    name: 'Ceramic Capacitor Kit',
    description: 'Assortment of ceramic capacitors from 1pF to 100nF',
    price: 9.99,
    stock: 30,
    image_url: 'https://example.com/images/ceramic-caps.jpg',
    category_name: 'Capacitors',
    featured: true
  },
  {
    name: 'Electrolytic Capacitor Set',
    description: 'Set of 120 electrolytic capacitors, various values',
    price: 14.99,
    stock: 20,
    image_url: 'https://example.com/images/electrolytic-caps.jpg',
    category_name: 'Capacitors',
    featured: false
  },
  
  // Integrated Circuits
  {
    name: '555 Timer IC',
    description: 'Classic 555 timer integrated circuit, DIP-8 package',
    price: 0.99,
    stock: 100,
    image_url: 'https://example.com/images/555-timer.jpg',
    category_name: 'Integrated Circuits',
    featured: true
  },
  {
    name: 'LM358 Op-Amp',
    description: 'Dual operational amplifier IC, DIP-8 package',
    price: 1.29,
    stock: 75,
    image_url: 'https://example.com/images/lm358.jpg',
    category_name: 'Integrated Circuits',
    featured: false
  },
  
  // Transistors
  {
    name: '2N2222 NPN Transistor',
    description: 'General purpose NPN transistor, TO-92 package',
    price: 0.25,
    stock: 200,
    image_url: 'https://example.com/images/2n2222.jpg',
    category_name: 'Transistors',
    featured: true
  },
  {
    name: 'TIP120 Darlington Transistor',
    description: 'NPN Darlington transistor, TO-220 package',
    price: 0.89,
    stock: 50,
    image_url: 'https://example.com/images/tip120.jpg',
    category_name: 'Transistors',
    featured: false
  },
  
  // Diodes
  {
    name: '1N4007 Diode',
    description: 'General purpose rectifier diode, 1000V 1A',
    price: 0.15,
    stock: 300,
    image_url: 'https://example.com/images/1n4007.jpg',
    category_name: 'Diodes',
    featured: false
  },
  {
    name: 'Zener Diode Kit',
    description: 'Assortment of zener diodes with various voltage ratings',
    price: 8.99,
    stock: 40,
    image_url: 'https://example.com/images/zener-kit.jpg',
    category_name: 'Diodes',
    featured: true
  },
  
  // LEDs
  {
    name: '5mm LED Assortment',
    description: '100pcs 5mm LEDs in various colors',
    price: 7.99,
    stock: 35,
    image_url: 'https://example.com/images/led-assortment.jpg',
    category_name: 'LEDs',
    featured: true
  },
  {
    name: 'RGB LED Strip',
    description: '5m waterproof RGB LED strip with controller',
    price: 19.99,
    stock: 15,
    image_url: 'https://example.com/images/led-strip.jpg',
    category_name: 'LEDs',
    featured: true
  },
  
  // Sensors
  {
    name: 'DHT22 Temperature & Humidity Sensor',
    description: 'Digital temperature and humidity sensor module',
    price: 3.99,
    stock: 45,
    image_url: 'https://example.com/images/dht22.jpg',
    category_name: 'Sensors',
    featured: true
  },
  {
    name: 'HC-SR04 Ultrasonic Sensor',
    description: 'Ultrasonic distance measuring sensor module',
    price: 2.49,
    stock: 60,
    image_url: 'https://example.com/images/hcsr04.jpg',
    category_name: 'Sensors',
    featured: false
  },
  
  // Connectors
  {
    name: 'Dupont Wire Jumper Kit',
    description: '120pcs male-to-male, male-to-female, female-to-female jumper wires',
    price: 6.99,
    stock: 50,
    image_url: 'https://example.com/images/dupont-wires.jpg',
    category_name: 'Connectors',
    featured: true
  },
  {
    name: 'Screw Terminal Block Set',
    description: 'Assorted PCB screw terminal blocks',
    price: 8.49,
    stock: 30,
    image_url: 'https://example.com/images/terminal-blocks.jpg',
    category_name: 'Connectors',
    featured: false
  },
  
  // Power Supplies
  {
    name: 'Adjustable DC Power Supply Module',
    description: 'LM2596 DC-DC buck converter step-down power module',
    price: 4.99,
    stock: 40,
    image_url: 'https://example.com/images/buck-converter.jpg',
    category_name: 'Power Supplies',
    featured: true
  },
  {
    name: '9V 1A Power Adapter',
    description: 'AC to DC 9V 1A power adapter with 5.5mm x 2.1mm plug',
    price: 7.99,
    stock: 25,
    image_url: 'https://example.com/images/9v-adapter.jpg',
    category_name: 'Power Supplies',
    featured: false
  },
  
  // Development Boards
  {
    name: 'Arduino Uno R3',
    description: 'Arduino Uno R3 development board with ATmega328P microcontroller',
    price: 22.99,
    stock: 30,
    image_url: 'https://example.com/images/arduino-uno.jpg',
    category_name: 'Development Boards',
    featured: true
  },
  {
    name: 'Raspberry Pi 4 Model B - 4GB',
    description: 'Raspberry Pi 4 Model B with 4GB RAM',
    price: 55.99,
    stock: 15,
    image_url: 'https://example.com/images/raspberry-pi-4.jpg',
    category_name: 'Development Boards',
    featured: true
  }
];

async function importProducts() {
  console.log('Starting to import products...');
  
  try {
    // Get all categories to map names to IDs
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (categoryError) {
      throw categoryError;
    }
    
    if (!categories || categories.length === 0) {
      throw new Error('No categories found. Please run seed-categories.js first.');
    }
    
    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category.id;
    });
    
    // Prepare products with category IDs
    const productsWithCategoryIds = products.map(product => {
      const categoryId = categoryMap[product.category_name];
      if (!categoryId) {
        console.warn(`Category "${product.category_name}" not found for product "${product.name}". Skipping.`);
        return null;
      }
      
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        category_id: categoryId,
        featured: product.featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }).filter(Boolean); // Remove null entries
    
    // Insert products
    const { data, error } = await supabase
      .from('products')
      .upsert(productsWithCategoryIds, { onConflict: 'name' });
    
    if (error) {
      throw error;
    }
    
    console.log(`Imported ${productsWithCategoryIds.length} products successfully!`);
    
    // Get count of products by category
    for (const category of categories) {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);
      
      if (countError) {
        console.error(`Error counting products for category ${category.name}:`, countError);
      } else {
        console.log(`Category "${category.name}": ${count} products`);
      }
    }
    
  } catch (error) {
    console.error('Error importing products:', error);
  }
}

// Run the import function
importProducts()
  .then(() => {
    console.log('Import completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });

