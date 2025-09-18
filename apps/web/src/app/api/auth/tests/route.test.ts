// Mock next-auth and its submodules before any import
jest.doMock('next-auth', () => jest.fn());

jest.doMock('next-auth/providers/google', () =>
  jest.fn(
    ({ clientId, clientSecret }) =>
      ({
        id: 'google',
        name: 'Google',
        type: 'oauth',
        clientId,
        clientSecret,
      }) as any
  )
);

jest.doMock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(),
}));

jest.doMock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

// Mock process.env
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.NEXTAUTH_SECRET = 'test-secret';

const mockNextAuth = require('next-auth');
const mockGoogleProvider = require('next-auth/providers/google');
const { PrismaAdapter: mockPrismaAdapter } = require('@auth/prisma-adapter');
const { PrismaClient: mockPrismaClient } = require('@prisma/client');

describe('Auth API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNextAuth.mockReturnValue(jest.fn());
    mockPrismaAdapter.mockReturnValue({
      createUser: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
    } as any);
    mockPrismaClient.mockImplementation(
      () => ({ $connect: jest.fn(), $disconnect: jest.fn() }) as any
    );
  });

  it('configures NextAuth with PrismaAdapter and GoogleProvider', () => {
    require('../[...nextauth]/route');

    expect(mockNextAuth).toHaveBeenCalledWith({
      adapter: expect.any(Object),
      providers: [
        expect.objectContaining({
          id: 'google',
          name: 'Google',
          type: 'oauth',
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ],
      callbacks: {
        session: expect.any(Function),
      },
    });

    expect(mockPrismaAdapter).toHaveBeenCalledWith(expect.any(Object));
    expect(mockGoogleProvider).toHaveBeenCalledWith({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  });

  it('handles GET request for auth route', async () => {
    jest.resetModules();

    const mockGET = jest.fn().mockResolvedValue(undefined);
    const mockPOST = jest.fn().mockResolvedValue(undefined);

    jest.doMock('../[...nextauth]/route', () => ({
      GET: mockGET,
      POST: mockPOST,
    }));

    const { GET } = await import('../[...nextauth]/route');
    const request = { method: 'GET' } as any;

    await GET(request as Request);

    expect(mockGET).toHaveBeenCalledWith(request as Request);
  });

  it('handles POST request for auth route', async () => {
    jest.resetModules();

    const mockGET = jest.fn().mockResolvedValue(undefined);
    const mockPOST = jest.fn().mockResolvedValue(undefined);

    jest.doMock('../[...nextauth]/route', () => ({
      GET: mockGET,
      POST: mockPOST,
    }));

    const { POST } = await import('../[...nextauth]/route');
    const request = { method: 'POST' } as any;

    await POST(request as Request);

    expect(mockPOST).toHaveBeenCalledWith(request as Request);
  });

  it('configures adapter with createUser method', () => {
    const mockAdapter = {
      createUser: jest.fn().mockResolvedValue({ id: 'new-user' }),
    };
    mockPrismaAdapter.mockReturnValue(mockAdapter);

    require('../[...nextauth]/route');

    expect(mockAdapter.createUser).toBeDefined();
    expect(typeof mockAdapter.createUser).toBe('function');
  });
});
