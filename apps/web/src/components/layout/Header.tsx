'use client';

import { useSession } from 'next-auth/react';
import SignOutButton from '../auth/SignOutButton';
import SignInButton from '../SignInButton';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mindful Mosaic</h1>
        <div>
          {session ? (
            <div className="flex items-center space-x-4">
              <span>{session.user?.name || session.user?.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
