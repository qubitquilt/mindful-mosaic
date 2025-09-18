import '@testing-library/jest-dom';

// Polyfill for fetch in jsdom to fix NextAuth compatibility in tests (pure JS, no deps)
if (typeof fetch === 'undefined') {
  class MockResponse extends Response {
    constructor(body: unknown, init: ResponseInit = { status: 200 }) {
      super(JSON.stringify(body), init);
    }
    json() {
      return super.json();
    }
  }

  globalThis.fetch = (input: RequestInfo | URL): Promise<Response> => {
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
