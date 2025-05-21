# KG-Components E-commerce Application

KG-Components is a full-stack e-commerce application for ordering electronic components. This application includes a Home page, About page, Contact page, Login/Signup functionality, User portal, and Admin dashboard.

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order management
- Admin dashboard for managing products, categories, orders, and users
- Responsive design for all devices

## Product Categories

- Tools
- Accessories
- Components
- Power Products
- Test & Measurements
- And more...

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: Zustand
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kg-components.git
   cd kg-components
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Supabase Tables

Create the following tables in your Supabase project:

1. **users** (created automatically by Supabase Auth)

2. **profiles**
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade not null primary key,
     name text,
     email text,
     role text default 'user'::text,
     created_at timestamp with time zone default now()
   );
   ```

3. **categories**
   ```sql
   create table categories (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     description text,
     image_url text,
     slug text unique,
     external_url text,
     created_at timestamp with time zone default now()
   );
   ```

4. **products**
   ```sql
   create table products (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     description text,
     price numeric,
     stock integer default 0,
     image_url text,
     category_id uuid references categories,
     sku text unique,
     manufacturer text,
     part_number text,
     featured boolean default false,
     external_url text,
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now()
   );
   ```

5. **orders**
   ```sql
   create table orders (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     status text default 'pending'::text,
     total_amount numeric not null,
     shipping_address text,
     payment_status text default 'pending'::text,
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now()
   );
   ```

6. **order_items**
   ```sql
   create table order_items (
     id uuid default uuid_generate_v4() primary key,
     order_id uuid references orders on delete cascade not null,
     product_id uuid references products not null,
     quantity integer not null,
     price numeric not null,
     created_at timestamp with time zone default now()
   );
   ```

7. **cart_items**
   ```sql
   create table cart_items (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users on delete cascade not null,
     product_id uuid references products not null,
     quantity integer not null,
     created_at timestamp with time zone default now()
   );
   ```

## Scraping and Importing Products

This project includes scripts to scrape products from Mantech's website and import them into your Supabase database.

### Prerequisites

- Python 3.6 or higher
- Required Python packages: `requests`, `beautifulsoup4`
- Node.js and npm

### Running the Scraper

1. Make sure you have set up your Supabase credentials in the `.env.local` file.

2. Run the scraper script:
   ```bash
   chmod +x scripts/run_scraper.sh
   ./scripts/run_scraper.sh
   ```

   This script will:
   - Install required Python packages
   - Scrape product data from Mantech's website
   - Save the data to JSON files in the `data` directory
   - Install required Node.js packages
   - Import the data to your Supabase database

3. Alternatively, you can run the scripts individually:
   ```bash
   # Run the scraper
   python scripts/mantech_scraper.py
   
   # Import the data to Supabase
   node scripts/import_to_supabase.js
   ```

### Customizing the Scraper

You can customize the scraper by modifying the following parameters in `scripts/mantech_scraper.py`:

- `MAX_PAGES`: Maximum number of pages to scrape per category
- `CATEGORIES`: List of categories to scrape

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.

2. Create a new project on Vercel and import your GitHub repository.

3. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy the project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Mantech Electronics](https://mantech.co.za/) for product data

