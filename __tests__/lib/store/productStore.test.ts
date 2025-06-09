import { useProductStore } from '@/lib/store/productStore';
import { createClient } from '@/lib/supabase/client';
import { act } from '@testing-library/react';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('ProductStore', () => {
  let store: ReturnType<typeof useProductStore.getState>;
  
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 10.99,
      category_id: 'cat1',
      description: 'Test description 1',
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 20.99,
      category_id: 'cat2',
      description: 'Test description 2',
    },
    {
      id: '3',
      name: 'Another Product',
      price: 15.99,
      category_id: 'cat1',
      description: 'Another description',
    },
  ];
  
  const mockCategories = [
    {
      id: 'cat1',
      name: 'Category 1',
      description: 'Category 1 description',
    },
    {
      id: 'cat2',
      name: 'Category 2',
      description: 'Category 2 description',
    },
  ];
  
  beforeEach(() => {
    // Reset the store before each test
    useProductStore.setState({
      products: [],
      categories: [],
      selectedCategory: null,
      searchQuery: '',
      priceRange: [0, 1000],
      sortOption: 'name-asc',
      isLoading: false,
      error: null,
    });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the store state
    store = useProductStore.getState();
    
    // Mock Supabase client implementation
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn((table) => {
        if (table === 'products') {
          return {
            select: jest.fn(() => ({
              order: jest.fn(() => ({
                data: mockProducts,
                error: null,
              })),
            })),
          };
        } else if (table === 'categories') {
          return {
            select: jest.fn(() => ({
              order: jest.fn(() => ({
                data: mockCategories,
                error: null,
              })),
            })),
          };
        }
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: null,
              })),
            })),
            order: jest.fn(() => ({
              data: [],
              error: null,
            })),
          })),
        };
      }),
    });
  });
  
  test('initial state', () => {
    expect(store.products).toEqual([]);
    expect(store.categories).toEqual([]);
    expect(store.selectedCategory).toBeNull();
    expect(store.searchQuery).toBe('');
    expect(store.priceRange).toEqual([0, 1000]);
    expect(store.sortOption).toBe('name-asc');
    expect(store.isLoading).toBeFalsy();
    expect(store.error).toBeNull();
  });
  
  test('fetchProducts loads products from Supabase', async () => {
    await act(async () => {
      await store.fetchProducts();
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.products).toEqual(mockProducts);
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toBeNull();
  });
  
  test('fetchCategories loads categories from Supabase', async () => {
    await act(async () => {
      await store.fetchCategories();
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.categories).toEqual(mockCategories);
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toBeNull();
  });
  
  test('setSelectedCategory updates selected category', () => {
    act(() => {
      store.setSelectedCategory('cat1');
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.selectedCategory).toBe('cat1');
  });
  
  test('setSearchQuery updates search query', () => {
    act(() => {
      store.setSearchQuery('test query');
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.searchQuery).toBe('test query');
  });
  
  test('setPriceRange updates price range', () => {
    act(() => {
      store.setPriceRange([10, 50]);
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.priceRange).toEqual([10, 50]);
  });
  
  test('setSortOption updates sort option', () => {
    act(() => {
      store.setSortOption('price-desc');
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.sortOption).toBe('price-desc');
  });
  
  test('resetFilters resets all filters', () => {
    // Set some filters first
    act(() => {
      store.setSelectedCategory('cat1');
      store.setSearchQuery('test');
      store.setPriceRange([10, 50]);
      store.setSortOption('price-desc');
    });
    
    // Reset filters
    act(() => {
      store.resetFilters();
    });
    
    const updatedStore = useProductStore.getState();
    expect(updatedStore.selectedCategory).toBeNull();
    expect(updatedStore.searchQuery).toBe('');
    expect(updatedStore.priceRange).toEqual([0, 1000]);
    expect(updatedStore.sortOption).toBe('name-asc');
  });
  
  test('getFilteredProducts filters by category', async () => {
    // Load products first
    await act(async () => {
      await store.fetchProducts();
    });
    
    // Set category filter
    act(() => {
      store.setSelectedCategory('cat1');
    });
    
    const filteredProducts = store.getFilteredProducts();
    expect(filteredProducts).toHaveLength(2);
    expect(filteredProducts.map(p => p.id)).toEqual(['1', '3']);
  });
  
  test('getFilteredProducts filters by search query', async () => {
    // Load products first
    await act(async () => {
      await store.fetchProducts();
    });
    
    // Set search filter
    act(() => {
      store.setSearchQuery('another');
    });
    
    const filteredProducts = store.getFilteredProducts();
    expect(filteredProducts).toHaveLength(1);
    expect(filteredProducts[0].id).toBe('3');
  });
  
  test('getFilteredProducts filters by price range', async () => {
    // Load products first
    await act(async () => {
      await store.fetchProducts();
    });
    
    // Set price range filter
    act(() => {
      store.setPriceRange([15, 25]);
    });
    
    const filteredProducts = store.getFilteredProducts();
    expect(filteredProducts).toHaveLength(2);
    expect(filteredProducts.map(p => p.id).sort()).toEqual(['2', '3']);
  });
  
  test('getFilteredProducts sorts products correctly', async () => {
    // Load products first
    await act(async () => {
      await store.fetchProducts();
    });
    
    // Test price-asc sorting
    act(() => {
      store.setSortOption('price-asc');
    });
    
    let sortedProducts = store.getFilteredProducts();
    expect(sortedProducts.map(p => p.id)).toEqual(['1', '3', '2']);
    
    // Test price-desc sorting
    act(() => {
      store.setSortOption('price-desc');
    });
    
    sortedProducts = store.getFilteredProducts();
    expect(sortedProducts.map(p => p.id)).toEqual(['2', '3', '1']);
    
    // Test name-asc sorting
    act(() => {
      store.setSortOption('name-asc');
    });
    
    sortedProducts = store.getFilteredProducts();
    expect(sortedProducts.map(p => p.id)).toEqual(['3', '1', '2']);
    
    // Test name-desc sorting
    act(() => {
      store.setSortOption('name-desc');
    });
    
    sortedProducts = store.getFilteredProducts();
    expect(sortedProducts.map(p => p.id)).toEqual(['2', '1', '3']);
  });
});

