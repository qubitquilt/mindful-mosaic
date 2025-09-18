import '@testing-library/jest-dom';

class BasicHeaders {
  _headers: Record<string, string>;

  constructor(init: Record<string, string> = {}) {
    this._headers = {};
    if (init && typeof init === 'object') {
      for (const [key, value] of Object.entries(init)) {
        this._headers[key.toLowerCase()] = value;
      }
    }
  }

  get(name: string): string | null {
    return this._headers[name.toLowerCase()] || null;
  }

  set(name: string, value: string): void {
    this._headers[name.toLowerCase()] = value;
  }

  has(name: string): boolean {
    return name.toLowerCase() in this._headers;
  }

  append(name: string, value: string): void {
    const lower = name.toLowerCase();
    const current = this._headers[lower];
    if (current) {
      this._headers[lower] = current + ', ' + value;
    } else {
      this._headers[lower] = value;
    }
  }

  delete(name: string): void {
    delete this._headers[name.toLowerCase()];
  }

  getAll(name: string): string[] {
    const value = this.get(name);
    if (value === null) {
      return [];
    }
    return value
      .split(', ')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }

  forEach(
    callbackfn: (value: string, key: string, parent: BasicHeaders) => void,
    thisArg?: unknown
  ): void {
    Object.entries(this._headers).forEach(([key, value]) => {
      callbackfn.call(thisArg, value, key, this);
    });
  }

  getSetCookie(): string[] {
    return this.getAll('set-cookie');
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return function* (
      this: BasicHeaders
    ): Generator<[string, string], void, unknown> {
      for (const [key, value] of Object.entries(this._headers)) {
        if (Array.isArray(value)) {
          for (const v of value) {
            yield [key, String(v)];
          }
        } else {
          yield [key, String(value)];
        }
      }
    }.call(this);
  }

  entries(): IterableIterator<[string, string]> {
    return this[Symbol.iterator]();
  }

  keys(): IterableIterator<string> {
    return function* (this: BasicHeaders): Generator<string, void, unknown> {
      for (const key in this._headers) {
        yield key;
      }
    }.call(this);
  }

  values(): IterableIterator<string> {
    return function* (this: BasicHeaders): Generator<string, void, unknown> {
      for (const value of Object.values(this._headers)) {
        yield value;
      }
    }.call(this);
  }
}

// Ensure Response and Headers are always defined for jsdom compatibility

if (typeof Headers === 'undefined') {
  // @ts-expect-error: Global Headers type mismatch in jsdom environment
  global.Headers = BasicHeaders;
}

if (typeof Response === 'undefined') {
  interface ResponseInit {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  }
  class BasicResponse {
    body: unknown;
    status: number;
    statusText: string;
    headers: BasicHeaders;
    ok: boolean;
    type: string;

    constructor(body: unknown, init: ResponseInit = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new BasicHeaders(init.headers || {});
      this.ok = this.status >= 200 && this.status < 300;
      this.type = 'basic';
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === 'string'
        ? this.body
        : JSON.stringify(this.body);
    }

    clone() {
      return new BasicResponse(this.body, {
        status: this.status,
        headers: Object.fromEntries(Array.from(this.headers.entries())),
      });
    }

    static error(): BasicResponse {
      return new BasicResponse(null, { status: 0, statusText: 'error' });
    }

    static json(data: unknown, init?: ResponseInit): BasicResponse {
      return new BasicResponse(JSON.stringify(data), init);
    }

    static redirect(url: string | URL, status?: number): BasicResponse {
      const redirectUrl = typeof url === 'string' ? url : url.toString();
      return new BasicResponse(null, {
        status: status || 302,
        headers: { Location: redirectUrl },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.Response = BasicResponse as any;
}

// Polyfill for fetch if not available
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
