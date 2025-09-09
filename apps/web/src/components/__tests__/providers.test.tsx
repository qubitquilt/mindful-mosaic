import { render, screen } from '@testing-library/react';
import { Providers } from '../providers';

// Mock SessionProvider to avoid actual auth context
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

describe('Providers', () => {
  it('renders children within SessionProvider', () => {
    const testChild = <div>Test Child</div>;
    render(<Providers>{testChild}</Providers>);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
  });
});
