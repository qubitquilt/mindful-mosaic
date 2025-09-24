"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

interface Routine {
  id: string
  name: string
  scheduledTime: string
  repeatDays?: string
  tasks: Task[]
  createdAt: string
}

interface Task {
  id: string
  name: string
  duration: number
  order: number
}

export default function RoutinesPage() {
  const { data: session, status } = useSession()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", scheduledTime: "", repeatDays: "" })
  const [filterDate, setFilterDate] = useState("")

  const fetchRoutines = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = filterDate 
        ? `/api/routines?date=${format(new Date(filterDate), "yyyy-MM-dd")}`
        : "/api/routines"
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch routines")
      }
      const data = await response.json()
      setRoutines(data)
      setError(null)
    } catch (err) {
      setError("Failed to load routines")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [filterDate])

  useEffect(() => {
    if (status === "authenticated") {
      fetchRoutines()
    }
  }, [status, fetchRoutines])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error("Failed to create routine")
      }
      const newRoutine = await response.json()
      setRoutines([newRoutine, ...routines])
      setShowForm(false)
      setFormData({ name: "", scheduledTime: "", repeatDays: "" })
    } catch (err) {
      setError("Failed to create routine")
      console.error(err)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Please log in to view routines.</div>

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Routines</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Routine
        </button>
      </div>

      <div className="mb-4">
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
        <div>Loading routines...</div>
      ) : (
        <div className="grid gap-4">
          {routines.map((routine) => (
            <div key={routine.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{routine.name}</h2>
              <p>Time: {new Date(routine.scheduledTime).toLocaleString()}</p>
              {routine.repeatDays && <p>Repeats: {routine.repeatDays}</p>}
              <div className="mt-2">
                Tasks: {routine.tasks.map((task) => (
                  <div key={task.id} className="ml-4">{task.name} ({task.duration} min)</div>
                ))}
              </div>
            </div>
          ))}
          {routines.length === 0 && <p>No routines found.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Create Routine</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Routine name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Repeat days (e.g., MONDAY,WEDNESDAY)"
                  value={formData.repeatDays}
                  onChange={(e) => setFormData({ ...formData, repeatDays: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
