import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoutineForm from '../RoutineForm';
import { SessionProvider } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }) => <div>{children}</div>,
}));

const mockUseSession = require('next-auth/react').useSession;

const mockSession = {
  data: {
    user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
  },
  status: 'authenticated',
};

const mockLoadingSession = {
  data: null,
  status: 'loading',
};


const mockRoutine = {
  id: 'test-routine-id',
  name: 'Test Routine',
  scheduledTime: '06:00',
  repeatDays: 'MONDAY,TUESDAY',
  tasks: [
    { id: 'task1', name: 'Task 1', duration: 30 },
    { id: 'task2', name: 'Task 2', duration: 15 },
  ],
};

const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();

const renderRoutineForm = (props = {}) => {
  return render(
    <SessionProvider session={mockSession.data} status={mockSession.status}>
      <RoutineForm onClose={mockOnClose} onSuccess={mockOnSuccess} {...props} />
    </SessionProvider>
  );
};

describe('RoutineForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.alert = jest.fn();
    mockUseSession.mockReturnValue(mockSession);
  });

  it('renders create form correctly', () => {
    renderRoutineForm();
    expect(screen.getByText('Create Routine')).toBeInTheDocument();
    expect(screen.getByLabelText(/Routine Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Scheduled Time/i)).toBeInTheDocument();
    expect(screen.getByText('Repeat Days')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Duration (min)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Task/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Save Routine/i })
    ).toBeInTheDocument();
  });

  it('renders edit form correctly', () => {
    renderRoutineForm({ routine: mockRoutine });
    expect(screen.getByText('Edit Routine')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Routine')).toBeInTheDocument();
    expect(screen.getByDisplayValue('06:00')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked(); // MONDAY
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked(); // TUESDAY
    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('submits create routine successfully', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ routine: mockRoutine }),
    };
    global.fetch.mockResolvedValue(mockResponse);

    renderRoutineForm();

    fireEvent.change(screen.getByLabelText(/Routine Name/i), {
      target: { value: 'Morning Routine' },
    });
    fireEvent.change(screen.getByLabelText(/Scheduled Time/i), {
      target: { value: '07:00' },
    });
    fireEvent.click(screen.getAllByRole('checkbox')[0]); // Select MONDAY

    fireEvent.change(screen.getByPlaceholderText('Task name'), {
      target: { value: 'Wake up' },
    });
    fireEvent.change(screen.getByPlaceholderText('Duration (min)'), {
      target: { value: '10' },
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const expectedBody = JSON.stringify({
        name: 'Morning Routine',
        scheduledTime: '07:00',
        repeatDays: 'MONDAY',
        tasks: [{ name: 'Wake up', duration: 10 }],
      });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/routines',
        expect.objectContaining({
          method: 'POST',
          body: expectedBody,
        })
      );
    });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits edit routine successfully', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ routine: mockRoutine }),
    };
    global.fetch.mockResolvedValue(mockResponse);

    renderRoutineForm({ routine: mockRoutine });

    fireEvent.change(screen.getByLabelText(/Routine Name/i), {
      target: { value: 'Updated Routine' },
    });
    fireEvent.change(screen.getByLabelText(/Scheduled Time/i), {
      target: { value: '08:00' },
    });
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // uncheck MONDAY
    fireEvent.click(checkboxes[1]); // uncheck TUESDAY
    fireEvent.click(checkboxes[2]); // check WEDNESDAY

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const [[url, options]] = global.fetch.mock.calls;
    const body = JSON.parse(options.body);
    expect(url).toBe('/api/routines/test-routine-id');
    expect(options.method).toBe('PUT');
    expect(body).toMatchObject({
      name: 'Updated Routine',
      scheduledTime: '08:00',
      repeatDays: 'WEDNESDAY',
      tasks: expect.any(Array),
    });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error for invalid input', async () => {
    renderRoutineForm();

    const form = screen.getByRole('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Routine name is required.')).toBeInTheDocument();
    });
  });

  it('shows loading error if session loading', async () => {
    mockUseSession.mockReturnValue(mockLoadingSession);

    renderRoutineForm();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await screen.findByText('Loading session...');
  });

  it('adds and removes tasks', () => {
    renderRoutineForm();

    const addButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText('Task name')).toHaveLength(2);

    const removeButton = screen.getAllByRole('button', { name: /Remove/i })[1];
    fireEvent.click(removeButton);

    expect(screen.getAllByPlaceholderText('Task name')).toHaveLength(1);
  });

  it('toggles repeat days', () => {
    renderRoutineForm();

    const mondayCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(mondayCheckbox);

    expect(mondayCheckbox).toBeChecked();

    fireEvent.click(mondayCheckbox);

    expect(mondayCheckbox).not.toBeChecked();
  });
});
