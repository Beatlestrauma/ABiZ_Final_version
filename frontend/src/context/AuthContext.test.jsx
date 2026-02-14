import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

function TestConsumer() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  if (loading) return <span>Loading...</span>;
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      {user && <span data-testid="username">{user.username}</span>}
      <button onClick={() => login('cb.sc.u4aie24123', 'cb.sc.u4aie24123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('provides auth state', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth')).toHaveTextContent('no');
  });

  it('login with valid format stores user and sets authenticated', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText('Login').click();
    });
    expect(screen.getByTestId('auth')).toHaveTextContent('yes');
    expect(screen.getByTestId('username')).toHaveTextContent('cb.sc.u4aie24123');
  });

  it('login with invalid format throws', async () => {
    let errorMsg = '';
    function Consumer() {
      const { login } = useAuth();
      return (
        <button
          onClick={() => login('invalid', 'invalid').catch((e) => (errorMsg = e.message))}
        >
          Login Bad
        </button>
      );
    }
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText('Login Bad').click();
    });
    expect(errorMsg).toMatch(/Invalid login format|Invalid credentials/);
  });

  it('restores user from localStorage', () => {
    const user = { username: 'cb.sc.u4aie24999', displayName: 'Student 999' };
    localStorage.setItem('bizai_auth_v1', JSON.stringify(user));
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth')).toHaveTextContent('yes');
    expect(screen.getByTestId('username')).toHaveTextContent('cb.sc.u4aie24999');
  });
});
