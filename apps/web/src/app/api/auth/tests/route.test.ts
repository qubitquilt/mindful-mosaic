import { describe, it, expect, beforeEach } from '@jest/globals';
// route implementation for NextAuth is located in [...nextauth]/route.ts
import { GET, POST } from '../[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@mindful-mosaic/db';

jest.mock('next-auth/next');
jest.mock('@mindful-mosaic/db');
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const MockedPrismaClient = PrismaClient as jest.MockedClass<
  typeof PrismaClient
>;

describe('Auth API Route', () => {
  let prisma: any;
  let req: any;
  let response: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      $disconnect: jest.fn(),
      // Add other Prisma methods as needed
    };
    MockedPrismaClient.mockImplementation(() => prisma);
    req = { method: 'GET' };
  });

  it('should handle GET request', async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: '1' } });

    response = await GET(req);

    expect(response.status).toBe(200);
  });

  it('should handle POST request', async () => {
    req.method = 'POST';
    req.body = JSON.stringify({ provider: 'credentials' });

    response = await POST(req);

    expect(response.status).toBe(200);
  });
});
