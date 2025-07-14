// This script seeds the categories table with initial data

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define categories
const categories = [
  {
    name: 'Resistors',
    description: 'Electronic components that resist the flow of electrical current.'
  },
  {
    name: 'Capacitors',
    description: 'Electronic components that store electrical energy in an electric field.'
  },
  {
    name: 'Inductors',
    description: 'Passive electronic components that store energy in a magnetic field when electric current flows through it.'
  },
  {
    name: 'Integrated Circuits',
    description: 'Electronic components that integrate multiple electronic functions on a single semiconductor substrate.'
  },
  {
    name: 'Transistors',
    description: 'Semiconductor devices used to amplify or switch electronic signals and electrical power.'
  },
  {
    name: 'Diodes',
    description: 'Electronic components that allow current to flow in one direction only.'
  },
  {
    name: 'LEDs',
    description: 'Light-emitting diodes that emit light when current flows through them.'
  },
  {
    name: 'Sensors',
    description: 'Electronic components that detect and respond to some type of input from the physical environment.'
  },
  {
    name: 'Connectors',
    description: 'Electronic components that connect circuits together.'
  },
  {
    name: 'Power Supplies',
    description: 'Electronic components that supply electrical energy to an electrical load.'
  },
  {
    name: 'Microcontrollers',
    description: 'Small computers on a single integrated circuit containing a processor core, memory, and programmable input/output peripherals.'
  },
  {
    name: 'Development Boards',
    description: 'Printed circuit boards with a microcontroller and minimal supporting components for prototyping.'
  }
];

async function seedCategories() {
  console.log('Seeding categories...');
  
  for (const category of categories) {
    // Check if category already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category.name)
      .single();
    
    if (!checkError && existingCategory) {
      console.log(`Category '${category.name}' already exists with ID: ${existingCategory.id}`);
      continue;
    }
    
    // Insert category
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error(`Error inserting category '${category.name}':`, error);
    } else {
      console.log(`Added category '${data.name}' with ID: ${data.id}`);
    }
  }
  
  console.log('Category seeding completed.');
}

// Run the function
seedCategories()
  .catch(err => {
    console.error('Error in script execution:', err);
  })
  .finally(() => {
    process.exit(0);
  });

