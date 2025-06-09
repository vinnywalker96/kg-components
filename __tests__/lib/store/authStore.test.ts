import { useAuthStore } from '@/lib/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { act } from '@testing-library/react';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('AuthStore', () => {
  let store: ReturnType<typeof useAuthStore.getState>;
  
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.setState({
      user: null,
      profile: null,
      isLoading: false,
      error: null,
    });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the store state
    store = useAuthStore.getState();
    
    // Mock Supabase client implementation
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    });
  });
  
  test('initial state', () => {
    expect(store.user).toBeNull();
    expect(store.profile).toBeNull();
    expect(store.isLoading).toBeFalsy();
    expect(store.error).toBeNull();
  });
  
  test('login sets user and profile on success', async () => {
    // Mock successful login
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', name: 'Test User', email: 'test@example.com' };
    
    const mockSupabase = createClient();
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'token' } },
      error: null,
    });
    
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    // Call login
    await act(async () => {
      await store.login('test@example.com', 'password');
    });
    
    // Get updated store state
    const updatedStore = useAuthStore.getState();
    
    // Verify state was updated correctly
    expect(updatedStore.user).toEqual(mockUser);
    expect(updatedStore.profile).toEqual(mockProfile);
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toBeNull();
    
    // Verify Supabase methods were called
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
  
  test('login sets error on failure', async () => {
    // Mock failed login
    const mockError = { message: 'Invalid credentials' };
    
    const mockSupabase = createClient();
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    });
    
    // Call login
    await act(async () => {
      await store.login('test@example.com', 'wrong-password');
    });
    
    // Get updated store state
    const updatedStore = useAuthStore.getState();
    
    // Verify state was updated correctly
    expect(updatedStore.user).toBeNull();
    expect(updatedStore.profile).toBeNull();
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toEqual(mockError);
  });
  
  test('signup creates user and profile on success', async () => {
    // Mock successful signup
    const mockUser = { id: '123', email: 'new@example.com' };
    const mockProfile = { id: '123', name: 'New User', email: 'new@example.com' };
    
    const mockSupabase = createClient();
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'token' } },
      error: null,
    });
    
    mockSupabase.from().insert().select.mockResolvedValue({
      data: [mockProfile],
      error: null,
    });
    
    // Call signup
    await act(async () => {
      await store.signup('new@example.com', 'password', 'New User');
    });
    
    // Get updated store state
    const updatedStore = useAuthStore.getState();
    
    // Verify state was updated correctly
    expect(updatedStore.user).toEqual(mockUser);
    expect(updatedStore.profile).toEqual(mockProfile);
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toBeNull();
    
    // Verify Supabase methods were called
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password',
    });
  });
  
  test('logout clears user and profile', async () => {
    // Set initial state with user and profile
    useAuthStore.setState({
      user: { id: '123', email: 'test@example.com' },
      profile: { id: '123', name: 'Test User', email: 'test@example.com' },
      isLoading: false,
      error: null,
    });
    
    const mockSupabase = createClient();
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
    
    // Call logout
    await act(async () => {
      await store.logout();
    });
    
    // Get updated store state
    const updatedStore = useAuthStore.getState();
    
    // Verify state was updated correctly
    expect(updatedStore.user).toBeNull();
    expect(updatedStore.profile).toBeNull();
    expect(updatedStore.isLoading).toBeFalsy();
    expect(updatedStore.error).toBeNull();
    
    // Verify Supabase methods were called
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });
});

