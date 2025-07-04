# KG Components

A Next.js e-commerce application with Supabase integration for authentication, user management, and product catalog.

## Features

- User authentication with Supabase Auth
- User portal for managing profile and orders
- Shopping cart functionality
- Order management with email notifications
- Admin dashboard for managing products, categories, orders, and users
- Role-based access control
- Banking details management for payment instructions
- Multilingual support (English and Portuguese)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Authentication, Database)
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Setup

1. Create a new Supabase project
2. Set up the following tables in your Supabase database:
   - profiles
   - categories
   - products
   - cart_items
   - orders
   - order_items
   - banking_details

3. You can use the seed scripts to populate initial data:
   ```bash
   npm run seed:categories
   npm run import:products
   ```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Configuration

### Authentication Setup

1. In your Supabase dashboard, go to Authentication → Settings
2. Enable Email provider
3. Configure any additional providers as needed (Google, GitHub, etc.)
4. Set up redirect URLs for authentication:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/reset-callback`

### Database Schema

The application uses the following database schema:

1. **profiles** - User profiles with role-based access
2. **categories** - Product categories
3. **products** - Product information
4. **cart_items** - Shopping cart items
5. **orders** - Order information
6. **order_items** - Items within orders
7. **banking_details** - Banking information for payment instructions

### Row Level Security (RLS)

For production, make sure to set up appropriate Row Level Security policies in Supabase to protect your data.

## Master Admin Account

The system is configured to automatically assign admin privileges to the account with email `vinnywalker96@gmail.com`. This is hardcoded in the database triggers and cannot be demoted through the UI.

## Project Structure

- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utility functions and services
- `types/` - TypeScript type definitions
- `db/` - Database schema and migrations
- `public/` - Static assets

## Authentication Flow

1. Users sign up or log in through the auth pages
2. Middleware checks authentication status and redirects accordingly
3. Protected routes require authentication
4. Admin routes require admin role

## Admin Features

- User management (promote/demote admins)
- Product and category management
- Order processing and status updates
- Banking details configuration for payment instructions

## User Features

- Profile management
- Shopping cart
- Order history
- Product browsing and filtering

## Deployment

The application is ready to be deployed on Vercel or any other Next.js-compatible hosting service.

```bash
# Build for production
npm run build

# Start production server
npm start
```
