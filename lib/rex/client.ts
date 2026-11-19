// Minimal typed client for the Rex (rexsoftware) real-estate REST API.
//
// This is deliberately thin: it knows how to authenticate, how to attach a
// bearer token to a request, and how to hit the one search endpoint we care
// about right now (PublishedListings). It makes NO assumptions about the
// shape of the data Rex returns, responses are typed as `unknown` by default
// so callers are forced to look at the real payload before mapping anything.
// (See scripts/rex-dry-run.ts, which exists purely to print that raw shape.)
//
// Credentials are NEVER hardcoded here. The base URL may come from the
// REX_API_BASE env var; email/password are passed in by the caller, which is
// expected to read them from an uncommitted .env (see .env.example).

const DEFAULT_BASE_URL = 'https://api.uk.rexsoftware.com'

/** Resolve the Rex API base URL from env, falling back to the UK cluster. */
export function getRexBaseUrl(): string {
  return (process.env.REX_API_BASE || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

export interface RexClientOptions {
  /** Override the base URL. Defaults to REX_API_BASE, then the UK cluster. */
  baseUrl?: string
  /** Pre-seed a token (e.g. a cached one) so you can skip login(). */
  token?: string | null
}

export interface RexRequestOptions {
  /**
   * Whether to attach `Authorization: Bearer <token>`. Defaults to true.
   * login() sets this to false since there's no token yet.
   */
  authenticated?: boolean
}

/** Thrown when Rex responds with a non-2xx status. Carries the raw body. */
export class RexApiError extends Error {
  readonly status: number
  readonly body: string
  constructor(message: string, status: number, body: string) {
    super(message)
    this.name = 'RexApiError'
    this.status = status
    this.body = body
  }
}

export class RexClient {
  readonly baseUrl: string
  token: string | null

  constructor(options: RexClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? getRexBaseUrl()).replace(/\/+$/, '')
    this.token = options.token ?? null
  }

  /**
   * POST JSON to a Rex endpoint. Every Rex call in practice is a POST with a
   * JSON body, so this is the single low-level primitive the rest build on.
   * Returns the parsed JSON (or null for an empty body). Throws RexApiError on
   * a non-2xx response so callers can inspect status + raw body.
   */
  async request<T = unknown>(
    path: string,
    body: unknown = {},
    { authenticated = true }: RexRequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (authenticated) {
      if (!this.token) {
        throw new Error('RexClient: not authenticated, call login() first')
      }
      headers.Authorization = `Bearer ${this.token}`
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const text = await res.text()
    if (!res.ok) {
      throw new RexApiError(
        `Rex API ${path} failed: ${res.status} ${res.statusText}`,
        res.status,
        text,
      )
    }
    return (text ? JSON.parse(text) : null) as T
  }

  /**
   * Authenticate and cache the returned token on this client instance.
   * POST /v1/rex/Authentication/login. Rex returns the token as the `result`
   * of the response body; we read it defensively (also accepting `token`) and
   * throw with the raw body if neither is present.
   */
  async login(email: string, password: string): Promise<string> {
    const data = await this.request<{ result?: unknown; token?: unknown }>(
      '/v1/rex/Authentication/login',
      { email, password },
      { authenticated: false },
    )

    const token =
      typeof data?.result === 'string'
        ? data.result
        : typeof data?.token === 'string'
          ? data.token
          : null

    if (!token) {
      throw new Error(
        `RexClient.login: no token found in response: ${JSON.stringify(data)}`,
      )
    }
    this.token = token
    return token
  }

  /**
   * Search published listings. POST /v1/rex/PublishedListings/search.
   * `criteria` is the raw request body passed straight through to Rex (e.g.
   * `{ limit: 5 }`, or `{ criteria: [...], order_by: {...} }`). Typed as
   * `unknown` by default, inspect the real response before mapping fields.
   */
  async searchPublishedListings<T = unknown>(
    criteria: Record<string, unknown> = {},
  ): Promise<T> {
    return this.request<T>('/v1/rex/PublishedListings/search', criteria)
  }
}

/** Convenience factory mirroring `new RexClient(options)`. */
export function createRexClient(options: RexClientOptions = {}): RexClient {
  return new RexClient(options)
}
