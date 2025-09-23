"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

interface Completion {
  id: string
  completedAt: string
  notes?: string
  routine: { name: string; scheduledTime: string }
  task?: { name: string; duration: number }
}

export default function CompletionsPage() {
  const { data: session, status } = useSession()
  const [completions, setCompletions] = useState<Completion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterDate, setFilterDate] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchCompletions()
    }
  }, [status, filterDate])

  const fetchCompletions = async () => {
    try {
      setIsLoading(true)
      const url = filterDate ? `/api/completions?date=${filterDate}` : "/api/completions"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch completions")
      const data = await response.json()
      setCompletions(data)
      setError(null)
    } catch (err) {
      setError("Failed to load completions")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Please log in to view completions.</div>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Execution History</h1>
      
      <div className="mb-6">
        <label className="mr-2">Filter by date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {isLoading ? (
        <div>Loading completions...</div>
      ) : (
        <div className="space-y-4">
          {completions.map((completion) => (
            <div key={completion.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{completion.routine.name}</h3>
                  <p className="text-sm text-gray-600">
                    Completed: {format(new Date(completion.completedAt), "PPPp")}
                  </p>
                  {completion.task && (
                    <p className="text-sm text-gray-500">
                      Task: {completion.task.name} ({completion.task.duration} min)
                    </p>
                  )}
                  {completion.notes && (
                    <p className="text-sm text-gray-500 mt-1">{completion.notes}</p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (confirm("Delete this completion?")) {
                      const res = await fetch(`/api/completions/${completion.id}`, { method: "DELETE" })
                      if (res.ok) fetchCompletions()
                    }
                  }}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {completions.length === 0 && <p>No completions found.</p>}
        </div>
      )}
    </main>
  )
}
