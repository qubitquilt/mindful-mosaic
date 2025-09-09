import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import SignInButton from '../SignInButton';

// Mock next-auth/react
jest.mock('next-auth/react');

const mockUseSession = useSession as jest.Mock;
const mockSignIn = signIn as jest.Mock;
const mockSignOut = signOut as jest.Mock;

describe('SignInButton', () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
  });

  it('renders Sign in button when not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<SignInButton />);
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('calls signIn when Sign in button is clicked', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('renders Sign out button when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    render(<SignInButton />);
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('calls signOut when Sign out button is clicked', () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
