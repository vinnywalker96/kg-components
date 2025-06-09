import { createClient } from '@/lib/supabase/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => 'mocked-supabase-client'),
}));

describe('Supabase Client', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });
  
  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });
  
  test('createClient calls Supabase createClient with correct parameters', () => {
    const client = createClient();
    
    expect(createSupabaseClient).toHaveBeenCalledWith(
      'https://test-url.supabase.co',
      'test-anon-key',
      expect.any(Object)
    );
    
    expect(client).toBe('mocked-supabase-client');
  });
  
  test('createClient throws error when environment variables are missing', () => {
    // Remove environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Recreate the module to use the updated environment
    jest.resetModules();
    
    // Import should throw an error
    expect(() => {
      jest.requireActual('@/lib/supabase/client');
    }).toThrow();
  });
});

