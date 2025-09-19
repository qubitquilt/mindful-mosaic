// Manual mock for next-auth/next used in server handlers
const getServerSession = jest.fn();

module.exports = { getServerSession };
