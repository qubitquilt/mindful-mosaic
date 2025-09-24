import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authConfig } from "@/lib/auth"
import { prisma } from "@repo/db"

const createCompletionSchema = z.object({
  routineId: z.string(),
  taskId: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const routineId = searchParams.get("routineId")
    const dateStr = searchParams.get("date")
    const where: Prisma.CompletionWhereInput = {
      userId: session.user.id,
      ...(routineId && { routineId }),
      ...(dateStr && { 
        completedAt: {
          gte: new Date(dateStr),
          lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000),
        }
      })
    }

    const completions = await prisma.completion.findMany({
      where,
      include: {
        routine: true,
        task: true,
      },
      orderBy: { completedAt: "desc" },
    })

    return NextResponse.json(completions)
  } catch (error) {
    console.error("Error fetching completions:", error)
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
    const validated = createCompletionSchema.parse(body)

    const completion = await prisma.completion.create({
      data: {
        ...validated,
        userId: session.user.id,
        completedAt: validated.completedAt ? new Date(validated.completedAt) : new Date(),
      },
      include: {
        routine: true,
        task: true,
      },
    })

    return NextResponse.json(completion, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating completion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
