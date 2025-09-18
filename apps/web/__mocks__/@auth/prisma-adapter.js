const mockPrismaAdapter = jest.fn(() => ({
  createUser: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }),
  getUser: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }),
  getUserByEmail: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }),
  getUserByAccount: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }),
  updateUser: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }),
  deleteUser: jest.fn().mockResolvedValue(undefined),
  linkAccount: jest.fn().mockResolvedValue({ id: 'mock-account-id', userId: 'mock-user-id', provider: 'google', providerAccountId: 'mock-provider-id' }),
  unlinkAccount: jest.fn().mockResolvedValue(undefined),
  createSession: jest.fn().mockResolvedValue({ id: 'mock-session-id', sessionToken: 'mock-session-token', userId: 'mock-user-id', expires: new Date(Date.now() + 86400000) }),
  getSessionAndUser: jest.fn().mockResolvedValue({
    session: { id: 'mock-session-id', sessionToken: 'mock-session-token', userId: 'mock-user-id', expires: new Date(Date.now() + 86400000) },
    user: { id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User' }
  }),
  updateSession: jest.fn().mockResolvedValue({ id: 'mock-session-id', sessionToken: 'mock-session-token', userId: 'mock-user-id', expires: new Date(Date.now() + 86400000) }),
  deleteSession: jest.fn().mockResolvedValue(undefined),
  createVerificationToken: jest.fn().mockResolvedValue({ id: 'mock-token-id', identifier: 'mock-identifier', token: 'mock-token', expires: new Date() }),
  useVerificationToken: jest.fn().mockResolvedValue({ id: 'mock-token-id', identifier: 'mock-identifier', token: 'mock-token', expires: new Date() }),
  deleteVerificationToken: jest.fn().mockResolvedValue(undefined),
}));

module.exports = { PrismaAdapter: mockPrismaAdapter };
