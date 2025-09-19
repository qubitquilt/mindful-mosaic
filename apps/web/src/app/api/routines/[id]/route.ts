import { NextRequest } from 'next/server';
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
      return { status: 401, body: { error: 'Unauthorized' } };
    }

    const { name, timeSlot, tasks } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return { status: 400, body: { error: 'Routine name is required' } };
    }

    if (
      !timeSlot ||
      typeof timeSlot !== 'string' ||
      timeSlot.trim().length === 0
    ) {
      return { status: 400, body: { error: 'Time slot is required' } };
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return { status: 400, body: { error: 'At least one task is required' } };
    }

    for (const task of tasks) {
      if (
        !task.name ||
        typeof task.name !== 'string' ||
        task.name.trim().length === 0
      ) {
        return { status: 400, body: { error: 'Task name is required' } };
      }
      if (typeof task.duration !== 'number' || task.duration <= 0) {
        return { status: 400, body: { error: 'Task duration must be positive number' } };
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
      return { status: 403, body: { error: 'Unauthorized' } };
    }

    return { status: 200, body: { routine: updatedRoutine } };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      // Record not found
      return { status: 404, body: { error: 'Routine not found' } };
    }
    console.error('Error updating routine:', error);
    return { status: 500, body: { error: 'Internal server error' } };
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
      return { status: 401, body: { error: 'Unauthorized' } };
    }

    const routine = await prisma.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      return { status: 404, body: { error: 'Routine not found' } };
    }

    if (routine.userId !== session.user.id) {
      return { status: 403, body: { error: 'Unauthorized' } };
    }

    await prisma.routine.delete({ where: { id } });

    return { status: 204 };
  } catch (error) {
    console.error('Error deleting routine:', error);
    return { status: 500, body: { error: 'Internal server error' } };
  } finally {
    await prisma.$disconnect();
  }
}
