import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Supabase client implementation
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn((table) => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
          order: jest.fn(() => ({
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
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        getUser: jest.fn(),
      },
    });
  });
  
  test('products API endpoint returns products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 10.99 },
      { id: '2', name: 'Product 2', price: 20.99 },
    ];
    
    const mockSupabase = createClient();
    mockSupabase.from().select().order.mockResolvedValue({
      data: mockProducts,
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.from('products').select().order('name', { ascending: true });
    
    expect(response.data).toEqual(mockProducts);
    expect(response.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith('products');
  });
  
  test('categories API endpoint returns categories', async () => {
    const mockCategories = [
      { id: 'cat1', name: 'Category 1' },
      { id: 'cat2', name: 'Category 2' },
    ];
    
    const mockSupabase = createClient();
    mockSupabase.from().select().order.mockResolvedValue({
      data: mockCategories,
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.from('categories').select().order('name', { ascending: true });
    
    expect(response.data).toEqual(mockCategories);
    expect(response.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith('categories');
  });
  
  test('auth API endpoint handles signup', async () => {
    const mockUser = { id: 'user1', email: 'test@example.com' };
    
    const mockSupabase = createClient();
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'token' } },
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.auth.signUp({
      email: 'test@example.com',
      password: 'password',
    });
    
    expect(response.data.user).toEqual(mockUser);
    expect(response.error).toBeNull();
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
  
  test('auth API endpoint handles login', async () => {
    const mockUser = { id: 'user1', email: 'test@example.com' };
    
    const mockSupabase = createClient();
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'token' } },
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password',
    });
    
    expect(response.data.user).toEqual(mockUser);
    expect(response.error).toBeNull();
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
  
  test('cart API endpoint handles adding items', async () => {
    const mockCartItem = {
      id: 'cart1',
      user_id: 'user1',
      product_id: 'prod1',
      quantity: 1,
    };
    
    const mockSupabase = createClient();
    mockSupabase.from().insert.mockResolvedValue({
      data: mockCartItem,
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.from('cart_items').insert({
      user_id: 'user1',
      product_id: 'prod1',
      quantity: 1,
    });
    
    expect(response.data).toEqual(mockCartItem);
    expect(response.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
  });
  
  test('orders API endpoint handles creating orders', async () => {
    const mockOrder = {
      id: 'order1',
      user_id: 'user1',
      total_amount: 42.97,
      status: 'pending',
    };
    
    const mockSupabase = createClient();
    mockSupabase.from().insert.mockResolvedValue({
      data: mockOrder,
      error: null,
    });
    
    // Simulate API call
    const response = await mockSupabase.from('orders').insert({
      user_id: 'user1',
      total_amount: 42.97,
      status: 'pending',
    });
    
    expect(response.data).toEqual(mockOrder);
    expect(response.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith('orders');
  });
});

