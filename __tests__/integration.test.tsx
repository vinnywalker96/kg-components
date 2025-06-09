import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useProductStore } from '@/lib/store/productStore';
import { useToast } from '@/lib/hooks/use-toast';
import AuthPage from '@/app/auth/page';
import CartPage from '@/app/cart/page';
import HomePage from '@/app/page';

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
  usePathname: () => '/',
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('Integration Tests', () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockAddToCart = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockFetchProducts = jest.fn();
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth store implementation
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin,
      signup: mockSignup,
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });
    
    // Mock cart store implementation
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      addItem: mockAddToCart,
      removeItem: mockRemoveFromCart,
      updateItemQuantity: mockUpdateQuantity,
      clearCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getItemCount: jest.fn().mockReturnValue(0),
      isLoading: false,
      error: null,
    });
    
    // Mock product store implementation
    (useProductStore as jest.Mock).mockReturnValue({
      products: [
        {
          id: '1',
          name: 'Test Product 1',
          price: 10.99,
          description: 'Test description 1',
          image_url: '/test1.jpg',
          category_id: 'cat1',
          featured: true,
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: 20.99,
          description: 'Test description 2',
          image_url: '/test2.jpg',
          category_id: 'cat2',
          featured: false,
        },
      ],
      categories: [
        { id: 'cat1', name: 'Category 1' },
        { id: 'cat2', name: 'Category 2' },
      ],
      fetchProducts: mockFetchProducts,
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
      getFilteredProducts: jest.fn().mockImplementation(function() {
        return this.products;
      }),
      isLoading: false,
      error: null,
    });
    
    // Mock toast implementation
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });
  
  test('user can sign up, browse products, and add to cart', async () => {
    // 1. Render the signup page and create an account
    const { unmount } = render(<AuthPage />);
    
    // Switch to signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Fill in signup form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(createAccountButton);
    
    // Check if signup function was called with correct data
    expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    
    // Cleanup
    unmount();
    
    // 2. Update auth store to simulate successful login
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      profile: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      login: mockLogin,
      signup: mockSignup,
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });
    
    // 3. Render the home page and browse products
    const { unmount: unmountHome } = render(<HomePage />);
    
    // Check if fetchProducts was called
    expect(mockFetchProducts).toHaveBeenCalled();
    
    // Check if featured product is displayed
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    
    // Cleanup
    unmountHome();
    
    // 4. Add a product to cart
    // Update product store to simulate product detail page
    (useProductStore as jest.Mock).mockReturnValue({
      products: [
        {
          id: '1',
          name: 'Test Product 1',
          price: 10.99,
          description: 'Test description 1',
          image_url: '/test1.jpg',
          category_id: 'cat1',
          featured: true,
        },
      ],
      getProduct: jest.fn().mockReturnValue({
        id: '1',
        name: 'Test Product 1',
        price: 10.99,
        description: 'Test description 1',
        image_url: '/test1.jpg',
        category_id: 'cat1',
        featured: true,
      }),
      // ... other properties from before
    });
    
    // Simulate adding product to cart
    mockAddToCart.mockImplementation((product, quantity) => {
      (useCartStore as jest.Mock).mockReturnValue({
        items: [
          {
            product: {
              id: '1',
              name: 'Test Product 1',
              price: 10.99,
              image_url: '/test1.jpg',
            },
            quantity: quantity,
          },
        ],
        addItem: mockAddToCart,
        removeItem: mockRemoveFromCart,
        updateItemQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        getCartTotal: jest.fn().mockReturnValue(10.99 * quantity),
        getItemCount: jest.fn().mockReturnValue(quantity),
        isLoading: false,
        error: null,
      });
    });
    
    // Add product to cart
    mockAddToCart({
      id: '1',
      name: 'Test Product 1',
      price: 10.99,
      image_url: '/test1.jpg',
    }, 2);
    
    // 5. View cart
    const { unmount: unmountCart } = render(<CartPage />);
    
    // Check if cart contains the added product
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Check if cart total is correct
    expect(screen.getByText('$21.98')).toBeInTheDocument();
    
    // Cleanup
    unmountCart();
  });
  
  test('authentication flow redirects correctly', async () => {
    // Mock router push function
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));
    
    // 1. Render auth page and login
    const { unmount } = render(<AuthPage />);
    
    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Check if login function was called with correct data
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    
    // Cleanup
    unmount();
    
    // 2. Update auth store to simulate successful login
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      profile: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      login: mockLogin,
      signup: mockSignup,
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });
    
    // 3. Render cart page when authenticated
    const { unmount: unmountCart } = render(<CartPage />);
    
    // Cart should be accessible (no redirect message)
    expect(screen.queryByText(/please log in to view your cart/i)).not.toBeInTheDocument();
    
    // Cleanup
    unmountCart();
    
    // 4. Update auth store to simulate logout
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      login: mockLogin,
      signup: mockSignup,
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });
    
    // 5. Render cart page when not authenticated
    render(<CartPage />);
    
    // Should show login message
    expect(screen.getByText(/please log in to view your cart/i)).toBeInTheDocument();
  });
  
  test('cart operations update cart state correctly', async () => {
    // Setup initial cart with one item
    (useCartStore as jest.Mock).mockReturnValue({
      items: [
        {
          product: {
            id: '1',
            name: 'Test Product 1',
            price: 10.99,
            image_url: '/test1.jpg',
          },
          quantity: 1,
        },
      ],
      addItem: mockAddToCart,
      removeItem: mockRemoveFromCart,
      updateItemQuantity: mockUpdateQuantity,
      clearCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(10.99),
      getItemCount: jest.fn().mockReturnValue(1),
      isLoading: false,
      error: null,
    });
    
    // Setup auth store with authenticated user
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      profile: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      login: mockLogin,
      signup: mockSignup,
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });
    
    // Render cart page
    const { rerender } = render(<CartPage />);
    
    // Check initial cart state
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Simulate updating quantity
    mockUpdateQuantity.mockImplementation((productId, quantity) => {
      (useCartStore as jest.Mock).mockReturnValue({
        items: [
          {
            product: {
              id: '1',
              name: 'Test Product 1',
              price: 10.99,
              image_url: '/test1.jpg',
            },
            quantity: quantity,
          },
        ],
        addItem: mockAddToCart,
        removeItem: mockRemoveFromCart,
        updateItemQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        getCartTotal: jest.fn().mockReturnValue(10.99 * quantity),
        getItemCount: jest.fn().mockReturnValue(quantity),
        isLoading: false,
        error: null,
      });
    });
    
    // Find and click the increment button
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    
    // Check if updateItemQuantity was called with correct product id and quantity
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
    
    // Update cart state and rerender
    mockUpdateQuantity('1', 2);
    rerender(<CartPage />);
    
    // Check updated quantity
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Simulate removing item
    mockRemoveFromCart.mockImplementation((productId) => {
      (useCartStore as jest.Mock).mockReturnValue({
        items: [],
        addItem: mockAddToCart,
        removeItem: mockRemoveFromCart,
        updateItemQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        getCartTotal: jest.fn().mockReturnValue(0),
        getItemCount: jest.fn().mockReturnValue(0),
        isLoading: false,
        error: null,
      });
    });
    
    // Find and click the remove button
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    // Check if removeItem was called with correct product id
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    
    // Update cart state and rerender
    mockRemoveFromCart('1');
    rerender(<CartPage />);
    
    // Check empty cart message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});

