import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, tasks } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Routine name is required' }, { status: 400 })
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: 'At least one task is required' }, { status: 400 })
    }

    for (const task of tasks) {
      if (!task.name || typeof task.name !== 'string' || task.name.trim().length === 0) {
        return NextResponse.json({ error: 'Task name is required' }, { status: 400 })
      }
      if (typeof task.duration !== 'number' || task.duration <= 0) {
        return NextResponse.json({ error: 'Task duration must be positive number' }, { status: 400 })
      }
    }

    const createdTasks = tasks.map((task, index) => ({
      name: task.name.trim(),
      duration: task.duration,
      order: index,
    }))

    const routine = await prisma.routine.create({
      data: {
        name: name.trim(),
        userId: session.user.id,
        tasks: {
          create: createdTasks,
        },
      },
      include: { tasks: true },
    })

    return NextResponse.json({ routine }, { status: 201 })
  } catch (error) {
    console.error('Error creating routine:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}