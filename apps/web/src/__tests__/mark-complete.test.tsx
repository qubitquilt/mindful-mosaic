import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import MarkCompletePage from "@/app/routines/[id]/tasks/page"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"

jest.mock("next-auth/react")
jest.mock("next/navigation")

const mockSession = { data: { user: { id: "user1" } }, status: "authenticated" }

global.fetch = jest.fn()

describe("Mark Complete Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(useParams as jest.Mock).mockReturnValue({ id: "1", taskId: "t1" })
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) })
  })

  it("renders form", () => {
    render(<MarkCompletePage />)

    expect(screen.getByText("Mark as Complete")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("How did it go?")).toBeInTheDocument()
  })

  it("submits completion", async () => {
    render(<MarkCompletePage />)

    fireEvent.change(screen.getByPlaceholderText("How did it go?"), { target: { value: "Great!" } })
    fireEvent.click(screen.getByText("Mark Complete"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/completions", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          routineId: "1",
          taskId: "t1",
          notes: "Great!",
        }),
      }))
      expect(screen.getByText("Completed successfully!")).toBeInTheDocument()
    })
  })
})
