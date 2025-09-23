import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authConfig } from "@/lib/auth"
import { prisma } from "@repo/db"

const createTaskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.number().min(1, "Duration must be positive"),
  order: z.number().min(0),
  notes: z.string().optional(),
})

const updateTaskSchema = z.object({
  name: z.string().min(1).optional(),
  duration: z.number().min(1).optional(),
  order: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const routine = await prisma.routine.findUnique({
      where: { id: params.id, userId: session.user.id },
      include: { tasks: { orderBy: { order: "asc" } } },
    })

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 })
    }

    return NextResponse.json(routine.tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validated = createTaskSchema.parse(body)

    // Find current max order for the routine
    const maxOrder = await prisma.task.aggregate({
      where: { routineId: params.id },
      _max: { order: true },
    })

    const task = await prisma.task.create({
      data: {
        ...validated,
        routineId: params.id,
        order: (maxOrder._max.order || -1) + 1,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    const body = await request.json()
    const validated = updateTaskSchema.parse(body)

    // If order is provided, update all tasks to maintain sequence
    if (validated.order !== undefined) {
      await prisma.$transaction(async (tx) => {
        // Get all tasks for this routine
        const tasks = await tx.task.findMany({
          where: { routineId: params.id },
          orderBy: { order: "asc" },
        })

        // Update orders
        for (let i = 0; i < tasks.length; i++) {
          await tx.task.update({
            where: { id: tasks[i].id },
            data: { order: i },
          })
        }

        // Update the specific task's order if needed
        if (validated.order !== undefined) {
          await tx.task.update({
            where: { id: taskId, routineId: params.id },
            data: { order: validated.order },
          })
        }
      })
    }

    const task = await prisma.task.update({
      where: { id: taskId, routineId: params.id },
      data: validated,
    })

    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    // Delete task and reorder remaining tasks
    await prisma.$transaction(async (tx) => {
      // Delete the task
      await tx.task.delete({
        where: { id: taskId, routineId: params.id },
      })

      // Reorder remaining tasks
      const remainingTasks = await tx.task.findMany({
        where: { routineId: params.id },
        orderBy: { order: "asc" },
      })

      for (let i = 0; i < remainingTasks.length; i++) {
        await tx.task.update({
          where: { id: remainingTasks[i].id },
          data: { order: i },
        })
      }
    })

    return NextResponse.json({ message: "Task deleted" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
