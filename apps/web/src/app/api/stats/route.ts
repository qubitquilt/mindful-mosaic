import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { prisma } from "@repo/db"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Total routines
    const totalRoutines = await prisma.routine.count({ where: { userId } })

    // Total tasks
    const totalTasks = await prisma.task.count({ where: { routine: { userId } } })

    // Completed completions this week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const weeklyCompletions = await prisma.completion.count({
      where: {
        userId,
        completedAt: { gte: weekStart, lte: weekEnd },
      },
    })

    // Monthly adherence rate (completions / total tasks)
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())
    const monthlyCompletions = await prisma.completion.count({
      where: {
        userId,
        completedAt: { gte: monthStart, lte: monthEnd },
      },
    })
    const monthlyAdherence = totalTasks > 0 ? (monthlyCompletions / totalTasks * 100).toFixed(1) : 0

    // Recent completions (last 7 days)
    const recentStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentCompletions = await prisma.completion.findMany({
      where: {
        userId,
        completedAt: { gte: recentStart },
      },
      include: { routine: true, task: true },
      orderBy: { completedAt: "desc" },
      take: 5,
    })

    // Completion trend (daily for last 7 days)
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      const count = await prisma.completion.count({
        where: {
          userId,
          completedAt: { gte: dayStart, lte: dayEnd },
        },
      })
      trend.push({
        date: format(dayStart, "MMM dd"),
        completions: count,
      })
    }

    return NextResponse.json({
      totalRoutines,
      totalTasks,
      weeklyCompletions,
      monthlyAdherence: parseFloat(monthlyAdherence),
      recentCompletions,
      trend,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
