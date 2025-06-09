import { useCartStore } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { act } from '@testing-library/react';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('CartStore', () => {
  let store: ReturnType<typeof useCartStore.getState>;
  
  const mockProduct1 = {
    id: '1',
    name: 'Test Product 1',
    price: 10.99,
    image_url: '/test1.jpg',
    category_id: 'cat1',
  };
  
  const mockProduct2 = {
    id: '2',
    name: 'Test Product 2',
    price: 20.99,
    image_url: '/test2.jpg',
    category_id: 'cat2',
  };
  
  beforeEach(() => {
    // Reset the store before each test
    useCartStore.setState({
      items: [],
      isLoading: false,
      error: null,
    });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the store state
    store = useCartStore.getState();
    
    // Mock Supabase client implementation
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
        insert: jest.fn(() => ({
          data: null,
          error: null,
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: null,
            error: null,
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    });
  });
  
  test('initial state', () => {
    expect(store.items).toEqual([]);
    expect(store.isLoading).toBeFalsy();
    expect(store.error).toBeNull();
  });
  
  test('addItem adds a new item to the cart', () => {
    act(() => {
      store.addItem(mockProduct1, 1);
    });
    
    const updatedStore = useCartStore.getState();
    expect(updatedStore.items).toHaveLength(1);
    expect(updatedStore.items[0]).toEqual({
      product: mockProduct1,
      quantity: 1,
    });
  });
  
  test('addItem increases quantity for existing item', () => {
    // Add item first time
    act(() => {
      store.addItem(mockProduct1, 1);
    });
    
    // Add same item again
    act(() => {
      store.addItem(mockProduct1, 2);
    });
    
    const updatedStore = useCartStore.getState();
    expect(updatedStore.items).toHaveLength(1);
    expect(updatedStore.items[0]).toEqual({
      product: mockProduct1,
      quantity: 3, // 1 + 2
    });
  });
  
  test('updateItemQuantity updates quantity for an item', () => {
    // Add items
    act(() => {
      store.addItem(mockProduct1, 1);
      store.addItem(mockProduct2, 1);
    });
    
    // Update quantity for first item
    act(() => {
      store.updateItemQuantity(mockProduct1.id, 5);
    });
    
    const updatedStore = useCartStore.getState();
    expect(updatedStore.items).toHaveLength(2);
    
    // First item should have updated quantity
    const item1 = updatedStore.items.find(item => item.product.id === mockProduct1.id);
    expect(item1?.quantity).toBe(5);
    
    // Second item should remain unchanged
    const item2 = updatedStore.items.find(item => item.product.id === mockProduct2.id);
    expect(item2?.quantity).toBe(1);
  });
  
  test('removeItem removes an item from the cart', () => {
    // Add items
    act(() => {
      store.addItem(mockProduct1, 1);
      store.addItem(mockProduct2, 1);
    });
    
    // Remove first item
    act(() => {
      store.removeItem(mockProduct1.id);
    });
    
    const updatedStore = useCartStore.getState();
    expect(updatedStore.items).toHaveLength(1);
    expect(updatedStore.items[0].product.id).toBe(mockProduct2.id);
  });
  
  test('clearCart removes all items', () => {
    // Add items
    act(() => {
      store.addItem(mockProduct1, 1);
      store.addItem(mockProduct2, 1);
    });
    
    // Clear cart
    act(() => {
      store.clearCart();
    });
    
    const updatedStore = useCartStore.getState();
    expect(updatedStore.items).toHaveLength(0);
  });
  
  test('getCartTotal calculates total correctly', () => {
    // Add items
    act(() => {
      store.addItem(mockProduct1, 2); // 2 * 10.99 = 21.98
      store.addItem(mockProduct2, 3); // 3 * 20.99 = 62.97
    });
    
    // Total should be 21.98 + 62.97 = 84.95
    const total = store.getCartTotal();
    expect(total).toBeCloseTo(84.95, 2);
  });
  
  test('getItemCount returns correct total quantity', () => {
    // Add items
    act(() => {
      store.addItem(mockProduct1, 2);
      store.addItem(mockProduct2, 3);
    });
    
    // Total count should be 2 + 3 = 5
    const count = store.getItemCount();
    expect(count).toBe(5);
  });
});

