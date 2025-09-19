import { TextEncoder, TextDecoder } from 'util';

// Assign to globals with casts to any to satisfy TypeScript's stricter DOM typings
/* eslint-disable @typescript-eslint/no-explicit-any */
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// Minimal polyfills for Node environment used in tests/build
/* eslint-disable @typescript-eslint/no-explicit-any */

// Expose TextEncoder/TextDecoder from util (only once)
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Minimal Request/Response/fetch shims for Jest environment so tests can spyOn and
// next/server's spec-extension doesn't throw ReferenceError when importing.
if (typeof (global as any).Request === 'undefined') {
  // Basic Request shim: tests only need the constructor to exist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).Request = class Request {
    constructor() {
      // Request shim: constructor exists so imports referencing Request won't throw
    }
  };
}

// Minimal Headers shim to support Next.js spec-extension usage in tests (getSetCookie etc.)
if (typeof (global as any).Headers === 'undefined') {
  (global as any).Headers = class Headers {
    private map: Map<string, string[]>;
    constructor(init?: Record<string, any>) {
      this.map = new Map();
      if (init && typeof init === 'object') {
        for (const key of Object.keys(init)) {
          const value = (init as any)[key];
          if (Array.isArray(value))
            this.map.set(key.toLowerCase(), value.map(String));
          else this.map.set(key.toLowerCase(), [String(value)]);
        }
      }
    }
    get(name: string) {
      const v = this.map.get(name.toLowerCase());
      return v ? v.join(',') : null;
    }
    set(name: string, value: string) {
      this.map.set(name.toLowerCase(), [String(value)]);
    }
    append(name: string, value: string) {
      const key = name.toLowerCase();
      const cur = this.map.get(key) || [];
      cur.push(String(value));
      this.map.set(key, cur);
    }
    // Next.js edge runtime expects getSetCookie to be present on Headers
    getSetCookie() {
      return this.map.get('set-cookie') || [];
    }
    // iterator helpers used by some libs
    entries() {
      return this.map.entries();
    }
  };
}

// If the environment already provides Headers (Node 18+), ensure it has getSetCookie
if (
  typeof (global as any).Headers !== 'undefined' &&
  typeof (global as any).Headers.prototype.getSetCookie === 'undefined'
) {
  (global as any).Headers.prototype.getSetCookie = function getSetCookie() {
    const v = (this as any).get('set-cookie');
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };
}

if (typeof (global as any).Response === 'undefined') {
  // Basic Response shim with json() helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).Response = class Response {
    status: number | undefined;
    body: any;
    ok: boolean;
    headers: any;
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status;
      // Ensure headers object exists and supports Next.js expectations
      this.headers = new (global as any).Headers(init?.headers || {});
      this.ok =
        this.status === undefined || (this.status >= 200 && this.status < 400);
    }
    async json() {
      return this.body;
    }
    // static json to match WHATWG/Next.js helper used in tests
    static json(body?: any, init?: any) {
      return new (global as any).Response(body, init);
    }
  };
}
if (typeof (global as any).fetch === 'undefined') {
  // Provide a no-op fetch so jest.spyOn(global, 'fetch') works in tests. Tests mock the
  // implementation as needed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).fetch = async () =>
    ({ ok: true, json: async () => ({}) }) as any;
}

// Note: Request/Response/fetch full mocks were intentionally avoided to reduce
// lint/noise during builds. These minimal shims are used only in the test environment.
