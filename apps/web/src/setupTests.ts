import '@testing-library/jest-dom';

// Mocks for NextAuth and other deps
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(() => ({
    createUser: jest
      .fn()
      .mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUser: jest
      .fn()
      .mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUserByEmail: jest
      .fn()
      .mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUserByAccount: jest
      .fn()
      .mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    updateUser: jest
      .fn()
      .mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    linkAccount: jest.fn().mockResolvedValue({ id: 'account1' }),
    unlinkAccount: jest.fn().mockResolvedValue(undefined),
    createSession: jest.fn().mockResolvedValue({ id: 'session1' }),
    getSessionAndUser: jest.fn().mockResolvedValue({
      session: { id: 'session1' },
      user: { id: 'user1' },
    }),
    updateSession: jest.fn().mockResolvedValue({ id: 'session1' }),
    deleteSession: jest.fn().mockResolvedValue(undefined),
    createVerificationToken: jest.fn().mockResolvedValue({ id: 'token1' }),
    useVerificationToken: jest.fn().mockResolvedValue({ id: 'token1' }),
    deleteVerificationToken: jest.fn().mockResolvedValue(undefined),
  })),
}));
