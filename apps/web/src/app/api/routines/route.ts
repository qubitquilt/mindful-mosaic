import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authConfig } from "@/lib/auth"
import { prisma } from "@repo/db"
import { format, parseISO } from "date-fns"

const createRoutineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  scheduledTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  repeatDays: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")
    let where: any = { userId: session.user.id }

    if (dateStr) {
      const date = parseISO(dateStr)
      where.scheduledTime = {
        gte: format(date, "yyyy-MM-ddT00:00:00"),
        lte: format(date, "yyyy-MM-ddT23:59:59"),
      }
    }

    const routines = await prisma.routine.findMany({
      where,
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(routines)
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validated = createRoutineSchema.parse(body)

    const routine = await prisma.routine.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
      include: { tasks: true },
    })

    return NextResponse.json(routine, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating routine:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
