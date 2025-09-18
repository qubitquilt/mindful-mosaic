'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import SignOutButton from '../auth/SignOutButton';
import SignInButton from '../SignInButton';
import RoutineForm from '../routine/RoutineForm';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mindful Mosaic</h1>
        <div>
          {session ? (
            <div className="flex items-center space-x-4">
              <span>{session.user?.name || session.user?.email}</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Routine
              </button>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
      <RoutineForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
