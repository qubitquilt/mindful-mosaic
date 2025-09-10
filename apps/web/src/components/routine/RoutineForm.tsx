'use client';

import { useState } from 'react';

interface Task {
  name: string;
  duration: number;
}

interface RoutineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: { name: string; tasks: Task[] }) => void;
}

export default function RoutineForm({ isOpen, onClose, onSave }: RoutineFormProps) {
  const [routineName, setRoutineName] = useState('');
  const [tasks, setTasks] = useState<Task[]>([{ name: '', duration: 0 }]);
  const [error, setError] = useState('');

  const addTask = () => {
    setTasks([...tasks, { name: '', duration: 0 }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, field: keyof Task, value: string | number) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!routineName.trim()) {
      setError('Routine name is required.');
      return;
    }
    if (tasks.some(t => !t.name.trim() || t.duration <= 0)) {
      setError('All tasks must have a name and duration > 0.');
      return;
    }
    onSave({ name: routineName, tasks });
    setRoutineName('');
    setTasks([{ name: '', duration: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Create Routine</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form role="form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="routine-name" className="block text-sm font-medium mb-2">Routine Name</label>
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
            <label className="block text-sm font-medium mb-2">Tasks</label>
            {tasks.map((task, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <label htmlFor={`task-name-${index}`} className="sr-only">Task name</label>
                <input
                  id={`task-name-${index}`}
                  type="text"
                  value={task.name}
                  onChange={(e) => updateTask(index, 'name', e.target.value)}
                  placeholder="Task name"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
                <label htmlFor={`task-duration-${index}`} className="sr-only">Duration</label>
                <input
                  id={`task-duration-${index}`}
                  type="number"
                  value={task.duration}
                  onChange={(e) => updateTask(index, 'duration', parseInt(e.target.value) || 0)}
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