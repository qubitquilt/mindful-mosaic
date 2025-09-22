import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@mindful-mosaic/db';
import { authOptions } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  const { searchParams } = new URL(request.url);
  let dateStr = searchParams.get('date');
  if (!dateStr) {
    const today = new Date();
    dateStr = today.toISOString().split('T')[0];
  }
  const date = new Date(dateStr);
  const dayOfWeek = date
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const routines = await prisma.routine.findMany({
      where: {
        userId: session.user.id,
        repeatDays: {
          contains: dayOfWeek,
        },
      },
      include: { tasks: true },
      orderBy: { scheduledTime: 'asc' },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const { name, scheduledTime, repeatDays, tasks } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Routine name is required' },
        { status: 400 }
      );
    }

    if (
      !scheduledTime ||
      typeof scheduledTime !== 'string' ||
      scheduledTime.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Scheduled time is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: 'At least one task is required' },
        { status: 400 }
      );
    }

    for (const task of tasks) {
      if (
        !task.name ||
        typeof task.name !== 'string' ||
        task.name.trim().length === 0
      ) {
        return NextResponse.json(
          { error: 'Task name is required' },
          { status: 400 }
        );
      }
      if (typeof task.duration !== 'number' || task.duration <= 0) {
        return NextResponse.json(
          { error: 'Task duration must be positive number' },
          { status: 400 }
        );
      }
    }

    const createdTasks = tasks.map((task, index) => ({
      name: task.name.trim(),
      duration: task.duration,
      order: index,
    }));

    const routine = await prisma.routine.create({
      data: {
        name: name.trim(),
        scheduledTime: scheduledTime.trim(),
        repeatDays: repeatDays || null,
        userId: session.user.id,
        tasks: {
          create: createdTasks,
        },
      },
      include: { tasks: true },
    });

    return NextResponse.json({ routine }, { status: 201 });
  } catch (error) {
    console.error('Error creating routine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
