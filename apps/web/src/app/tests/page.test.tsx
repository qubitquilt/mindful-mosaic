'use client';

import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Timeline component
jest.mock('@/components/Timeline', () => {
  const MockTimeline = () => <div data-testid="timeline">Mock Timeline</div>;
  MockTimeline.displayName = 'MockTimeline';
  return MockTimeline;
});

describe('Home Page', () => {
  it('renders the Timeline component', () => {
    render(<Home />);
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('applies correct classes to main element', () => {
    render(<Home />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
  });
});
