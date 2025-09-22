import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ExecutionMode from './ExecutionMode';
import { Routine } from './Timeline';

// Mock next/router if needed, but not directly used
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockRoutine: Routine = {
  id: '1',
  name: 'Test Routine',
  scheduledTime: '09:00',
  repeatDays: 'MONDAY',
  tasks: [
    { id: 't1', name: 'Task 1', duration: 5 },
    { id: 't2', name: 'Task 2', duration: 3 },
  ],
};

const mockOnFinish = jest.fn();
const mockOnClose = jest.fn();

describe('ExecutionMode', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders routine name and first task', () => {
    render(
      <ExecutionMode
        routine={mockRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Routine')).toBeInTheDocument();
    expect(screen.getByText('Current Task: Task 1')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('counts down timer and auto-advances to next task', async () => {
    render(
      <ExecutionMode
        routine={mockRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    const timerElement = screen.getByText('05:00');
    expect(timerElement).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(60000); // 1 minute
    });
    await waitFor(() => {
      expect(screen.getByText('04:00')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(240000); // remaining 4 minutes
    });
    await waitFor(() => {
      expect(screen.getByText('Current Task: Task 2')).toBeInTheDocument();
      expect(screen.getByText('03:00')).toBeInTheDocument();
    });
  });

  it('pauses and resumes timer', async () => {
    render(
      <ExecutionMode
        routine={mockRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    await waitFor(() => {
      expect(screen.getByText('05:00')).toBeInTheDocument(); // Still 05:00, paused
    });

    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    await waitFor(() => {
      expect(screen.getByText('04:00')).toBeInTheDocument();
    });
  });

  it('skips to next task', async () => {
    render(
      <ExecutionMode
        routine={mockRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    const skipButton = screen.getByText('Skip');
    fireEvent.click(skipButton);

    await waitFor(() => {
      expect(screen.getByText('Current Task: Task 2')).toBeInTheDocument();
      expect(screen.getByText('03:00')).toBeInTheDocument();
    });
  });

  it('finishes routine and calls onFinish/onClose', () => {
    const singleTaskRoutine: Routine = {
      ...mockRoutine,
      tasks: [{ id: 't1', name: 'Single Task', duration: 1 }],
    };

    render(
      <ExecutionMode
        routine={singleTaskRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    const finishButton = screen.getByText('Finish Routine');
    fireEvent.click(finishButton);

    expect(mockOnFinish).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles routine with no tasks', () => {
    const noTasksRoutine: Routine = {
      ...mockRoutine,
      tasks: [],
    };

    render(
      <ExecutionMode
        routine={noTasksRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Finish Routine')).toBeInTheDocument();
    // No task displayed
  });

  it('disables skip on last task', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const twoTasksRoutine: Routine = {
      ...mockRoutine,
      tasks: [
        { id: 't1', name: 'Task 1', duration: 1 },
        { id: 't2', name: 'Task 2', duration: 1 },
      ],
    };

    render(
      <ExecutionMode
        routine={twoTasksRoutine}
        onFinish={mockOnFinish}
        onClose={mockOnClose}
      />
    );

    // Skip to last task
    fireEvent.click(screen.getByText('Skip'));

    const skipButton = screen.getByText('Skip');
    expect(skipButton).toBeDisabled();
  });
});
