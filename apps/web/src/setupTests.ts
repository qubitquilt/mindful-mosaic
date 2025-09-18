import '@testing-library/jest-dom';

// Polyfill for fetch in jsdom to fix NextAuth compatibility in tests (pure JS, no deps)
if (typeof fetch === 'undefined') {
  class MockResponse {
    constructor(
      body: unknown,
      init: { status: number; headers?: Record<string, string> } = {
        status: 200,
      }
    ) {
      this.body = body;
      this.status = init.status;
      this.headers = init.headers || {};
    }
    body: unknown;
    status: number;
    headers: Record<string, string>;
    json() {
      return Promise.resolve(this.body);
    }
  }

  globalThis.fetch = (input: RequestInfo): Promise<MockResponse> => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('/api/auth/session')) {
      return Promise.resolve(
        new MockResponse(
          { session: null },
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );
    }
    return Promise.resolve(new MockResponse({}));
  };
}

// Mock NextAuth to prevent internal fetch calls in useSession for tests
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
