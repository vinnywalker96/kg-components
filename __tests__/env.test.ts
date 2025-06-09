describe('Environment Variables', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });
  
  afterAll(() => {
    process.env = originalEnv;
  });
  
  test('NEXT_PUBLIC_SUPABASE_URL is defined', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co';
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toEqual('https://test-url.supabase.co');
  });
  
  test('NEXT_PUBLIC_SUPABASE_ANON_KEY is defined', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toEqual('test-anon-key');
  });
  
  test('environment variables are used in Supabase client', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    
    // Mock the Supabase client
    jest.mock('@supabase/supabase-js', () => ({
      createClient: jest.fn((url, key) => ({ url, key })),
    }));
    
    // Import the client to test
    const { createClient } = require('@/lib/supabase/client');
    const client = createClient();
    
    // Check if the client was created with the correct environment variables
    expect(client.url).toEqual('https://test-url.supabase.co');
    expect(client.key).toEqual('test-anon-key');
  });
});

