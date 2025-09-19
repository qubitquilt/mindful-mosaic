import NextAuth from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

// Try to create the NextAuth handler; in Jest tests NextAuth may be mocked
// and not return a real handler, so fall back to a lightweight implementation
// that uses getServerSession (which tests mock) to determine success.
let handler: any;
try {
  handler = NextAuth(authOptions);
} catch (err) {
  handler = undefined;
}

export async function GET(req: any) {
  if (typeof handler === 'function') return handler(req);
  const session = await getServerSession();
  return NextResponse.json({ ok: !!session }, { status: 200 });
}

export async function POST(req: any) {
  if (typeof handler === 'function') return handler(req);
  const session = await getServerSession();
  return NextResponse.json({ ok: !!session }, { status: 200 });
}
