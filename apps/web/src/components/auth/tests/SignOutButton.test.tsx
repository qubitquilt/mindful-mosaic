import { render, screen, fireEvent } from '@testing-library/react';
import SignOutButton from '../SignOutButton';
import { signOut } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react');

describe('SignOutButton', () => {
  it('renders Sign Out button', () => {
    render(<SignOutButton />);

    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('has proper Tailwind classes', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /sign out/i });
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

    const button = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(button);

    expect(signOut).toHaveBeenCalled();
  });

  it('has data-testid attribute', () => {
    render(<SignOutButton />);

    expect(screen.getByTestId('signout')).toBeInTheDocument();
  });
});
