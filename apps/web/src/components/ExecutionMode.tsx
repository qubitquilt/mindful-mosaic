import { useState, useEffect, useRef } from 'react';
import { Routine } from './Timeline'; // Assuming Routine/Task interfaces are exported or shared

interface ExecutionModeProps {
  routine: Routine;
  onFinish: () => void;
  onClose: () => void;
}

export default function ExecutionMode({
  routine,
  onFinish,
  onClose,
}: ExecutionModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    routine.tasks[0]?.duration * 60 || 0
  );
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTask = routine.tasks[currentIndex];

  useEffect(() => {
    if (currentIndex >= routine.tasks.length && routine.tasks.length > 0) {
      onFinish();
      return;
    }

    if (!isPaused && remainingTime > 0) {
      const id = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setCurrentIndex((prevIndex) => prevIndex + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      intervalRef.current = id;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isPaused,
    remainingTime,
    currentIndex,
    routine.tasks,
    onFinish,
    routine.tasks.length,
  ]);

  useEffect(() => {
    if (currentIndex < routine.tasks.length) {
      setRemainingTime(routine.tasks[currentIndex].duration * 60);
    } else {
      onFinish();
    }
  }, [currentIndex, routine.tasks, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleFinish = () => {
    onFinish();
    onClose();
  };

  if (currentIndex >= routine.tasks.length && routine.tasks.length > 0) {
    return null; // Or show completion message
  }

  const currentDuration = currentTask ? currentTask.duration * 60 : 0;
  const progress =
    currentDuration > 0
      ? ((currentDuration - remainingTime) / currentDuration) * 100
      : 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="execution-mode"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{routine.name}</h2>
        {currentTask && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Current Task: {currentTask.name}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center mt-2 text-lg font-mono">
                {formatTime(remainingTime)}
              </p>
            </div>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handlePauseResume}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={currentIndex >= routine.tasks.length - 1}
                aria-label="Skip to next task"
              >
                Skip
              </button>
            </div>
          </>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            aria-label="Finish routine"
            data-testid="finish-routine-button"
          >
            Finish Routine
          </button>
        </div>
      </div>
    </div>
  );
}
