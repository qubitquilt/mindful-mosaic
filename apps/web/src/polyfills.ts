import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

global.Request = class Request {
  constructor(input = '', init = {}) {
    this.method = init.method || 'GET';
    this.url = typeof input === 'string' ? input : input.url || '';
    this.headers = new Headers(init.headers || {});
    this.body = init.body || null;
    this.json = async () => (this.body ? JSON.parse(this.body) : {});
  }
};

global.Response = class Response {
  constructor(body = null, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.headers = new Headers(init.headers || {});
    this.json = () => Promise.resolve(body);
  }
};

globalThis.fetch = jest.fn(() =>
  Promise.resolve(new Response(null, { status: 200 }))
);
