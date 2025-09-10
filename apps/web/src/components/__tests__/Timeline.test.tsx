import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';

describe('Timeline', () => {
  it('renders the empty state message', () => {
    render(<Timeline />);
    expect(screen.getByText('No routines scheduled for today.')).toBeInTheDocument();
    expect(screen.getByText('No routines scheduled for today.')).toHaveClass('text-gray-500', 'text-lg');
  });

  it('renders the container with correct classes', () => {
    render(<Timeline />);
    const container = document.querySelector('.flex.flex-col.space-y-2.p-4.max-w-4xl.mx-auto');
    expect(container).toBeInTheDocument();
  });

  it('renders 16 time slots', () => {
    render(<Timeline />);
    const slots = screen.getAllByText(/AM|PM/); // Times contain AM/PM
    expect(slots.length).toBe(16);
  });

  it('renders each slot with correct time and empty content', () => {
    render(<Timeline />);
    expect(screen.getByText('6:00 AM - 7:00 AM')).toBeInTheDocument();
    const emptySlots = screen.getAllByText('Empty slot');
    expect(emptySlots).toHaveLength(16);
    const firstSlot = emptySlots[0].closest('.border.border-gray-300.p-4.bg-white.rounded-lg.shadow-sm');
    expect(firstSlot).toBeInTheDocument();
    const emptyDiv = emptySlots[0].closest('.h-16');
    expect(emptyDiv).toHaveClass('bg-gray-50', 'rounded', 'mt-2', 'flex', 'items-center', 'justify-center');
  });

  it('simulates responsiveness with Tailwind classes', () => {
    // RTL doesn't render CSS, but verify classes are applied
    render(<Timeline />);
    // Check container responsive classes (max-w-4xl mx-auto for desktop, flex-col for mobile)
    const container = document.querySelector('.flex.flex-col');
    expect(container).toHaveClass('max-w-4xl', 'mx-auto'); // Desktop centered
    // For mobile, classes like flex-col are default, assume ok
  });
});