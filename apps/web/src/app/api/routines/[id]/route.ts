import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@mindful-mosaic/db';
import { authOptions } from '../../../../../lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, timeSlot, tasks } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Routine name is required' },
        { status: 400 }
      );
    }

    if (
      !timeSlot ||
      typeof timeSlot !== 'string' ||
      timeSlot.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Time slot is required' },
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

    // Delete existing tasks
    await prisma.task.deleteMany({
      where: { routineId: id },
    });

    // Create new tasks
    const createdTasks = tasks.map((task, index) => ({
      name: task.name.trim(),
      duration: task.duration,
      order: index,
      routineId: id,
    }));

    await prisma.task.createMany({
      data: createdTasks,
    });

    // Update routine
    const updatedRoutine = await prisma.routine.update({
      where: { id },
      data: {
        name: name.trim(),
        timeSlot: timeSlot.trim(),
        updatedAt: new Date(),
      },
      include: { tasks: true },
    });

    if (updatedRoutine.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ routine: updatedRoutine });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      // Record not found
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }
    console.error('Error updating routine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routine = await prisma.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }

    if (routine.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.routine.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
