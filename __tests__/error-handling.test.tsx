import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useProductStore } from '@/lib/store/productStore';
import { useToast } from '@/lib/hooks/use-toast';
import AuthPage from '@/app/auth/page';
import CartPage from '@/app/cart/page';

// Mock the stores
jest.mock('@/lib/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/lib/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

jest.mock('@/lib/store/productStore', () => ({
  useProductStore: jest.fn(),
}));

// Mock the toast hook
jest.mock('@/lib/hooks/use-toast', () => ({
  useToast: jest.fn(),
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

describe('Error Handling', () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockAddToCart = jest.fn();
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock toast implementation
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });
  
  test('handles authentication errors', async () => {
    // Mock auth store with error
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin.mockRejectedValue({ message: 'Invalid credentials' }),
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    render(<AuthPage />);
    
    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });
    fireEvent.click(loginButton);
    
    // Wait for the async login function to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrong-password');
    });
    
    // Check if toast was called with error message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining('Invalid credentials'),
          variant: 'destructive',
        })
      );
    });
  });
  
  test('handles signup validation errors', async () => {
    // Mock auth store
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    render(<AuthPage />);
    
    // Switch to signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Fill in signup form with mismatched passwords
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different-password' } });
    fireEvent.click(createAccountButton);
    
    // Check if toast was called with error message
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
    );
    
    // Signup function should not be called
    expect(mockSignup).not.toHaveBeenCalled();
  });
  
  test('handles empty form submission', async () => {
    // Mock auth store
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    render(<AuthPage />);
    
    // Submit empty login form
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    // Check if toast was called with error message
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
    );
    
    // Login function should not be called
    expect(mockLogin).not.toHaveBeenCalled();
  });
  
  test('handles cart errors', async () => {
    // Mock auth store with authenticated user
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      profile: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    // Mock cart store with error
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      addItem: mockAddToCart.mockImplementation(() => {
        throw new Error('Failed to add item to cart');
      }),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getItemCount: jest.fn().mockReturnValue(0),
      isLoading: false,
      error: { message: 'Failed to load cart' },
    });
    
    render(<CartPage />);
    
    // Check if error message is displayed
    expect(screen.getByText(/failed to load cart/i)).toBeInTheDocument();
  });
  
  test('handles product loading errors', async () => {
    // Mock product store with error
    (useProductStore as jest.Mock).mockReturnValue({
      products: [],
      categories: [],
      fetchProducts: jest.fn(),
      fetchCategories: jest.fn(),
      selectedCategory: null,
      searchQuery: '',
      priceRange: [0, 1000],
      sortOption: 'name-asc',
      setSelectedCategory: jest.fn(),
      setSearchQuery: jest.fn(),
      setPriceRange: jest.fn(),
      setSortOption: jest.fn(),
      resetFilters: jest.fn(),
      getFilteredProducts: jest.fn().mockReturnValue([]),
      isLoading: false,
      error: { message: 'Failed to load products' },
    });
    
    // Mock auth store with authenticated user
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      profile: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    // Mock cart store
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      addItem: mockAddToCart,
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getItemCount: jest.fn().mockReturnValue(0),
      isLoading: false,
      error: null,
    });
    
    render(<CartPage />);
    
    // Check if empty cart message is displayed (since products failed to load)
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
  
  test('handles network errors', async () => {
    // Mock auth store with network error
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin.mockRejectedValue({ message: 'Network error' }),
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
    
    render(<AuthPage />);
    
    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Wait for the async login function to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Check if toast was called with error message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining('Network error'),
          variant: 'destructive',
        })
      );
    });
  });
  
  test('handles loading states', async () => {
    // Mock auth store with loading state
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin,
      signup: mockSignup,
      isLoading: true,
      error: null,
    });
    
    render(<AuthPage />);
    
    // Check if loading state is displayed
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    
    // Switch to signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Check if loading state is displayed in signup form
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
});

