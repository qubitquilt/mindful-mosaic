import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Header from '../Header';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Header', () => {
  it('renders app title', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<Header />);

    expect(screen.getByText('Mindful Mosaic')).toBeInTheDocument();
  });

  it('displays user name and Sign Out button when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    });

    render(<Header />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('displays Sign In button when unauthenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('uses email when name is not available', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    render(<Header />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('has proper Tailwind classes for header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-gray-800', 'text-white', 'p-4');
  });
});
