"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface Completion {
  id: string
  completedAt: string
  routine: { name: string }
  task?: { name: string }
  notes?: string
}

interface Stats {
  totalRoutines: number
  totalTasks: number
  weeklyCompletions: number
  monthlyAdherence: number
  recentCompletions: Completion[]
  trend: { date: string; completions: number }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data: Stats = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError("Failed to load dashboard")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetchStats()
    }
  }, [status, fetchStats])

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Please log in to view dashboard.</div>

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {isLoading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Routines</h2>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalRoutines || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
            <p className="text-3xl font-bold text-green-600">{stats?.totalTasks || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">This Week</h2>
            <p className="text-3xl font-bold text-purple-600">{stats?.weeklyCompletions || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Adherence Rate</h2>
            <p className="text-3xl font-bold text-orange-600">{stats?.monthlyAdherence || 0}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Completion Trend (Last 7 Days)</h2>
          {stats?.trend && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completions" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Completions</h2>
          <div className="space-y-2">
            {stats?.recentCompletions?.map((completion) => (
              <div key={completion.id} className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{completion.routine.name}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(completion.completedAt), "PPPp")}
                </p>
                {completion.task && (
                  <p className="text-sm text-gray-500">Task: {completion.task.name}</p>
                )}
                {completion.notes && <p className="text-sm text-gray-500">{completion.notes}</p>}
              </div>
            )) || <p>No recent completions.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/routines" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Manage Routines
        </Link>
        <Link href="/dashboard/completions" className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 ml-4">
          View History
        </Link>
      </div>
    </main>
  )
}
