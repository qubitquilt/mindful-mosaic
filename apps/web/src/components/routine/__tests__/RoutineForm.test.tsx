import { render, screen, fireEvent } from '@testing-library/react';
import RoutineForm from '../RoutineForm';

describe('RoutineForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial task', () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByLabelText(/routine name/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(1);
    expect(screen.getAllByPlaceholderText(/duration/i)).toHaveLength(1);
    expect(screen.getByRole('button', { name: /save routine/i })).toBeInTheDocument();
  });

  it('adds a new task on click', () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const addButton = screen.getByText(/add task/i);
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(2);
  });

  it('removes a task when more than one', () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const addButton = screen.getByText(/add task/i);
    fireEvent.click(addButton);

    const removeButton = screen.getAllByRole('button', { name: /remove/i })[0];
    fireEvent.click(removeButton);

    expect(screen.getAllByPlaceholderText(/task name/i)).toHaveLength(1);
  });

  it('does not remove last task', () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeDisabled();
  });

  it('shows error for empty routine name', async () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(await screen.findByText('Routine name is required.')).toBeInTheDocument();
  });

  it('shows error for invalid task', async () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.change(screen.getByLabelText(/routine name/i), { target: { value: 'Test Routine' } });
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(await screen.findByText('All tasks must have a name and duration > 0.')).toBeInTheDocument();
  });

  it('calls onSave with valid data and closes modal', async () => {
    render(<RoutineForm isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.change(screen.getByLabelText(/routine name/i), { target: { value: 'Test Routine' } });
    fireEvent.change(screen.getAllByPlaceholderText(/task name/i)[0], { target: { value: 'Task 1' } });
    fireEvent.change(screen.getAllByPlaceholderText(/duration/i)[0], { target: { value: '30' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test Routine',
      tasks: [{ name: 'Task 1', duration: 30 }]
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});