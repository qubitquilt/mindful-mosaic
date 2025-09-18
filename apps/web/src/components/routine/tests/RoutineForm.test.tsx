import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoutineForm from '../RoutineForm';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

global.alert = jest.fn();

describe('RoutineForm', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial task', () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/routine name/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(1);
    expect(screen.getAllByPlaceholderText(/duration/i)).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: /save routine/i })
    ).toBeInTheDocument();
  });

  it('adds a new task on click', () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    const addButton = screen.getByText(/add task/i);
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(2);
  });

  it('removes a task when more than one', () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    const addButton = screen.getByText(/add task/i);
    fireEvent.click(addButton);

    const removeButton = screen.getAllByRole('button', { name: /remove/i })[0];
    fireEvent.click(removeButton);

    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(1);
  });

  it('does not remove last task', () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeDisabled();
  });

  it('shows error for empty routine name', async () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(
      await screen.findByText('Routine name is required.')
    ).toBeInTheDocument();
  });

  it('shows error for invalid task', async () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/routine name/i), {
      target: { value: 'Test Routine' },
    });
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(
      await screen.findByText('All tasks must have a name and duration > 0.')
    ).toBeInTheDocument();
  });

  it('shows error for no session', async () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/routine name/i), {
      target: { value: 'Test Routine' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/task name/i)[0], {
      target: { value: 'Task 1' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/duration/i)[0], {
      target: { value: '30' },
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText('Please sign in to save a routine.')
      ).toBeInTheDocument();
    });
  });

  it('saves routine with valid data when signed in', async () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: { user: { id: '1', name: 'Test User' } },
      status: 'authenticated',
    });

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ routine: { id: '1' } }),
    } as Response);
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    render(<RoutineForm isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/routine name/i), {
      target: { value: 'Test Routine' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/task name/i)[0], {
      target: { value: 'Task 1' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/duration/i)[0], {
      target: { value: '30' },
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/routines',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Routine',
          timeSlot: '06:00 - 07:00',
          tasks: [{ name: 'Task 1', duration: 30 }],
        }),
      })
    );

    jest.restoreAllMocks();
  });
});
