import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Header from '../Header';

// Mock next-auth/react
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.Mock;

// Mock child components to avoid rendering issues
jest.mock('../../SignInButton', () => {
  const MockSignInButton = () => <div>MockSignInButton</div>;
  MockSignInButton.displayName = 'MockSignInButton';
  return MockSignInButton;
});
jest.mock('../../auth/SignOutButton', () => {
  const MockSignOutButton = () => <div>MockSignOutButton</div>;
  MockSignOutButton.displayName = 'MockSignOutButton';
  return MockSignOutButton;
});

describe('Header', () => {
  it('renders app name and SignInButton when not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Header />);
    expect(screen.getByText('Mindful Mosaic')).toBeInTheDocument();
    expect(screen.getByText('MockSignInButton')).toBeInTheDocument();
    expect(screen.queryByText('MockSignOutButton')).not.toBeInTheDocument();
  });

  it('renders app name, user info, and SignOutButton when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    });
    render(<Header />);
    expect(screen.getByText('Mindful Mosaic')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument(); // Prefers name
    expect(screen.getByText('MockSignOutButton')).toBeInTheDocument();
    expect(screen.queryByText('MockSignInButton')).not.toBeInTheDocument();
  });

  it('renders user email if name is not available', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });
    render(<Header />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('MockSignOutButton')).toBeInTheDocument();
  });
});
