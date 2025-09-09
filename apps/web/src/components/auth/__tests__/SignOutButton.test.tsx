import { render, screen, fireEvent } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import SignOutButton from '../SignOutButton';

// Mock next-auth/react
jest.mock('next-auth/react');

const mockSignOut = signOut as jest.Mock;

describe('SignOutButton', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
  });

  it('renders Sign Out button with correct text and classes', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'bg-red-500',
      'hover:bg-red-700',
      'text-white',
      'font-bold',
      'py-2',
      'px-4',
      'rounded'
    );
  });

  it('calls signOut when button is clicked', () => {
    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
