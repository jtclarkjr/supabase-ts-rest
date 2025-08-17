import { createSupabaseClient, SupabaseClient } from '../client/index'
import { AuthTokenResponse } from '../types'
import { describe, expect, it, beforeEach } from 'bun:test'

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

  describe('Authentication Methods', () => {
    describe('signUp', () => {
      it('should sign up a user successfully', async () => {
        const mockResponse = { id: 'new-user' }

        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () =>
            Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              })
            ),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const email = 'test@example.com'
        const password = 'password123'
        const result = await client.signUp(email, password)

        expect(result).toEqual(mockResponse)
      })
    })

    describe('signIn', () => {
      it('should sign in a user successfully', async () => {
        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () =>
            Promise.resolve(
              new Response(JSON.stringify(mockAuthResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              })
            ),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const email = 'test@example.com'
        const password = 'password123'
        const result = await client.signIn(email, password)

        expect(result).toEqual(mockAuthResponse)
      })
    })

    describe('getUser', () => {
      it('should get user successfully', async () => {
        const mockResponse = { user: 'me' }

        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () =>
            Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              })
            ),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const result = await client.getUser()
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('HTTP Methods', () => {
    describe('get', () => {
      it('should perform GET request successfully', async () => {
        const mockResponse = [{ id: 1, name: 'Test' }]

        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () =>
            Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              })
            ),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const result = await client.get('users')
        expect(result).toEqual(mockResponse)
      })

      it('should perform GET request with query parameters', async () => {
        const mockResponse = [{ id: 1, name: 'Test' }]

        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          (input: RequestInfo | URL, _init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input.toString()
            expect(url).toContain('id=1')
            return Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              })
            )
          },
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const queryParams = { id: '1' }
        const result = await client.get('users', queryParams)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('post', () => {
      it('should perform POST request successfully', async () => {
        const mockResponse = { id: 2, name: 'New User' }

        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () =>
            Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
              })
            ),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const data = { name: 'New User' }
        const result = await client.post('users', data)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('delete', () => {
      it('should perform DELETE request successfully', async () => {
        // Mock fetch for this test (Bun compatibility)
        const fetchMock = Object.assign(
          () => Promise.resolve(new Response('', { status: 204 })),
          { preconnect: () => Promise.resolve() }
        )
        globalThis.fetch = fetchMock

        const result = await client.delete('users', 'id', '1')
        expect(result).toEqual({})
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      // Mock fetch for this test (Bun compatibility)
      const fetchMock = Object.assign(
        () => Promise.resolve(new Response('Bad Request', { status: 400 })),
        { preconnect: () => Promise.resolve() }
      )
      globalThis.fetch = fetchMock

      await expect(client.get('users')).rejects.toThrow('Request failed')
    })

    it('should handle network errors', async () => {
      // Mock fetch for this test (Bun compatibility)
      const fetchMock = Object.assign(
        () => Promise.reject(new Error('Network error')),
        { preconnect: () => Promise.resolve() }
      )
      globalThis.fetch = fetchMock

      expect(client.get('users')).rejects.toThrow('Network error')
    })
  })
})
