import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import RoutineTasksPage from "@/app/routines/[id]/page"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"

jest.mock("next-auth/react")
jest.mock("next/navigation")
jest.mock("date-fns", () => ({
  format: jest.fn(() => "2023-10-01T08:00:00"),
}))

const mockSession = { data: { user: { id: "user1" } }, status: "authenticated" }
const mockRoutine = { id: "1", name: "Morning Routine", scheduledTime: "2023-10-01T08:00:00" }
const mockTasks = [
  { id: "t1", name: "Brush teeth", duration: 5, order: 0 },
  { id: "t2", name: "Exercise", duration: 30, order: 1 },
]

global.fetch = jest.fn()

describe("Routine Tasks Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(useParams as jest.Mock).mockReturnValue({ id: "1" })
    ;(useRouter as jest.Mock).mockReturnValue({ back: jest.fn(), push: jest.fn() })
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutine })
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
  })

  it("renders routine tasks", async () => {
    render(<RoutineTasksPage />)

    await waitFor(() => {
      expect(screen.getByText("Morning Routine")).toBeInTheDocument()
      expect(screen.getByText("1. Brush teeth")).toBeInTheDocument()
      expect(screen.getByText("Duration: 5 min")).toBeInTheDocument()
      expect(screen.getByText("Add Task")).toBeInTheDocument()
    })
  })

  it("opens add task form", async () => {
    render(<RoutineTasksPage />)

    fireEvent.click(screen.getByText("Add Task"))

    await waitFor(() => {
      expect(screen.getByText("Add New Task")).toBeInTheDocument()
      expect(screen.getByLabelText("Task Name")).toBeInTheDocument()
    })
  })

  it("creates new task", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutine })
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "new", name: "New Task" }) })

    render(<RoutineTasksPage />)

    fireEvent.click(screen.getByText("Add Task"))

    const nameInput = screen.getByLabelText("Task Name")
    const durationInput = screen.getByLabelText("Duration (minutes)")
    fireEvent.change(nameInput, { target: { value: "New Task" } })
    fireEvent.change(durationInput, { target: { value: "15" } })

    fireEvent.click(screen.getByText("Create"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines/1/tasks", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "New Task",
          duration: 15,
          notes: "",
        }),
      }))
    })
  })

  it("edits existing task", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutine })
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockTasks[0], name: "Updated" }) })

    render(<RoutineTasksPage />)

    fireEvent.click(screen.getByText("Edit"))

    const nameInput = screen.getByLabelText("Task Name")
    fireEvent.change(nameInput, { target: { value: "Updated" } })

    fireEvent.click(screen.getByText("Update"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines/1/tasks?taskId=t1", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(expect.objectContaining({ name: "Updated" })),
      }))
    })
  })

  it("deletes task", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutine })
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Task deleted" })) // delete
      .mockResolvedValueOnce({ ok: true, json: async () => [mockTasks[1]] }) // refetch

    render(<RoutineTasksPage />)

    // Mock confirm
    window.confirm = jest.fn(() => true)

    fireEvent.click(screen.getByText("Delete"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines/1/tasks?taskId=t1", { method: "DELETE" })
      expect(screen.queryByText("Brush teeth")).not.toBeInTheDocument()
    })
  })

  it("reorders tasks", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutine })
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // update order
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // update order

    render(<RoutineTasksPage />)

    const upButton = screen.getAllByText("↑")[1] // second task's up button
    fireEvent.click(upButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines/1/tasks?taskId=t2", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ order: 0 }),
      }))
    })
  })
})
