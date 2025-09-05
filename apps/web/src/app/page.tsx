'use client';

import { SessionProvider } from 'next-auth/react';
import SignInButton from '../components/SignInButton';

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <div className="mt-8">
          <SignInButton />
        </div>
      </main>
    </SessionProvider>
  );
}
