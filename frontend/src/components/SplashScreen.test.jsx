import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SplashScreen from './SplashScreen.jsx';

vi.mock('../splash-theme.css', () => ({}));

describe('SplashScreen', () => {
  it('renders ABiZ title and tagline', () => {
    render(<SplashScreen />);
    expect(screen.getByText('ABiZ')).toBeInTheDocument();
    expect(screen.getByText(/Connecting Students to Industries/i)).toBeInTheDocument();
    expect(screen.getByText(/Career Intelligence/i)).toBeInTheDocument();
  });

  it('renders loading indicator', () => {
    render(<SplashScreen />);
    expect(screen.getByText(/Loading your daily briefing/i)).toBeInTheDocument();
  });

  it('uses correct image path for logo', () => {
    render(<SplashScreen />);
    const img = screen.getByRole('img', { name: /ABiZ/i });
    expect(img).toHaveAttribute('src', '/assets/photo2.jpg');
  });
});
