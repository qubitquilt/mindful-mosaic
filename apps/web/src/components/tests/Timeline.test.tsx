import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

import Timeline from '../Timeline';
import { useSession } from 'next-auth/react';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

describe('Timeline', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the empty state message', () => {
    render(<Timeline />);

    expect(
      screen.getByText('No routines scheduled for today.')
    ).toBeInTheDocument();
  });

  it('renders 16 time slots from 6 AM to 10 PM', () => {
    render(<Timeline />);

    const timeSlots = screen.getAllByText(/AM|PM/);
    expect(timeSlots).toHaveLength(16);
  });

  it('renders time labels correctly', () => {
    render(<Timeline />);

    // Check first and last time slots
    expect(screen.getByText('6:00 AM - 7:00 AM')).toBeInTheDocument();
    expect(screen.getByText('9:00 PM - 10:00 PM')).toBeInTheDocument();
  });

  it('renders empty slot placeholders', () => {
    render(<Timeline />);

    const emptySlots = screen.getAllByText('Empty slot');
    expect(emptySlots).toHaveLength(16);
  });

  it('applies Tailwind classes to timeline container', () => {
    const { container } = render(<Timeline />);

    const timelineContainer = container.querySelector('div');
    expect(timelineContainer).toHaveClass(
      'flex',
      'flex-col',
      'space-y-2',
      'p-4',
      'max-w-4xl',
      'mx-auto'
    );
  });

  it('applies Tailwind classes to each time slot', () => {
    render(<Timeline />);

    const timeLabels = screen.getAllByText(/AM|PM/);
    const timeSlots = timeLabels.map((el) => el.parentElement as Element);
    timeSlots.forEach((slot) => {
      expect(slot).toHaveClass(
        'border',
        'border-gray-300',
        'p-4',
        'bg-white',
        'rounded-lg',
        'shadow-sm'
      );
    });
  });

  it('applies Tailwind classes to empty slot areas', () => {
    render(<Timeline />);

    const emptyAreas = screen
      .getAllByText('Empty slot')
      .map((el) => el.closest('div'));
    emptyAreas.forEach((area) => {
      expect(area).toHaveClass(
        'h-16',
        'bg-gray-50',
        'rounded',
        'mt-2',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'test-user' } },
      status: 'authenticated',
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => [],
      })
    ) as jest.MockedFunction<typeof fetch>;

    const originalError = console.error;
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('act')) {
        return;
      }
      originalError.call(console, ...args);
    });
  });

  describe('with routines', () => {
    const mockRoutines = [
      {
        id: '1',
        name: 'Morning Routine',
        timeSlot: '6:00 AM - 7:00 AM',
        tasks: [
          { id: 't1', name: 'Task 1', duration: 15 },
          { id: 't2', name: 'Task 2', duration: 20 },
        ],
      },
      {
        id: '2',
        name: 'Evening Routine',
        timeSlot: '9:00 PM - 10:00 PM',
        tasks: [{ id: 't3', name: 'Task 3', duration: 30 }],
      },
    ];

    it('fetches routines with date parameter when authenticated', async () => {
      const today = new Date().toISOString().split('T')[0];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockRoutines),
      });

      await act(async () => {
        render(<Timeline />);
        await act(async () => {
          await flushPromises();
        });
      });
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/routines?date=${today}`
        );
      });
    });

    it('renders routines with total duration in buttons', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockRoutines),
      });

      await act(async () => {
        render(<Timeline />);
        await act(async () => {
          await flushPromises();
        });
      });
      await waitFor(() => {
        expect(
          screen.getByText('Morning Routine (35 min)')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Evening Routine (30 min)')
        ).toBeInTheDocument();
      });
    });

    it('expands and collapses routine tasks on button click', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockRoutines),
      });

      await act(async () => {
        render(<Timeline />);
        await act(async () => {
          await flushPromises();
        });
      });
      await waitFor(() => {
        expect(
          screen.getByText('Morning Routine (35 min)')
        ).toBeInTheDocument();
      });

      const morningButton = screen.getByText('Morning Routine (35 min)');
      fireEvent.click(morningButton);

      await waitFor(() => {
        expect(screen.getByText('- Task 1 (15 min)')).toBeInTheDocument();
        expect(screen.getByText('- Task 2 (20 min)')).toBeInTheDocument();
      });

      fireEvent.click(morningButton);
      await waitFor(() => {
        expect(screen.queryByText('- Task 1 (15 min)')).not.toBeInTheDocument();
      });
    });

    it('renders routines in correct time slots', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockRoutines),
      });

      await act(async () => {
        render(<Timeline />);
        await act(async () => {
          await flushPromises();
        });
      });
      await waitFor(() => {
        const morningSlot = screen.getByText('6:00 AM - 7:00 AM').parentElement;
        expect(morningSlot).toContainElement(
          screen.getByText('Morning Routine (35 min)')
        );

        const eveningSlot =
          screen.getByText('9:00 PM - 10:00 PM').parentElement;
        expect(eveningSlot).toContainElement(
          screen.getByText('Evening Routine (30 min)')
        );
      });
    });
  });
});
