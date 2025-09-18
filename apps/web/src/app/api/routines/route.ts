import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let dateStr = searchParams.get('date')
  if (!dateStr) {
    const today = new Date()
    dateStr = today.toISOString().split('T')[0]
  }
  const startDate = new Date(dateStr + 'T00:00:00.000Z')
  const endDate = new Date(dateStr + 'T23:59:59.999Z')
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json([])
    }

    const routines = await prisma.routine.findMany({
      where: { 
        userId: session.user.id,
        scheduledDate: {
          gte: startDate,
          lt: endDate
        }
      },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(routines)
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json([])
    }

    const { name, timeSlot, tasks } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Routine name is required' }, { status: 400 })
    }

    if (!timeSlot || typeof timeSlot !== 'string' || timeSlot.trim().length === 0) {
      return NextResponse.json({ error: 'Time slot is required' }, { status: 400 })
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
        timeSlot: timeSlot.trim(),
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