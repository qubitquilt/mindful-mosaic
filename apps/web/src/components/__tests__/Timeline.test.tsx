import { render, screen, waitFor } from '@testing-library/react'
import Timeline from '../Timeline'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

const mockUseSession = jest.requireMock('next-auth/react').useSession;

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
    render(<Timeline />)

    expect(screen.getByText('No routines scheduled for today.')).toBeInTheDocument()
  })

  it('renders 16 time slots from 6 AM to 10 PM', () => {
    render(<Timeline />)

    const timeSlots = screen.getAllByText(/AM|PM/)
    expect(timeSlots).toHaveLength(16)
  })

  it('renders time labels correctly', () => {
    render(<Timeline />)

    // Check first and last time slots
    expect(screen.getByText('6:00 AM - 7:00 AM')).toBeInTheDocument()
    expect(screen.getByText('9:00 PM - 10:00 PM')).toBeInTheDocument()
  })

  it('renders empty slot placeholders', () => {
    render(<Timeline />)

    const emptySlots = screen.getAllByText('Empty slot')
    expect(emptySlots).toHaveLength(16)
  })

  it('applies Tailwind classes to timeline container', () => {
    const { container } = render(<Timeline />)

    const timelineContainer = container.querySelector('div')
    expect(timelineContainer).toHaveClass('flex', 'flex-col', 'space-y-2', 'p-4', 'max-w-4xl', 'mx-auto')
  })

  it('applies Tailwind classes to each time slot', () => {
    render(<Timeline />)

    const timeLabels = screen.getAllByText(/AM|PM/)
    const timeSlots = timeLabels.map(el => el.parentElement as Element)
    timeSlots.forEach(slot => {
      expect(slot).toHaveClass('border', 'border-gray-300', 'p-4', 'bg-white', 'rounded-lg', 'shadow-sm')
    })
  })

  it('applies Tailwind classes to empty slot areas', () => {
    render(<Timeline />)

    const emptyAreas = screen.getAllByText('Empty slot').map(el => el.closest('div'))
    emptyAreas.forEach(area => {
      expect(area).toHaveClass('h-16', 'bg-gray-50', 'rounded', 'mt-2', 'flex', 'items-center', 'justify-center')
    })
  })

  it('renders routines when loaded', async () => {
    (require('next-auth/react').useSession as jest.Mock).mockReturnValueOnce({ data: { user: { id: '1' } }, status: 'authenticated' });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', name: 'Test Routine', timeSlot: '7:00 AM - 8:00 AM', tasks: [] }],
    } as Response);

    render(<Timeline />);

    await waitFor(() => {
      expect(screen.queryByText('No routines scheduled for today.')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Test Routine')).toBeInTheDocument();
  });
})