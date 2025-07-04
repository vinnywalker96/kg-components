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

// Initial categories data
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
    name: 'Integrated Circuits',
    description: 'Microchips that contain thousands or millions of tiny electronic components.'
  },
  {
    name: 'Transistors',
    description: 'Semiconductor devices used to amplify or switch electronic signals.'
  },
  {
    name: 'Diodes',
    description: 'Electronic components that allow current to flow in only one direction.'
  },
  {
    name: 'LEDs',
    description: 'Light-emitting diodes that produce light when current flows through them.'
  },
  {
    name: 'Sensors',
    description: 'Devices that detect changes in the environment and send information to other electronics.'
  },
  {
    name: 'Connectors',
    description: 'Components used to join electrical circuits together.'
  },
  {
    name: 'Power Supplies',
    description: 'Devices that supply electric power to an electrical load.'
  },
  {
    name: 'Development Boards',
    description: 'Circuit boards with a microcontroller and minimal support components.'
  }
];

async function seedCategories() {
  console.log('Starting to seed categories...');
  
  try {
    // Insert categories
    const { data, error } = await supabase
      .from('categories')
      .upsert(
        categories.map(category => ({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'name' }
      );
    
    if (error) {
      throw error;
    }
    
    console.log('Categories seeded successfully!');
    
    // Get all categories to verify
    const { data: allCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`Total categories in database: ${allCategories.length}`);
    console.log('Categories:', allCategories.map(c => c.name).join(', '));
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Run the seed function
seedCategories()
  .then(() => {
    console.log('Seeding completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });

