import { GET as getTasks, POST as createTask, PUT as updateTask, DELETE as deleteTask } from "@/app/api/routines/[id]/tasks/route"
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@repo/db"

jest.mock("next-auth")
jest.mock("@repo/db")

const mockSession = { user: { id: "user1" } }
const mockRequest = (url: string, method = "GET") => {
  const req = new Request(url, { method })
  ;(req as any).nextUrl = new URL(url)
  return req
}

describe("Tasks API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  })

  describe("GET /api/routines/[id]/tasks", () => {
    it("returns tasks for routine", async () => {
      const mockTasks = [{ id: "1", name: "Task 1", order: 0 }]
      ;(prisma.routine.findUnique as jest.Mock).mockResolvedValue({ tasks: mockTasks })

      const response = await getTasks(mockRequest("http://localhost/api/routines/1/tasks"), { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.routine.findUnique).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1" },
        include: { tasks: { orderBy: { order: "asc" } } },
      })
      expect(data).toEqual(mockTasks)
    })

    it("returns 404 if routine not found", async () => {
      ;(prisma.routine.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await getTasks(mockRequest("http://localhost/api/routines/999/tasks"), { params: { id: "999" } })
      expect(response.status).toBe(404)
    })
  })

  describe("POST /api/routines/[id]/tasks", () => {
    it("creates new task with next order", async () => {
      ;(prisma.task.aggregate as jest.Mock).mockResolvedValue({ _max: { order: 2 } })
      ;(prisma.task.create as jest.Mock).mockResolvedValue({ id: "new", name: "New Task" })

      const body = { name: "New Task", duration: 30, order: 0 }
      const request = new Request("http://localhost/api/routines/1/tasks", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const response = await createTask(request, { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.task.aggregate).toHaveBeenCalledWith({
        where: { routineId: "1" },
        _max: { order: true },
      })
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "New Task",
          duration: 30,
          routineId: "1",
          order: 3,
        }),
      })
      expect(response.status).toBe(201)
    })
  })

  describe("PUT /api/routines/[id]/tasks?taskId=...", () => {
    it("updates task", async () => {
      ;(prisma.task.update as jest.Mock).mockResolvedValue({ id: "1", name: "Updated" })

      const body = { name: "Updated" }
      const request = new Request("http://localhost/api/routines/1/tasks?taskId=1", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const response = await updateTask(request, { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: "1", routineId: "1" },
        data: { name: "Updated" },
      })
      expect(data).toEqual({ id: "1", name: "Updated" })
    })

    it("reorders tasks when order changed", async () => {
      const mockTasks = [{ id: "t1", order: 0 }, { id: "t2", order: 1 }]
      ;(prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks)
      ;(prisma.task.update as jest.Mock).mockResolvedValue({ id: "t1", order: 1 })

      const body = { order: 1 }
      const request = new Request("http://localhost/api/routines/1/tasks?taskId=t1", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      await updateTask(request, { params: { id: "1" } })

      expect(prisma.$transaction).toHaveBeenCalled()
    })
  })

  describe("DELETE /api/routines/[id]/tasks?taskId=...", () => {
    it("deletes task and reorders", async () => {
      const remainingTasks = [{ id: "t2", order: 1 }]
      ;(prisma.task.delete as jest.Mock).mockResolvedValue({})
      ;(prisma.task.findMany as jest.Mock).mockResolvedValue(remainingTasks)
      ;(prisma.task.update as jest.Mock).mockResolvedValue({ id: "t2", order: 0 })

      const request = new Request("http://localhost/api/routines/1/tasks?taskId=t1", { method: "DELETE" })

      const response = await deleteTask(request, { params: { id: "1" } })
      const data = await response.json()

      expect(prisma.$transaction).toHaveBeenCalled()
      expect(data.message).toBe("Task deleted")
    })
  })
})
