# KG-Components E-Commerce Platform

A modern e-commerce platform built with Next.js, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure login and registration with Supabase Auth
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add products to cart, update quantities, and checkout
- **Order Management**: View order history and track order status
- **Admin Dashboard**: Manage products, orders, users, and store settings
- **Email Notifications**: Automated order confirmations and invoices
- **Banking Integration**: Configure banking details for invoice payments
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works for development)

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
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase URL and anon key from your Supabase project
   - Add SMTP details for email functionality

4. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL editor
   - Set up Supabase Edge Functions for email functionality

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following database tables:

- `profiles`: User profiles extending Supabase Auth
- `products`: Product information
- `categories`: Product categories
- `cart_items`: Items in user carts
- `orders`: Order information
- `order_items`: Items within orders
- `banking_details`: Banking information for invoices

## Supabase Edge Functions

The application uses Supabase Edge Functions for:

- Sending order confirmation emails
- Sending invoices with banking details

To deploy the Edge Functions:

1. Install Supabase CLI
2. Navigate to the `supabase/functions` directory
3. Deploy the functions:
   ```bash
   supabase functions deploy send-invoice
   ```

## Admin Access

To create an admin user:

1. Register a new user through the application
2. In the Supabase dashboard, navigate to the `profiles` table
3. Find your user and change the `role` field from `user` to `admin`
4. Log out and log back in to access admin features

## User Portal

The user portal allows customers to:

1. Browse and search products
2. Add products to their cart
3. Checkout and create orders
4. View order history and status
5. Receive email invoices with payment instructions

## Admin Portal

The admin portal allows store administrators to:

1. Manage products and categories
2. Process and update orders
3. Manage users
4. Configure store settings
5. Set up banking details for invoices
6. Send invoices to customers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

