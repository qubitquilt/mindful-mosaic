'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RoutineForm from './routine/RoutineForm';

const times = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
  '9:00 PM - 10:00 PM',
];

interface Task {
  id: string;
  name: string;
  duration: number;
}

interface Routine {
  id: string;
  name: string;
  timeSlot: string;
  tasks: Task[];
}

export default function Timeline() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  const [editRoutine, setEditRoutine] = useState<Routine | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const { data: session } = useSession();

  const fetchRoutines = async () => {
    if (session) {
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await fetch(`/api/routines?date=${today}`);
        const data = await res.json();
        setRoutines(data);
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    }
  };

  useEffect(() => {
    if (session) {
      const today = new Date().toISOString().split('T')[0];
      fetch(`/api/routines?date=${today}`)
        .then((res) => res.json())
        .then(setRoutines)
        .catch(console.error);
    }
  }, [session]);

  const toggleRoutine = (routineId: string) => {
    setExpandedRoutine(expandedRoutine === routineId ? null : routineId);

    


    const handleEdit = (routine: Routine) => {
      setEditRoutine(routine);
    };

    const handleDeleteClick = (id: string) => {
      setShowDeleteConfirm(id);
    };

    const handleDeleteConfirm = async (id: string) => {
      if (!session) return;
      try {
        const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setShowDeleteConfirm(null);
          fetchRoutines();
        } else {
          const errorData = await res.json();
          alert(errorData.error || 'Failed to delete routine.');
        }
      } catch (error) {
        console.error('Error deleting routine:', error);
        alert('Network error. Please try again.');
      }
    };

    const handleDeleteCancel = () => {
      setShowDeleteConfirm(null);
    };


  };

  if (routines.length === 0) {
    return (
      <div className="flex flex-col space-y-2 p-4 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No routines scheduled for today.
          </p>
        </div>
        {times.map((time) => (


  const handleEdit = (routine: Routine) => {
    setEditRoutine(routine);
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteConfirm(null);
        fetchRoutines();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete routine.');
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };


          <div
            key={time}
            className="border border-gray-300 p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="text-sm font-medium text-gray-900">{time}</div>
            <div className="h-16 bg-gray-50 rounded mt-2 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Empty slot</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const routinesByTime = times.map((time) => ({
    time,
    routines: routines.filter((r) => r.timeSlot === time),
  }));

  return (
    <div className="flex flex-col space-y-2 p-4 max-w-4xl mx-auto">
      {routinesByTime.map(({ time, routines: timeRoutines }) => (
        <div
          key={time}
          className="border border-gray-300 p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-900">{time}</div>
          <div className="mt-2 space-y-2">
            {timeRoutines.map((routine) => (
              <div key={routine.id} className="border rounded p-2">
                <button
                  onClick={() => toggleRoutine(routine.id)}
                  className="w-full text-left"
                >
                  {routine.name} (
                  {routine.tasks.reduce((sum, task) => sum + task.duration, 0)}{' '}
                  min)
                </button>
                {expandedRoutine === routine.id && (
                  <div className="mt-2 space-y-1">
                    {routine.tasks.map((task) => (
                      <div key={task.id} className="text-sm pl-4">
                        - {task.name} ({task.duration} min)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {timeRoutines.length === 0 && (
              <div className="h-16 bg-gray-50 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">Empty slot</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
