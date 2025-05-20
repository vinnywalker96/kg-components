-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the required categories if they don't exist
INSERT INTO categories (name, description)
VALUES 
  ('Tools', 'High-quality tools for electronics work including soldering equipment, hand tools, and workstation accessories'),
  ('Accessories', 'Essential accessories for electronic projects including development boards, cables, and connectors'),
  ('Components', 'Electronic components including resistors, capacitors, ICs, transistors, and more'),
  ('Power Products', 'Power supplies, converters, batteries, and charging solutions for electronic devices'),
  ('Test and Measurements', 'Test equipment including multimeters, oscilloscopes, signal generators, and analyzers')
ON CONFLICT (name) DO NOTHING;

