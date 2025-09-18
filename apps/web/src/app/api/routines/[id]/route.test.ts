import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@mindful-mosaic/db';

jest.mock('next-auth/next');
jest.mock('@mindful-mosaic/db');

const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const MockedPrismaClient = PrismaClient as jest.MockedClass<
  typeof PrismaClient
>;

describe('PUT /api/routines/[id]', () => {
  let prisma: any;
  let req: any;
  let params: any;

  beforeEach(() => {
    prisma = {
      task: {
        deleteMany: jest.fn().mockResolvedValue({}),
        createMany: jest.fn().mockResolvedValue({}),
      },
      routine: {
        update: jest.fn(),
      },
      $disconnect: jest.fn().mockResolvedValue({}),
    };
    MockedPrismaClient.mockImplementation(() => prisma);
    mockedGetServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });
    req = new NextRequest('http://localhost', { method: 'PUT' });
    req.json = jest.fn().mockResolvedValue({
      name: 'Updated Routine',
      timeSlot: '08:00 AM - 09:00 AM',
      tasks: [
        { name: 'Task 1', duration: 30 },
        { name: 'Task 2', duration: 20 },
      ],
    });
    params = { id: 'routine1' };
  });

  it('should update routine successfully', async () => {
    prisma.routine.update.mockResolvedValue({
      id: 'routine1',
      name: 'Updated Routine',
      timeSlot: '08:00 AM - 09:00 AM',
      userId: 'user1',
      tasks: [
        { id: 'task1', name: 'Task 1', duration: 30, order: 0 },
        { id: 'task2', name: 'Task 2', duration: 20, order: 1 },
      ],
    });

    const response = (await PUT(req, { params })) as Response;

    expect(prisma.task.deleteMany).toHaveBeenCalledWith({
      where: { routineId: 'routine1' },
    });
    expect(prisma.task.createMany).toHaveBeenCalledWith({
      data: [
        { name: 'Task 1', duration: 30, order: 0, routineId: 'routine1' },
        { name: 'Task 2', duration: 20, order: 1, routineId: 'routine1' },
      ],
    });
    expect(prisma.routine.update).toHaveBeenCalledWith({
      where: { id: 'routine1' },
      data: {
        name: 'Updated Routine',
        timeSlot: '08:00 AM - 09:00 AM',
        updatedAt: expect.any(Date),
      },
      include: { tasks: true },
    });
    expect(response.status).toBe(200);
  });

  it('should return 401 if no session', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = (await PUT(req, { params })) as Response;

    expect(response.status).toBe(401);
  });

  it('should return 404 if routine not found', async () => {
    prisma.routine.update.mockRejectedValue({ code: 'P2025' });

    const response = (await PUT(req, { params })) as Response;

    expect(response.status).toBe(404);
  });

  it('should return 403 if unauthorized user', async () => {
    prisma.routine.update.mockResolvedValue({
      id: 'routine1',
      userId: 'otheruser',
    });

    const response = (await PUT(req, { params })) as Response;

    expect(response.status).toBe(403);
  });

  it('should return 400 for invalid input', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: '',
      tasks: [],
    });

    const response = (await PUT(req, { params })) as Response;

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/routines/[id]', () => {
  let prisma: any;
  let req: any;
  let params: any;

  beforeEach(() => {
    prisma = {
      routine: {
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      },
      $disconnect: jest.fn().mockResolvedValue({}),
    };
    MockedPrismaClient.mockImplementation(() => prisma);
    mockedGetServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });
    req = new NextRequest('http://localhost', { method: 'DELETE' });
    params = { id: 'routine1' };
  });

  it('should delete routine successfully', async () => {
    prisma.routine.findUnique.mockResolvedValue({
      id: 'routine1',
      userId: 'user1',
    });

    const response = (await DELETE(req, { params })) as Response;

    expect(prisma.routine.findUnique).toHaveBeenCalledWith({
      where: { id: 'routine1' },
    });
    expect(prisma.routine.delete).toHaveBeenCalledWith({
      where: { id: 'routine1' },
    });
    expect(response.status).toBe(204);
  });

  it('should return 401 if no session', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = (await DELETE(req, { params })) as Response;

    expect(response.status).toBe(401);
  });

  it('should return 404 if routine not found', async () => {
    prisma.routine.findUnique.mockResolvedValue(null);

    const response = (await DELETE(req, { params })) as Response;

    expect(response.status).toBe(404);
  });

  it('should return 403 if unauthorized user', async () => {
    prisma.routine.findUnique.mockResolvedValue({
      id: 'routine1',
      userId: 'otheruser',
    });

    const response = (await DELETE(req, { params })) as Response;

    expect(response.status).toBe(403);
  });
});
