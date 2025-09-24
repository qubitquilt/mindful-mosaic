import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CompletionsPage from "@/app/dashboard/completions/page"
import { useSession } from "next-auth/react"

jest.mock("next-auth/react")
jest.mock("date-fns", () => ({
  format: jest.fn((date: Date) => date.toISOString().split('T')[0]),
}))

const mockSession = { data: { user: { id: "user1" } }, status: "authenticated" }
const mockCompletions = [
  {
    id: "c1",
    completedAt: "2023-10-01T10:00:00Z",
    routine: { name: "Morning Routine", scheduledTime: "2023-10-01T08:00:00" },
    task: { name: "Exercise", duration: 30 },
    notes: "Felt great!"
  }
]

global.fetch = jest.fn()

describe("Completions Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockCompletions })
  })

  it("renders completions list", async () => {
    render(<CompletionsPage />)

    await waitFor(() => {
      expect(screen.getByText("Execution History")).toBeInTheDocument()
      expect(screen.getByText("Morning Routine")).toBeInTheDocument()
      expect(screen.getByText("Task: Exercise (30 min)")).toBeInTheDocument()
      expect(screen.getByText("Felt great!")).toBeInTheDocument()
    })
  })

  it("filters by date", async () => {
    render(<CompletionsPage />)

    const dateInput = screen.getByLabelText(/filter by date/i) as HTMLInputElement
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/completions?date=2023-10-01")
    })
  })

  it("deletes completion", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockCompletions })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Completion deleted" }) })

    render(<CompletionsPage />)

    // Mock confirm
    window.confirm = jest.fn(() => true)

    fireEvent.click(screen.getByText("Delete"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/completions/c1", { method: "DELETE" })
    })
  })
})
