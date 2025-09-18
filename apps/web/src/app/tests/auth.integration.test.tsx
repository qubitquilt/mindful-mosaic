jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@/components/Timeline', () => () => (
  <div data-testid="timeline">Timeline</div>
));

jest.mock('@/components/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Home from '../page';
import Header from '@/components/layout/Header';
import { Providers } from '@/components/providers';

describe('Auth Integration - Session Persistence', () => {
  it('renders unauthenticated state across components', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    const Home = (await import('../page')).default;
    render(
      <Providers>
        <Header />
        <Home />
      </Providers>
    );
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /sign out/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('renders authenticated state with session persistence', () => {
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com' },
      expires: '2025-12-31T00:00:00Z',
    };
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });

    render(
      <Providers>
        <Header />
        <Home />
      </Providers>
    );
    expect(screen.getByTestId('signout')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument(); // From Header
    expect(screen.queryByTestId('signin')).not.toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument(); // Page renders
  });
});
