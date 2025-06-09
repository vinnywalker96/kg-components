import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useProductStore } from '@/lib/store/productStore';

// Mock the product store
jest.mock('@/lib/store/productStore', () => ({
  useProductStore: jest.fn(),
}));

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    // Mock the product store implementation
    (useProductStore as jest.Mock).mockReturnValue({
      products: [
        {
          id: '1',
          name: 'Featured Product 1',
          price: 10.99,
          description: 'Description 1',
          image_url: '/product1.jpg',
          featured: true,
        },
        {
          id: '2',
          name: 'Featured Product 2',
          price: 20.99,
          description: 'Description 2',
          image_url: '/product2.jpg',
          featured: true,
        },
        {
          id: '3',
          name: 'Regular Product',
          price: 15.99,
          description: 'Description 3',
          image_url: '/product3.jpg',
          featured: false,
        },
      ],
      fetchProducts: jest.fn(),
      isLoading: false,
    });
  });
  
  test('renders hero section with title and call-to-action', () => {
    render(<HomePage />);
    
    // Check for hero section elements
    expect(screen.getByText(/electronic components/i)).toBeInTheDocument();
    expect(screen.getByText(/quality electronic components/i)).toBeInTheDocument();
    
    // Check for call-to-action button
    const shopNowButton = screen.getByRole('link', { name: /shop now/i });
    expect(shopNowButton).toBeInTheDocument();
    expect(shopNowButton).toHaveAttribute('href', '/shop');
  });
  
  test('renders featured products section', () => {
    render(<HomePage />);
    
    // Check for featured products section title
    expect(screen.getByText(/featured products/i)).toBeInTheDocument();
    
    // Check for featured product cards
    expect(screen.getByText('Featured Product 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Product 2')).toBeInTheDocument();
    
    // Regular products should not be displayed in featured section
    expect(screen.queryByText('Regular Product')).not.toBeInTheDocument();
  });
  
  test('renders category sections', () => {
    render(<HomePage />);
    
    // Check for category sections
    expect(screen.getByText(/shop by category/i)).toBeInTheDocument();
    
    // Check for specific categories
    const categories = [
      'Tools',
      'Accessories',
      'Components',
      'Power Products',
      'Test & Measurements',
    ];
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
  
  test('renders testimonials section', () => {
    render(<HomePage />);
    
    // Check for testimonials section
    expect(screen.getByText(/what our customers say/i)).toBeInTheDocument();
    
    // Check for at least one testimonial
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
  
  test('renders newsletter subscription section', () => {
    render(<HomePage />);
    
    // Check for newsletter section
    expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
    
    // Check for email input and subscribe button
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });
  
  test('calls fetchProducts on render', () => {
    const fetchProductsMock = jest.fn();
    (useProductStore as jest.Mock).mockReturnValue({
      products: [],
      fetchProducts: fetchProductsMock,
      isLoading: false,
    });
    
    render(<HomePage />);
    
    expect(fetchProductsMock).toHaveBeenCalledTimes(1);
  });
  
  test('shows loading state when products are loading', () => {
    (useProductStore as jest.Mock).mockReturnValue({
      products: [],
      fetchProducts: jest.fn(),
      isLoading: true,
    });
    
    render(<HomePage />);
    
    // Check for loading indicator
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });
});

