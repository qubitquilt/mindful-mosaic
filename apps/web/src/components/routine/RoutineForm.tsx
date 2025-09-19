'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Task {
  name: string;
  duration: number;
}

interface RoutineFormProps {
  isOpen?: boolean;
  onClose: () => void;
  routine?: {
    id: string;
    name: string;
    timeSlot: string;
    tasks: { name: string; duration: number }[];
  } | null;
  onSuccess?: () => void;
}

export default function RoutineForm({
  isOpen,
  onClose,
  routine,
  onSuccess,
}: RoutineFormProps) {
  const [routineName, setRoutineName] = useState(routine?.name || '');
  const [startTime, setStartTime] = useState(() => {
    if (routine?.timeSlot) {
      const [start] = routine.timeSlot.split(' - ').map((s) => s.trim());
      return start || '06:00';
    }
    return '06:00';
  });
  const [endTime, setEndTime] = useState(() => {
    if (routine?.timeSlot) {
      const [, end] = routine.timeSlot.split(' - ').map((s) => s.trim());
      return end || '07:00';
    }
    return '07:00';
  });
  const [tasks, setTasks] = useState<Task[]>(
    routine?.tasks || [{ name: '', duration: 0 }]
  );
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  const isEditing = !!routine?.id;

  const addTask = () => {
    setTasks([...tasks, { name: '', duration: 0 }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (
    index: number,
    field: keyof Task,
    value: string | number
  ) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (status === 'loading') {
      setError('Loading session...');
      return;
    }

    if (!session) {
      setError('Please sign in to save a routine.');
      return;
    }

    if (!routineName.trim()) {
      setError('Routine name is required.');
      return;
    }
    if (tasks.some((t) => !t.name.trim() || t.duration <= 0)) {
      setError('All tasks must have a name and duration > 0.');
      return;
    }

    try {
      const url = isEditing ? `/api/routines/${routine.id}` : '/api/routines';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: routineName.trim(),
          timeSlot: `${startTime} - ${endTime}`,
          tasks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save routine.');
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      }
      if (!isEditing) {
        setRoutineName('');
        setTasks([{ name: '', duration: 0 }]);
      }
      onClose();
      alert(
        isEditing
          ? 'Routine updated successfully!'
          : 'Routine saved successfully!'
      );
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // If isOpen prop is provided, respect it. If undefined, assume caller is handling visibility (e.g., wrapped modal).
  if (typeof isOpen !== 'undefined' && !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
      >
        <h2 className="text-xl font-bold mb-4">Create Routine</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form role="form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="routine-name"
              className="block text-sm font-medium mb-2"
            >
              Routine Name
            </label>
            <input
              id="routine-name"
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time Slot</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label htmlFor="start-time" className="sr-only">
                  Start time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <span>-</span>
              <div className="flex-1">
                <label htmlFor="end-time" className="sr-only">
                  End time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tasks</label>
            {tasks.map((task, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <label htmlFor={`task-name-${index}`} className="sr-only">
                  Task name
                </label>
                <input
                  id={`task-name-${index}`}
                  type="text"
                  value={task.name}
                  onChange={(e) => updateTask(index, 'name', e.target.value)}
                  placeholder="Task name"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
                <label htmlFor={`task-duration-${index}`} className="sr-only">
                  Duration
                </label>
                <input
                  id={`task-duration-${index}`}
                  type="number"
                  value={task.duration}
                  onChange={(e) =>
                    updateTask(index, 'duration', parseInt(e.target.value) || 0)
                  }
                  placeholder="Duration (min)"
                  className="w-20 p-2 border border-gray-300 rounded"
                  min="1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  disabled={tasks.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="text-blue-500 underline"
            >
              Add Task
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Routine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
