// Manual mock for @mindful-mosaic/db
const mockDisconnect = jest.fn();
const mockPrisma = {
  $disconnect: mockDisconnect,
};

module.exports = {
  PrismaClient: jest.fn(() => mockPrisma),
};
