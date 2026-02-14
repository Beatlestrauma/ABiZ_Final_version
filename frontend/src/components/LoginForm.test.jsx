import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext.jsx';
import LoginForm from './LoginForm.jsx';

describe('LoginForm', () => {
  it('renders sign in form and demo credentials', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cb\.sc\.u4aie24/i)).toBeInTheDocument();
    expect(screen.getByText(/Demo Credentials/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('cb.sc.u4aie24315')).toBeInTheDocument();
  });

  it('has password field', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    const password = document.getElementById('password');
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');
  });
});
