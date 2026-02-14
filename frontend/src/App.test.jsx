import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App.jsx';

// Mock CSS imports
vi.mock('./index.css', () => ({}));
vi.mock('./splash-theme.css', () => ({}));

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('shows splash screen initially', () => {
    render(<App />);
    expect(screen.getByText(/ABiZ/i)).toBeInTheDocument();
    expect(screen.getByText(/Connecting Students to Industries/i)).toBeInTheDocument();
  });

  it('shows login form after splash when not authenticated', async () => {
    render(<App />);
    await act(async () => {
      vi.advanceTimersByTime(3000); // past 2.5s splash
    });
    expect(screen.getByPlaceholderText('cb.sc.u4aie24315')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows main app after splash when authenticated', async () => {
    localStorage.setItem(
      'bizai_auth_v1',
      JSON.stringify({ username: 'cb.sc.u4aie24123', displayName: 'Student 123' })
    );
    render(<App />);
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    // Should show app shell (sidebar or daily briefing), not login
    expect(screen.queryByPlaceholderText('cb.sc.u4aie24315')).not.toBeInTheDocument();
  });
});
