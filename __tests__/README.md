# KG-Components Test Suite

This directory contains comprehensive tests for the KG-Components e-commerce application.

## Test Structure

The test suite is organized into the following categories:

### 1. Unit Tests

- **Components**: Tests for individual UI components
  - `__tests__/components/ui/button.test.tsx`

- **Utilities**: Tests for utility functions
  - `__tests__/lib/utils/formatDate.test.ts`

- **Store**: Tests for Zustand stores
  - `__tests__/lib/store/authStore.test.ts`
  - `__tests__/lib/store/cartStore.test.ts`
  - `__tests__/lib/store/productStore.test.ts`

- **Supabase Client**: Tests for Supabase client configuration
  - `__tests__/lib/supabase/client.test.ts`

### 2. Page Tests

- **Home Page**: Tests for the home page
  - `__tests__/app/home.test.tsx`

- **Auth Page**: Tests for the authentication page
  - `__tests__/app/auth.test.tsx`

- **Cart Page**: Tests for the shopping cart page
  - `__tests__/app/cart.test.tsx`

### 3. Integration Tests

- **Integration**: Tests for interactions between components
  - `__tests__/integration.test.tsx`

### 4. API Tests

- **API Endpoints**: Tests for API endpoints
  - `__tests__/api.test.ts`

### 5. Error Handling Tests

- **Error Handling**: Tests for error handling
  - `__tests__/error-handling.test.tsx`

### 6. Environment Tests

- **Environment Variables**: Tests for environment variables
  - `__tests__/env.test.ts`

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite aims to provide comprehensive coverage of the application, including:

- User authentication (login, signup, profile management)
- Product browsing and filtering
- Shopping cart functionality
- Order management
- Admin features
- Error handling
- API endpoints
- Environment configuration

## Mocking Strategy

The tests use Jest's mocking capabilities to mock:

- Supabase client and API calls
- Zustand stores
- Next.js components (Link, Image, Router)
- Environment variables

## Adding New Tests

When adding new features to the application, please follow these guidelines for adding tests:

1. Create unit tests for new components, utilities, and store functions
2. Update page tests to include new functionality
3. Add integration tests for interactions between components
4. Ensure error handling is tested
5. Maintain test coverage above 80%

## Test Configuration

The test configuration is defined in:

- `jest.config.js`: Jest configuration
- `jest.setup.js`: Test setup and global mocks

