import { render, screen, waitFor } from "@testing-library/react"
import DashboardPage from "@/app/dashboard/page"
import { useSession } from "next-auth/react"

jest.mock("next-auth/react")
jest.mock("recharts", () => ({
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ResponsiveContainer: ({ children }) => <div style={{ width: "100%", height: 300 }}>{children}</div>,
}))

const mockSession = { data: { user: { id: "user1" } }, status: "authenticated" }
const mockStats = {
  totalRoutines: 5,
  totalTasks: 20,
  weeklyCompletions: 8,
  monthlyAdherence: 75.5,
  recentCompletions: [],
  trend: [{ date: "Mon", completions: 2 }, { date: "Tue", completions: 3 }],
}

global.fetch = jest.fn()

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockStats })
  })

  it("renders dashboard stats", async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("5")).toBeInTheDocument() // total routines
      expect(screen.getByText("20")).toBeInTheDocument() // total tasks
      expect(screen.getByText("8")).toBeInTheDocument() // weekly
      expect(screen.getByText("75.5%")).toBeInTheDocument() // adherence
      expect(screen.getByText("Completion Trend (Last 7 Days)")).toBeInTheDocument()
    })
  })

  it("shows loading state", () => {
    ;(useSession as jest.Mock).mockReturnValue({ ...mockSession, status: "loading" })
    render(<DashboardPage />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows error state", async () => {
    ;(fetch as jest.Mock).mockRejectedValue(new Error("Failed"))
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard")).toBeInTheDocument()
    })
  })
})
