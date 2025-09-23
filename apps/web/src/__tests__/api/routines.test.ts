import { GET as getRoutines } from "@/app/api/routines/route"
import { GET as getRoutine, PUT as updateRoutine, DELETE as deleteRoutine } from "@/app/api/routines/[id]/route"
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@repo/db"

jest.mock("next-auth")
jest.mock("@repo/db")

const mockSession = { user: { id: "user1" } }
const mockRequest = (url: string) => {
  const req = new Request(url)
  ;(req as any).nextUrl = new URL(url)
  return req
}

describe("Routines API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  })

  describe("GET /api/routines", () => {
    it("returns user's routines", async () => {
      const mockRoutines = [{ id: "1", name: "Morning Routine" }]
      ;(prisma.routine.findMany as jest.Mock).mockResolvedValue(mockRoutines)

      const response = await getRoutines(mockRequest("http://localhost/api/routines"))
      const data = await response.json()

      expect(prisma.routine.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
        include: { tasks: true },
        orderBy: { createdAt: "desc" },
      })
      expect(data).toEqual(mockRoutines)
    })

    it("filters by date", async () => {
      const mockRoutines = []
      ;(prisma.routine.findMany as jest.Mock).mockResolvedValue(mockRoutines)

      const response = await getRoutines(mockRequest("http://localhost/api/routines?date=2023-10-01"))
      const data = await response.json()

      expect(prisma.routine.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          scheduledTime: expect.objectContaining({
            gte: "2023-10-01T00:00:00",
            lte: "2023-10-01T23:59:59",
          }),
        }),
      }))
      expect(data).toEqual(mockRoutines)
    })

    it("returns 401 if no session", async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await getRoutines(mockRequest("http://localhost/api/routines"))
      expect(response.status).toBe(401)
    })
  })

  describe("POST /api/routines", () => {
    it("creates a new routine", async () => {
      const mockRoutine = { id: "new", name: "New Routine" }
      ;(prisma.routine.create as jest.Mock).mockResolvedValue(mockRoutine)

      const body = { name: "New Routine", scheduledTime: "2023-10-01T08:00:00" }
      const request = new Request("http://localhost/api/routines", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const response = await (request as any).POST(request)
      const data = await response.json()

      expect(prisma.routine.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "New Routine",
          scheduledTime: "2023-10-01T08:00:00",
          userId: "user1",
        }),
        include: { tasks: true },
      })
      expect(response.status).toBe(201)
      expect(data).toEqual(mockRoutine)
    })

    it("returns 400 for invalid data", async () => {
      const body = { name: "" }
      const request = new Request("http://localhost/api/routines", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const response = await (request as any).POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe("GET /api/routines/[id]", () => {
    it("returns specific routine", async () => {
      const mockRoutine = { id: "1", name: "Test" }
      ;(prisma.routine.findUnique as jest.Mock).mockResolvedValue(mockRoutine)

      const response = await getRoutine(mockRequest("http://localhost/api/routines/1"), { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.routine.findUnique).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1" },
        include: { tasks: true },
      })
      expect(data).toEqual(mockRoutine)
    })

    it("returns 404 if not found", async () => {
      ;(prisma.routine.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await getRoutine(mockRequest("http://localhost/api/routines/999"), { params: { id: "999" } })
      expect(response.status).toBe(404)
    })
  })

  describe("PUT /api/routines/[id]", () => {
    it("updates routine", async () => {
      ;(prisma.routine.updateMany as jest.Mock).mockResolvedValue({ count: 1 })
      ;(prisma.routine.findUnique as jest.Mock).mockResolvedValue({ id: "1", name: "Updated" })

      const body = { name: "Updated" }
      const request = new Request("http://localhost/api/routines/1", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const response = await (request as any).PUT(request, { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.routine.updateMany).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1" },
        data: { name: "Updated" },
      })
      expect(data).toEqual({ id: "1", name: "Updated" })
    })
  })

  describe("DELETE /api/routines/[id]", () => {
    it("deletes routine", async () => {
      ;(prisma.routine.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })

      const response = await deleteRoutine(mockRequest("http://localhost/api/routines/1"), { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.routine.deleteMany).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1" },
      })
      expect(data.message).toBe("Routine deleted")
    })
  })
})
