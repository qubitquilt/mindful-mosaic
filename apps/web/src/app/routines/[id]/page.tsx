"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"

interface Task {
  id: string
  name: string
  duration: number
  order: number
  notes?: string
}

interface Routine {
  id: string
  name: string
  scheduledTime: string
}

export default function RoutineTasksPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const routineId = params.id as string

  const [routine, setRoutine] = useState<Routine | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", duration: 0, notes: "" })
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (status === "authenticated" && routineId) {
      fetchRoutine()
      fetchTasks()
    }
  }, [status, routineId, fetchRoutine, fetchTasks])

  const fetchRoutine = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/routines/${routineId}`)
      if (!response.ok) throw new Error("Failed to fetch routine")
      const data = await response.json()
      setRoutine(data)
    } catch (err) {
      setError("Failed to load routine")
      console.error(err)
    }
  }, [routineId])

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/routines/${routineId}/tasks`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError("Failed to load tasks")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [routineId])

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTask 
        ? `/api/routines/${routineId}/tasks?taskId=${editingTask.id}`
        : `/api/routines/${routineId}/tasks`
      const method = editingTask ? "PUT" : "POST"
      
      const body = editingTask ? { ...formData, order: editingTask.order } : formData
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) throw new Error(editingTask ? "Failed to update task" : "Failed to create task")
      
      setShowForm(false)
      setEditingTask(null)
      setFormData({ name: "", duration: 0, notes: "" })
      fetchTasks()
    } catch (err) {
      setError(editingTask ? "Failed to update task" : "Failed to create task")
      console.error(err)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    
    try {
      const response = await fetch(`/api/routines/${routineId}/tasks?taskId=${taskId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete task")
      fetchTasks()
    } catch (err) {
      setError("Failed to delete task")
      console.error(err)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({ name: task.name, duration: task.duration, notes: task.notes || "" })
    setShowForm(true)
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newTasks = [...tasks]
    const [movedTask] = newTasks.splice(fromIndex, 1)
    newTasks.splice(toIndex, 0, movedTask)
    
    // Update orders on server
    try {
      for (let i = 0; i < newTasks.length; i++) {
        await fetch(`/api/routines/${routineId}/tasks?taskId=${newTasks[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      }
      setTasks(newTasks)
    } catch (err) {
      setError("Failed to reorder tasks")
      console.error(err)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Please log in.</div>
  if (error) return <div className="text-red-500 p-8">{error}</div>

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{routine?.name}</h1>
          <p className="text-gray-600">Scheduled: {new Date(routine?.scheduledTime).toLocaleString()}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back to Routines
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-center space-x-4 p-4 border rounded">
              <span className="w-8 text-center">{task.order + 1}.</span>
              <div className="flex-1">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-gray-600">Duration: {task.duration} min</p>
                {task.notes && <p className="text-sm text-gray-500">{task.notes}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
              {tasks.length > 1 && (
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleReorder(index, index - 1)}
                    disabled={index === 0}
                    className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(index, index + 1)}
                    disabled={index === tasks.length - 1}
                    className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          ))}
          {tasks.length === 0 && <p>No tasks for this routine.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTask(null)
                    setFormData({ name: "", duration: 0, notes: "" })
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {editingTask ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
