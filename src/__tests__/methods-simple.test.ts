import { createSupabaseClient } from '../client/index'
import type { AuthTokenResponse, SupabaseClient } from '../types'
import { SupabaseError } from '../types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

const mockFetch = (
  implementation: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>
) => {
  vi.stubGlobal('fetch', vi.fn(implementation))
}

const getRequestUrl = (input: RequestInfo | URL) => {
  if (typeof input === 'string') {
    return input
  }

  if (input instanceof URL) {
    return input.toString()
  }

  return input.url
}

describe('SupabaseClient Methods', () => {
  let client: SupabaseClient
  const baseUrl = 'https://example.supabase.co'
  const apiKey = 'test_api_key'
  const token = 'test_token'

  const mockAuthResponse: AuthTokenResponse = {
    access_token: 'access_token_value',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'refresh_token_value'
  }

  beforeEach(() => {
    client = createSupabaseClient({ baseUrl, apiKey, token })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('Authentication Methods', () => {
    describe('signUp', () => {
      it('should return a signup session response', async () => {
        const mockResponse = {
          access_token: 'signup_access_token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'signup_refresh_token',
          user: { id: 'new-user', email: 'test@example.com' }
        }

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const email = 'test@example.com'
        const password = 'password123'
        const result = await client.signUp(email, password)

        expect(result).toEqual(mockResponse)
      })

      it('should return a signup confirmation response without a session', async () => {
        const mockResponse = { id: 'new-user', email: 'test@example.com' }

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const result = await client.signUp('test@example.com', 'password123')

        expect(result).toEqual(mockResponse)
      })

      it('should send signup metadata, captcha token, and redirect URL', async () => {
        const mockResponse = { id: 'new-user', email: 'test@example.com' }

        mockFetch((input: RequestInfo | URL, init?: RequestInit) => {
          const url = new URL(getRequestUrl(input))
          expect(typeof init?.body).toBe('string')
          const body = JSON.parse(init?.body as string)

          expect(url.pathname).toBe('/auth/v1/signup')
          expect(url.searchParams.get('redirect_to')).toBe(
            'https://app.example.com/auth/callback'
          )
          expect(body).toEqual({
            email: 'test@example.com',
            password: 'password123',
            data: { name: 'Test User' },
            gotrue_meta_security: { captcha_token: 'captcha-token' },
            code_challenge: null,
            code_challenge_method: null
          })

          return Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        })

        const result = await client.signUp('test@example.com', 'password123', {
          data: { name: 'Test User' },
          captchaToken: 'captcha-token',
          redirectTo: 'https://app.example.com/auth/callback'
        })

        expect(result).toEqual(mockResponse)
      })

      it('should include status and parsed response in signup errors', async () => {
        const responseBody = {
          code: 'over_email_send_rate_limit',
          msg: 'Email rate limit exceeded'
        }

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(responseBody), {
              status: 429,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        try {
          await client.signUp('test@example.com', 'password123')
          throw new Error('Expected signUp to throw')
        } catch (error) {
          expect(error).toBeInstanceOf(SupabaseError)
          expect((error as SupabaseError).statusCode).toBe(429)
          expect((error as SupabaseError).response).toEqual(responseBody)
          expect((error as Error).message).toContain(
            'Email rate limit exceeded'
          )
        }
      })
    })

    describe('signIn', () => {
      it('should sign in a user successfully', async () => {
        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockAuthResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const email = 'test@example.com'
        const password = 'password123'
        const result = await client.signIn(email, password)

        expect(result).toEqual(mockAuthResponse)
      })
    })

    describe('getUser', () => {
      it('should get user successfully', async () => {
        const mockResponse = { user: 'me' }

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const result = await client.getUser()
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('HTTP Methods', () => {
    describe('get', () => {
      it('should perform GET request successfully', async () => {
        const mockResponse = [{ id: 1, name: 'Test' }]

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const result = await client.get('users')
        expect(result).toEqual(mockResponse)
      })

      it('should perform GET request with query parameters', async () => {
        const mockResponse = [{ id: 1, name: 'Test' }]

        mockFetch((input: RequestInfo | URL, _init?: RequestInit) => {
          const url = getRequestUrl(input)
          expect(url).toContain('id=1')
          return Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        })

        const queryParams = { id: '1' }
        const result = await client.get('users', queryParams)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('post', () => {
      it('should perform POST request successfully', async () => {
        const mockResponse = { id: 2, name: 'New User' }

        mockFetch(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 201,
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )

        const data = { name: 'New User' }
        const result = await client.post('users', data)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('delete', () => {
      it('should perform DELETE request successfully', async () => {
        mockFetch(() => Promise.resolve(new Response(null, { status: 204 })))

        const result = await client.delete('users', 'id', '1')
        expect(result).toEqual({})
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      mockFetch(() =>
        Promise.resolve(new Response('Bad Request', { status: 400 }))
      )

      await expect(client.get('users')).rejects.toThrow('Request failed')
    })

    it('should handle network errors', async () => {
      mockFetch(() => Promise.reject(new Error('Network error')))

      await expect(client.get('users')).rejects.toThrow('Network error')
    })
  })
})
