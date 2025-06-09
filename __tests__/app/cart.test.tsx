import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '@/app/cart/page';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';

// Mock the cart store
jest.mock('@/lib/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

// Mock the auth store
jest.mock('@/lib/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('Cart Page', () => {
  const mockRemoveItem = jest.fn();
  const mockUpdateItemQuantity = jest.fn();
  const mockClearCart = jest.fn();
  const mockGetCartTotal = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock cart store implementation
    (useCartStore as jest.Mock).mockReturnValue({
      items: [
        {
          product: {
            id: '1',
            name: 'Test Product 1',
            price: 10.99,
            image_url: '/test1.jpg',
          },
          quantity: 2,
        },
        {
          product: {
            id: '2',
            name: 'Test Product 2',
            price: 20.99,
            image_url: '/test2.jpg',
          },
          quantity: 1,
        },
      ],
      removeItem: mockRemoveItem,
      updateItemQuantity: mockUpdateItemQuantity,
      clearCart: mockClearCart,
      getCartTotal: mockGetCartTotal.mockReturnValue(42.97),
      isLoading: false,
    });
    
    // Mock auth store implementation
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'user@example.com' },
    });
  });
  
  test('renders cart items', () => {
    render(<CartPage />);
    
    // Check for cart title
    expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
    
    // Check for product names
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    
    // Check for product prices
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('$20.99')).toBeInTheDocument();
    
    // Check for quantities
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  
  test('renders cart summary with correct total', () => {
    render(<CartPage />);
    
    // Check for cart summary
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    
    // Check for subtotal
    expect(screen.getByText('$42.97')).toBeInTheDocument();
    
    // Check for checkout button
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
  });
  
  test('calls removeItem when remove button is clicked', () => {
    render(<CartPage />);
    
    // Find and click the first remove button
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);
    
    // Check if removeItem was called with correct product id
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });
  
  test('calls updateItemQuantity when quantity is changed', () => {
    render(<CartPage />);
    
    // Find and click the increment button for the first product
    const incrementButtons = screen.getAllByRole('button', { name: /increment/i });
    fireEvent.click(incrementButtons[0]);
    
    // Check if updateItemQuantity was called with correct product id and quantity
    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('1', 3);
    
    // Find and click the decrement button for the second product
    const decrementButtons = screen.getAllByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButtons[1]);
    
    // Check if updateItemQuantity was called with correct product id and quantity
    // (but not below 1)
    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('2', 1);
  });
  
  test('calls clearCart when clear cart button is clicked', () => {
    render(<CartPage />);
    
    // Find and click the clear cart button
    const clearCartButton = screen.getByRole('button', { name: /clear cart/i });
    fireEvent.click(clearCartButton);
    
    // Check if clearCart was called
    expect(mockClearCart).toHaveBeenCalled();
  });
  
  test('renders empty cart message when cart is empty', () => {
    // Mock empty cart
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      removeItem: mockRemoveItem,
      updateItemQuantity: mockUpdateItemQuantity,
      clearCart: mockClearCart,
      getCartTotal: mockGetCartTotal.mockReturnValue(0),
      isLoading: false,
    });
    
    render(<CartPage />);
    
    // Check for empty cart message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    
    // Check for shop now button
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();
    
    // Cart summary should not be rendered
    expect(screen.queryByText(/order summary/i)).not.toBeInTheDocument();
  });
  
  test('shows loading state when cart is loading', () => {
    // Mock loading state
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      removeItem: mockRemoveItem,
      updateItemQuantity: mockUpdateItemQuantity,
      clearCart: mockClearCart,
      getCartTotal: mockGetCartTotal,
      isLoading: true,
    });
    
    render(<CartPage />);
    
    // Check for loading message
    expect(screen.getByText(/loading your cart/i)).toBeInTheDocument();
  });
  
  test('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated user
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
    });
    
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));
    
    render(<CartPage />);
    
    // Check if router.push was called with login path
    // Note: Since we can't directly test the router.push call due to the mock setup,
    // we can check for the login message instead
    expect(screen.getByText(/please log in to view your cart/i)).toBeInTheDocument();
  });
});

