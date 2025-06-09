import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthPage from '@/app/auth/page';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/use-toast';

// Mock the auth store
jest.mock('@/lib/store/authStore', () => ({
  useAuthStore: jest.fn(),
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

describe('Auth Page', () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth store implementation
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
    });
    
    // Mock toast implementation
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });
  
  test('renders login and signup tabs', () => {
    render(<AuthPage />);
    
    // Check for tabs
    expect(screen.getByRole('tab', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
    
    // Login tab should be active by default
    expect(screen.getByRole('tab', { name: /login/i })).toHaveAttribute('data-state', 'active');
  });
  
  test('renders login form fields', () => {
    render(<AuthPage />);
    
    // Check for login form fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
  
  test('switches to signup tab and renders signup form', async () => {
    render(<AuthPage />);
    
    // Click on signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Check for signup form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
  
  test('submits login form with valid data', async () => {
    render(<AuthPage />);
    
    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(loginButton);
    
    // Check if login function was called with correct data
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
  
  test('shows error toast when login form is submitted with empty fields', async () => {
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
  
  test('submits signup form with valid data', async () => {
    render(<AuthPage />);
    
    // Switch to signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Fill in signup form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(createAccountButton);
    
    // Check if signup function was called with correct data
    expect(mockSignup).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
  });
  
  test('shows error toast when passwords do not match in signup form', async () => {
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
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password456');
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
  
  test('shows loading state when isLoading is true', () => {
    // Mock loading state
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      isLoading: true,
    });
    
    render(<AuthPage />);
    
    // Check for loading text in button
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    
    // Switch to signup tab
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);
    
    // Check for loading text in signup button
    expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
});

