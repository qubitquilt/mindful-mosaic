import '@testing-library/jest-dom';

// Polyfill for fetch in jsdom to fix NextAuth compatibility in tests (pure JS, no deps)
if (typeof fetch === 'undefined') {
  if (typeof Headers === 'undefined') {
    class BasicHeaders {
      constructor(init = {}) {
        this._headers = {};
        if (init && typeof init === 'object') {
          for (const [key, value] of Object.entries(init)) {
            this._headers[key.toLowerCase()] = value;
          }
        }
      }

      get(name) {
        return this._headers[name.toLowerCase()] || null;
      }

      set(name, value) {
        this._headers[name.toLowerCase()] = value;
      }

      has(name) {
        return name.toLowerCase() in this._headers;
      }
    }

    (globalThis as any).Headers = BasicHeaders;
  }

  if (typeof Response === 'undefined') {
    class BasicResponse {
      constructor(body: any, init: ResponseInit = {}) {

        this.body = body;
        this.status = init.status || 200;
        this.statusText = init.statusText || 'OK';
        this.headers = new Headers(init.headers || {});
        this.ok = this.status >= 200 && this.status < 300;
        this.type = 'basic';
      }

      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }

      async text() {
        return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
      }

      clone() {
        return new BasicResponse(this.body, { status: this.status, headers: this.headers });
      }
    }

    (globalThis as any).Response = BasicResponse;
  }

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


jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(() => ({
    createUser: jest.fn().mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUser: jest.fn().mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUserByEmail: jest.fn().mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    getUserByAccount: jest.fn().mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    updateUser: jest.fn().mockResolvedValue({ id: 'user1', email: 'test@example.com' }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    linkAccount: jest.fn().mockResolvedValue({ id: 'account1' }),
    unlinkAccount: jest.fn().mockResolvedValue(undefined),
    createSession: jest.fn().mockResolvedValue({ id: 'session1' }),
    getSessionAndUser: jest.fn().mockResolvedValue({ session: { id: 'session1' }, user: { id: 'user1' } }),
    updateSession: jest.fn().mockResolvedValue({ id: 'session1' }),
    deleteSession: jest.fn().mockResolvedValue(undefined),
    createVerificationToken: jest.fn().mockResolvedValue({ id: 'token1' }),
    useVerificationToken: jest.fn().mockResolvedValue({ id: 'token1' }),
    deleteVerificationToken: jest.fn().mockResolvedValue(undefined),
  })),
}));


