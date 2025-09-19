// Jest mock for @prisma/client
const mockDisconnect = jest.fn();
const mockPrisma = {
  $disconnect: mockDisconnect,
};

module.exports = {
  PrismaClient: jest.fn(() => mockPrisma),
};
