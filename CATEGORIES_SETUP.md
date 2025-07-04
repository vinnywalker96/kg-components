# Categories and Products Setup Guide

This guide explains how to set up product categories and import products from Mantech.co.za into your KG-Components store.

## Categories

The following categories have been set up in the system:

1. **Tools** - Hand tools, power tools, and specialized tools for electronics work
2. **Accessories** - Add-ons and accessories for electronic components and devices
3. **Instruments** - Measurement and testing instruments for electronic projects
4. **Components** - Electronic components including resistors, capacitors, ICs, and more
5. **Power Products** - Power supplies, batteries, chargers, and power management solutions
6. **Test and Measurements** - Equipment and tools for testing, measuring, and analyzing electronic circuits

## Setup Instructions

### Prerequisites

Before running the setup scripts, make sure you have:

1. Node.js installed (v14 or higher)
2. Supabase project set up with the correct schema
3. Environment variables configured in a `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Step 1: Seed Categories

Run the following command to create the categories in your database:

```bash
npm run seed:categories
```

This script will:
- Check for existing categories to avoid duplicates
- Create the six predefined categories if they don't already exist
- Display the results of the operation

### Step 2: Import Products from Mantech.co.za

After setting up the categories, you can import products from Mantech.co.za:

```bash
npm run import:products
```

This script will:
- Fetch category links from Mantech.co.za
- Map Mantech categories to your database categories
- Import up to 10 products per category (to avoid overwhelming the system)
- Add random stock values and featured status
- Display progress and results

## Manual Category Management

You can also manage categories manually through the admin interface:

1. Navigate to `/admin/categories` in your application
2. Use the "Add Category" button to create new categories
3. Edit existing categories by clicking the edit icon
4. View product counts for each category

## Troubleshooting

If you encounter issues:

1. **Database Connection Errors**: Verify your Supabase credentials in the `.env` file
2. **Missing Categories**: Run the `seed:categories` script before importing products
3. **Import Failures**: Check network connectivity to Mantech.co.za
4. **Permission Errors**: Ensure your Supabase service role key has the necessary permissions

## Next Steps

After setting up categories and importing products, you should:

1. Review the imported products in the admin interface
2. Add more detailed descriptions and adjust prices if needed
3. Upload higher quality product images
4. Set featured products for the homepage
5. Organize products into collections or promotions

