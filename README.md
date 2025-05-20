# KG-Components - Electronic Components E-commerce Platform

KG-Components is a full-stack SaaS application for ordering electronic components. This platform provides a comprehensive solution for both customers and administrators to manage electronic component orders.

## Features

### Customer Features
- **Browse Products**: Explore products across multiple categories (Tools, Accessories, Components, Power Products, Test and Measurements)
- **User Authentication**: Secure login and signup functionality
- **User Portal**: Manage account details and view order history
- **Shopping Cart**: Add products to cart and proceed to checkout
- **Order Tracking**: Track the status of placed orders

### Admin Features
- **Product Management**: Add, edit, and remove products
- **Category Management**: Create and manage product categories
- **Order Management**: Process orders and update order status
- **User Management**: View and manage user accounts
- **Dashboard**: View sales analytics and key metrics

## Pages
- **Home**: Landing page showcasing featured products and categories
- **About**: Information about the company and its mission
- **Contact**: Contact form and company information
- **Login/Signup**: User authentication pages
- **Shop**: Browse and search for products
- **Product Detail**: Detailed view of individual products
- **Cart**: View and manage items in shopping cart
- **User Portal**: User account management
- **Admin Dashboard**: Comprehensive admin interface

## Technology Stack

### Frontend
- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- Zustand for state management
- React Query for data fetching
- Three.js for 3D product visualization

### Backend
- Supabase for authentication, database, and storage
- PostgreSQL database
- Supabase Edge Functions for serverless functionality

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kg-components.git
cd kg-components
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Database Schema

The application uses the following database tables:
- `products`: Stores product information
- `categories`: Stores product categories
- `user_profiles`: Stores user profile information
- `orders`: Stores order information
- `order_items`: Stores items within orders
- `cart_items`: Stores items in user carts

## Deployment

This application can be deployed to any hosting service that supports Node.js applications, such as:
- Vercel
- Netlify
- AWS Amplify
- Heroku

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.io/) for backend services
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for the build tool

