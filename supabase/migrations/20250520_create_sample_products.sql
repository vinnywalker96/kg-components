-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products for Tools category
DO $$
DECLARE
  tools_id UUID;
BEGIN
  SELECT id INTO tools_id FROM categories WHERE name = 'Tools';
  
  IF tools_id IS NOT NULL THEN
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
      ('Weller WE1010NA Digital Soldering Station', '70W digital soldering station with LCD display, temperature stability, and sleep mode function.', 149.95, 15, tools_id, 'https://m.media-amazon.com/images/I/71Y7wFIFPXL._AC_SL1500_.jpg'),
      ('Engineer PA-09 Micro Diagonal Cutters', 'Precision micro diagonal cutters with sharp blades for fine electronics work.', 38.50, 30, tools_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('Pro''sKit PK-2086B Anti-Static Tweezers', 'Anti-static fine tip tweezers for SMD component handling and repair.', 12.99, 50, tools_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('iFixit Pro Tech Toolkit', 'Professional toolkit with 64 precision bits for electronics repair.', 69.99, 20, tools_id, 'https://m.media-amazon.com/images/I/71yZ9LmJ+xL._AC_SL1500_.jpg'),
      ('Hakko FX-888D Digital Soldering Station', 'Digital display soldering station with temperature control and preset temperatures.', 129.95, 18, tools_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample products for Accessories category
DO $$
DECLARE
  accessories_id UUID;
BEGIN
  SELECT id INTO accessories_id FROM categories WHERE name = 'Accessories';
  
  IF accessories_id IS NOT NULL THEN
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
      ('Arduino Uno R3 Development Board', 'ATmega328P microcontroller board with 14 digital I/O pins and 6 analog inputs.', 24.95, 35, accessories_id, 'https://m.media-amazon.com/images/I/61vzXYbGZWL._AC_SL1000_.jpg'),
      ('Raspberry Pi 4 Model B 4GB', 'Single-board computer with 4GB RAM, WiFi, Bluetooth, and dual 4K display support.', 59.99, 20, accessories_id, 'https://m.media-amazon.com/images/I/71XIwK5G8IS._AC_SL1500_.jpg'),
      ('ESP32 Development Board', 'Dual-core microcontroller with WiFi and Bluetooth for IoT applications.', 12.50, 45, accessories_id, 'https://m.media-amazon.com/images/I/61eyMwgm2tL._AC_SL1000_.jpg'),
      ('Breadboard 830 Point Solderless', 'Solderless breadboard with 830 tie points for prototyping electronic circuits.', 9.99, 60, accessories_id, 'https://m.media-amazon.com/images/I/61Qgw+ZXDOL._AC_SL1000_.jpg'),
      ('Jumper Wire Kit', '120pcs multicolored dupont wire for breadboard connections.', 7.99, 75, accessories_id, 'https://m.media-amazon.com/images/I/71KI4fRYMaL._AC_SL1500_.jpg')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample products for Components category
DO $$
DECLARE
  components_id UUID;
BEGIN
  SELECT id INTO components_id FROM categories WHERE name = 'Components';
  
  IF components_id IS NOT NULL THEN
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
      ('Resistor Kit 1/4W', '600pcs 30 values resistor assortment kit from 0Ω to 1MΩ.', 14.99, 40, components_id, 'https://m.media-amazon.com/images/I/81+v+na0hxL._AC_SL1500_.jpg'),
      ('Capacitor Assortment Kit', '500pcs electrolytic capacitors ranging from 0.1uF to 1000uF.', 19.95, 35, components_id, 'https://m.media-amazon.com/images/I/71Yw0bAQUiL._AC_SL1500_.jpg'),
      ('LED Assortment Kit', '300pcs 3mm and 5mm LEDs in various colors with resistors.', 12.99, 50, components_id, 'https://m.media-amazon.com/images/I/71Yw0bAQUiL._AC_SL1500_.jpg'),
      ('Transistor Assortment Kit', '200pcs various NPN and PNP transistors for electronic projects.', 16.50, 30, components_id, 'https://m.media-amazon.com/images/I/71Yw0bAQUiL._AC_SL1500_.jpg'),
      ('IC Socket Assortment Kit', '100pcs DIP IC sockets from 6 pins to 40 pins.', 11.99, 45, components_id, 'https://m.media-amazon.com/images/I/71Yw0bAQUiL._AC_SL1500_.jpg')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample products for Power Products category
DO $$
DECLARE
  power_id UUID;
BEGIN
  SELECT id INTO power_id FROM categories WHERE name = 'Power Products';
  
  IF power_id IS NOT NULL THEN
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
      ('Meanwell LRS-350-24 Power Supply', '24V 14.6A 350W Single Output Switching Power Supply.', 45.99, 25, power_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('FTDI USB-C to TTL Serial Converter', '3.3V/5V USB-C to UART TTL Serial Converter with FT232RL chip.', 18.50, 40, power_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('LM2596 DC-DC Buck Converter', 'Step-Down Power Module with display, 3A adjustable regulator.', 8.99, 100, power_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('18650 Lithium Battery Holder', 'Battery holder for 18650 lithium batteries with wire leads.', 5.99, 80, power_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('12V 5A AC to DC Power Adapter', 'Universal 12V 5A power adapter with 5.5mm x 2.1mm plug.', 15.99, 60, power_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample products for Test and Measurements category
DO $$
DECLARE
  test_id UUID;
BEGIN
  SELECT id INTO test_id FROM categories WHERE name = 'Test and Measurements';
  
  IF test_id IS NOT NULL THEN
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
      ('Rigol DS1054Z Digital Oscilloscope', '50MHz bandwidth, 4 channels, 1GSa/s sample rate digital oscilloscope.', 379.00, 8, test_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('Fluke 117 Electricians Multimeter', 'Digital multimeter with non-contact voltage detection for electrical troubleshooting.', 199.95, 12, test_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('Hantek DSO5102P Digital Storage Oscilloscope', '100MHz bandwidth, 2 channels, 1GSa/s sample rate digital oscilloscope with USB connectivity.', 299.00, 5, test_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('Logic Analyzer USB 8 Channel', '8 channel 24MHz USB logic analyzer for debugging digital circuits.', 29.99, 15, test_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg'),
      ('Bench Power Supply 0-30V 0-5A', 'Adjustable DC bench power supply with digital display and current limiting.', 89.99, 10, test_id, 'https://m.media-amazon.com/images/I/61Zy5QQeAIL._AC_SL1500_.jpg')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

