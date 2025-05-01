
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, ProductWithCategory } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProductState {
  products: ProductWithCategory[];
  categories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  fetchProducts: (categoryId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: string) => ProductWithCategory | undefined;
  setSelectedCategory: (categoryId: string | null) => void;
  searchProducts: (query: string) => Promise<void>;
  importDemoProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,

  fetchProducts: async (categoryId) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(*)
        `);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query.order("name");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      set({ products: data || [] });
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      set({ categories: data || [] });
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  },

  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    get().fetchProducts(categoryId || undefined);
  },

  searchProducts: async (query) => {
    if (!query) {
      return get().fetchProducts(get().selectedCategory || undefined);
    }

    set({ isLoading: true });
    try {
      let dbQuery = supabase
        .from("products")
        .select(`
          *,
          category:categories(*)
        `)
        .ilike("name", `%${query}%`);

      if (get().selectedCategory) {
        dbQuery = dbQuery.eq("category_id", get().selectedCategory);
      }

      const { data, error } = await dbQuery.order("name");

      if (error) {
        console.error("Error searching products:", error);
        return;
      }

      set({ products: data || [] });
    } catch (error) {
      console.error("Product search error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  importDemoProducts: async () => {
    set({ isLoading: true });
    
    try {
      // First, check if we already have products
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        throw new Error(`Error checking products: ${countError.message}`);
      }
      
      if (count && count > 0) {
        toast({
          title: "Products already exist",
          description: "Sample products have already been imported.",
        });
        return;
      }
      
      // Get existing categories
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*");
        
      if (catError) {
        throw new Error(`Error fetching categories: ${catError.message}`);
      }
      
      if (!categories || categories.length === 0) {
        toast({
          title: "No categories found",
          description: "Please create categories before importing products.",
          variant: "destructive"
        });
        return;
      }
      
      // Sample products from ManTech by category
      const demoProducts: Array<{
        name: string;
        description: string;
        price: number;
        category_id: string;
        stock_quantity: number;
        image_url?: string;
      }> = [];
      
      // Tools category products
      const toolsCategory = categories.find(c => c.name === "Tools");
      if (toolsCategory) {
        demoProducts.push(
          {
            name: "Weller WE1010NA Digital Soldering Station",
            description: "70W digital soldering station with LCD display, temperature stability, and sleep mode function.",
            price: 149.95,
            category_id: toolsCategory.id,
            stock_quantity: 15,
            image_url: "https://mantech.co.za/Product/Image?product=WE1010NA&ss=0"
          },
          {
            name: "Engineer PA-09 Micro Diagonal Cutters",
            description: "Precision micro diagonal cutters with sharp blades for fine electronics work.",
            price: 38.50,
            category_id: toolsCategory.id,
            stock_quantity: 30
          },
          {
            name: "Pro'sKit PK-2086B Anti-Static Tweezers",
            description: "Anti-static fine tip tweezers for SMD component handling and repair.",
            price: 12.99,
            category_id: toolsCategory.id,
            stock_quantity: 50
          }
        );
      }
      
      // Test and Measurements category products
      const testCategory = categories.find(c => c.name === "Test and Measurements");
      if (testCategory) {
        demoProducts.push(
          {
            name: "Rigol DS1054Z Digital Oscilloscope",
            description: "50MHz bandwidth, 4 channels, 1GSa/s sample rate digital oscilloscope.",
            price: 379.00,
            category_id: testCategory.id,
            stock_quantity: 8,
            image_url: "https://mantech.co.za/Product/Image?product=DS1054Z&ss=0"
          },
          {
            name: "Fluke 117 Electricians Multimeter",
            description: "Digital multimeter with non-contact voltage detection for electrical troubleshooting.",
            price: 199.95,
            category_id: testCategory.id,
            stock_quantity: 12
          },
          {
            name: "Hantek DSO5102P Digital Storage Oscilloscope",
            description: "100MHz bandwidth, 2 channels, 1GSa/s sample rate digital oscilloscope with USB connectivity.",
            price: 299.00,
            category_id: testCategory.id,
            stock_quantity: 5
          }
        );
      }
      
      // Power Products category products
      const powerCategory = categories.find(c => c.name === "Power Products");
      if (powerCategory) {
        demoProducts.push(
          {
            name: "Meanwell LRS-350-24 Power Supply",
            description: "24V 14.6A 350W Single Output Switching Power Supply.",
            price: 45.99,
            category_id: powerCategory.id,
            stock_quantity: 25,
            image_url: "https://mantech.co.za/Product/Image?product=LRS-350-24&ss=0"
          },
          {
            name: "FTDI USB-C to TTL Serial Converter",
            description: "3.3V/5V USB-C to UART TTL Serial Converter with FT232RL chip.",
            price: 18.50,
            category_id: powerCategory.id,
            stock_quantity: 40
          },
          {
            name: "LM2596 DC-DC Buck Converter",
            description: "Step-Down Power Module with display, 3A adjustable regulator.",
            price: 8.99,
            category_id: powerCategory.id,
            stock_quantity: 100
          }
        );
      }
      
      // Instruments category products
      const instrumentsCategory = categories.find(c => c.name === "Instruments");
      if (instrumentsCategory) {
        demoProducts.push(
          {
            name: "JBC CD-2BE Soldering Station",
            description: "High performance compact soldering station with sleep and hibernation modes.",
            price: 450.00,
            category_id: instrumentsCategory.id,
            stock_quantity: 5,
            image_url: "https://mantech.co.za/Product/Image?product=CD-2BE&ss=0"
          },
          {
            name: "Hakko FX-888D Digital Soldering Station",
            description: "Digital display soldering station with temperature control and preset temperatures.",
            price: 129.95,
            category_id: instrumentsCategory.id,
            stock_quantity: 18
          },
          {
            name: "Atten ST-862D Hot Air Rework Station",
            description: "Hot air rework station with digital display, temperature control, and auto-cooling.",
            price: 189.00,
            category_id: instrumentsCategory.id,
            stock_quantity: 7
          }
        );
      }
      
      // Accessories category products
      const accessoriesCategory = categories.find(c => c.name === "Accessories");
      if (accessoriesCategory) {
        demoProducts.push(
          {
            name: "Arduino Uno R3 Development Board",
            description: "ATmega328P microcontroller board with 14 digital I/O pins and 6 analog inputs.",
            price: 24.95,
            category_id: accessoriesCategory.id,
            stock_quantity: 35,
            image_url: "https://mantech.co.za/Product/Image?product=A000066&ss=0"
          },
          {
            name: "Raspberry Pi 4 Model B 4GB",
            description: "Single-board computer with 4GB RAM, WiFi, Bluetooth, and dual 4K display support.",
            price: 59.99,
            category_id: accessoriesCategory.id,
            stock_quantity: 20
          },
          {
            name: "ESP32 Development Board",
            description: "Dual-core microcontroller with WiFi and Bluetooth for IoT applications.",
            price: 12.50,
            category_id: accessoriesCategory.id,
            stock_quantity: 45
          }
        );
      }

      // Insert all demo products
      if (demoProducts.length === 0) {
        toast({
          title: "No products added",
          description: "Couldn't match categories with sample products",
          variant: "destructive"
        });
        return;
      }

      const { error: insertError } = await supabase
        .from("products")
        .insert(demoProducts);

      if (insertError) {
        throw new Error(`Error importing products: ${insertError.message}`);
      }

      toast({
        title: "Demo products imported",
        description: `Successfully imported ${demoProducts.length} products from ManTech.`,
      });

      // Refresh the products list
      await get().fetchProducts();
      
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive"
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));
