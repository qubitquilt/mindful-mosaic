import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import RoutinesPage from "@/app/routines/page"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

jest.mock("next-auth/react")
jest.mock("next/navigation")
jest.mock("date-fns", () => ({
  format: jest.fn(() => "2023-10-01"),
}))

const mockSession = { data: { user: { id: "user1" } }, status: "authenticated" }
const mockRoutines = [
  { id: "1", name: "Morning", scheduledTime: "2023-10-01T08:00:00", tasks: [] }
]

global.fetch = jest.fn()

describe("Routines Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockRoutines,
    })
  })

  it("renders routines list when authenticated", async () => {
    render(<RoutinesPage />)

    await waitFor(() => {
      expect(screen.getByText("Routines")).toBeInTheDocument()
      expect(screen.getByText("Create Routine")).toBeInTheDocument()
      expect(screen.getByText("Morning")).toBeInTheDocument()
    })
  })

  it("shows loading state", async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<RoutinesPage />)

    expect(screen.getByText("Loading routines...")).toBeInTheDocument()
  })

  it("shows no routines message", async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<RoutinesPage />)

    await waitFor(() => {
      expect(screen.getByText("No routines found.")).toBeInTheDocument()
    })
  })

  it("opens create form on button click", async () => {
    render(<RoutinesPage />)

    fireEvent.click(screen.getByText("Create Routine"))

    await waitFor(() => {
      expect(screen.getByText("Create Routine")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Routine name")).toBeInTheDocument()
    })
  })

  it("filters routines by date", async () => {
    render(<RoutinesPage />)

    const dateInput = screen.getByLabelText(/filter by date/i) as HTMLInputElement
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines?date=2023-10-01")
    })
  })

  it("creates new routine", async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoutines })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "new", name: "New Routine" }) })

    render(<RoutinesPage />)

    fireEvent.click(screen.getByText("Create Routine"))

    const nameInput = screen.getByPlaceholderText("Routine name")
    const timeInput = screen.getByLabelText(/time/i) || screen.getAllByRole("textbox")[1]
    fireEvent.change(nameInput, { target: { value: "New Routine" } })
    fireEvent.change(timeInput, { target: { value: "2023-10-01T09:00" } })

    fireEvent.click(screen.getByText("Create"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/routines", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "New Routine",
          scheduledTime: "2023-10-01T09:00",
          repeatDays: "",
        }),
      }))
    })
  })
})
