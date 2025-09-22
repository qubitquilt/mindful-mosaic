import { jest } from '@jest/globals';

jest.mock('@auth/prisma-adapter');

const mockPrisma = {
  routine: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@mindful-mosaic/db', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const mockAuthOptions = {};

jest.mock('../../../../../lib/auth', () => ({
  authOptions: mockAuthOptions,
}));

const mockGetServerSession = jest.fn();

jest.mock('next-auth/next', () => ({
  getServerSession: mockGetServerSession,
}));

class MockHeaders {
  constructor(init = {}) {
    this.map = new Map();
    if (init && typeof init === 'object' && init !== null) {
      for (const [key, value] of Object.entries(init)) {
        this.map.set(key.toLowerCase(), [value]);
      }
    }
  }

  get(key) {
    const entry = this.map.get(key.toLowerCase());
    return entry ? entry[0] : null;
  }

  set(key, value) {
    this.map.set(key.toLowerCase(), [value]);
  }

  has(key) {
    return this.map.has(key.toLowerCase());
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || 'GET';
    this.headers = new MockHeaders(init.headers);
    this.body = init.body;
    this.bodyUsed = false;
  }

  async json() {
    if (this.bodyUsed) throw new Error('body used');
    this.bodyUsed = true;
    return JSON.parse(this.body || '{}');
  }
}

class MockResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new MockHeaders(options.headers);
  }

  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }
    return this.body;
  }
}

MockResponse.json = (body, options = {}) => {
  const jsonBody = JSON.stringify(body);
  const headers = new MockHeaders({ 'Content-Type': 'application/json' });
  return new MockResponse(jsonBody, { ...options, headers });
};

jest.mock('next/server', () => ({
  NextRequest: MockRequest,
  NextResponse: MockResponse,
}));

describe('Routines API Route', () => {
  let GET;
  let POST;

  beforeAll(async () => {
    jest.resetModules();
    const routeModule = await import('../route');
    GET = routeModule.GET;
    POST = routeModule.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.routine.findMany.mockResolvedValue([]);
    mockPrisma.routine.create.mockResolvedValue({
      id: '1',
      name: 'Test',
      scheduledTime: '06:00',
      repeatDays: null,
      userId: 'user1',
      tasks: [],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET', () => {
    it('returns empty array for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const req = new MockRequest('http://localhost', { method: 'GET' });
      const res = await GET(req);
      expect(mockGetServerSession).toHaveBeenCalledWith(mockAuthOptions);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });

    it('returns user routines for authenticated user', async () => {
      const routines = [
        {
          id: '1',
          userId: 'user1',
          name: 'test',
          scheduledTime: '06:00',
          repeatDays:
            'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY',
          tasks: [],
        },
      ];
      mockPrisma.routine.findMany.mockResolvedValue(routines);
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', { method: 'GET' });
      const res = await GET(req);
      expect(mockGetServerSession).toHaveBeenCalledWith(mockAuthOptions);
      expect(mockPrisma.routine.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user1',
            repeatDays: { contains: expect.stringContaining('MONDAY') },
          },
          include: { tasks: true },
          orderBy: { scheduledTime: 'asc' },
        })
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(routines);
    });

    it('handles server error', async () => {
      const error = new Error('db error');
      mockPrisma.routine.findMany.mockRejectedValue(error);
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', { method: 'GET' });
      const res = await GET(req);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST', () => {
    it('returns empty array for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          scheduledTime: '06:00',
          tasks: [{ name: 't', duration: 1 }],
        }),
      });
      const res = await POST(req);
      expect(mockGetServerSession).toHaveBeenCalledWith(mockAuthOptions);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });

    it('creates routine with valid data for authenticated user', async () => {
      const data = {
        name: 'Morning',
        scheduledTime: '06:00',
        repeatDays: null,
        tasks: [{ name: 'wake', duration: 30 }],
      };
      const expectedRoutine = {
        id: '1',
        name: 'Morning',
        scheduledTime: '06:00',
        repeatDays: null,
        userId: 'user1',
        tasks: [{ name: 'wake', duration: 30, order: 0 }],
      };
      mockPrisma.routine.create.mockResolvedValueOnce(expectedRoutine);
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const res = await POST(req);
      expect(mockGetServerSession).toHaveBeenCalledWith(mockAuthOptions);
      expect(mockPrisma.routine.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Morning',
          scheduledTime: '06:00',
          repeatDays: null,
          userId: 'user1',
          tasks: { create: [{ name: 'wake', duration: 30, order: 0 }] },
        }),
        include: { tasks: true },
      });
      expect(res.status).toBe(201);
      expect((await res.json()).routine.name).toBe('Morning');
    });

    it('returns 400 for missing routine name', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          scheduledTime: '06:00',
          tasks: [{ name: 't', duration: 1 }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Routine name is required' });
    });

    it('returns 400 for missing scheduled time', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          tasks: [{ name: 't', duration: 1 }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Scheduled time is required' });
    });

    it('returns 400 for no tasks', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          scheduledTime: '06:00',
          tasks: [],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: 'At least one task is required',
      });
    });

    it('returns 400 for invalid task name', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          scheduledTime: '06:00',
          tasks: [{ name: '', duration: 1 }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Task name is required' });
    });

    it('returns 400 for invalid task duration', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          scheduledTime: '06:00',
          tasks: [{ name: 't', duration: 0 }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: 'Task duration must be positive number',
      });
    });

    it('handles server error', async () => {
      const error = new Error('db error');
      mockPrisma.routine.create.mockRejectedValue(error);
      mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
      const req = new MockRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          scheduledTime: '06:00',
          tasks: [{ name: 't', duration: 1 }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal server error' });
    });
  });
});
