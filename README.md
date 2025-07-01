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

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `db/schema.sql` in the Supabase SQL editor
3. Enable Email Auth in Supabase Authentication settings

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

