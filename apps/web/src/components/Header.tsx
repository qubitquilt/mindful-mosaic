"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Organizer</Link>
        <div className="space-x-4">
          {session ? (
            <>
              <span>Welcome, {session.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-500 px-4 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
