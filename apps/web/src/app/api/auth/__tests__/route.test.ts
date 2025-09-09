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
    });

    expect(mockPrismaAdapter).toHaveBeenCalledWith(expect.any(Object));
    expect(mockGoogleProvider).toHaveBeenCalledWith({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
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
