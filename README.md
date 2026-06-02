# Supabase REST Client

## Overview

Supabase REST Client is a lightweight, flexible TypeScript/Bun client designed
to simplify interactions with Supabase's REST API, providing a seamless
middleware solution for handling authenticated requests and Row Level Security
(RLS) integrations.

## Features

### Authentication

- User Sign Up
- User Sign In
- Token Refresh
- Magic Link Authentication
- Password Recovery
- User Management

### REST API Methods

- GET
- POST
- PUT
- PATCH
- DELETE

### Advanced Capabilities

- Automatic Bearer token management
- Row Level Security (RLS) support
- Flexible query parameter handling
- TypeScript support with full type definitions
- Error handling for Supabase API interactions

## Installation

```bash
bun add github:jtclarkjr/supabase-ts-rest
```

## Quick Start

### Client Initialization

```typescript
import { createClient } from '@jtclarkjr/supabase-rest-client'
// If you want types:
import type { SupabaseClient } from '@jtclarkjr/supabase-rest-client'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'sb_publishable_your-key-here'
const token = 'optional-user-access-token'

const client = createClient(supabaseUrl, supabaseKey, token)
```

> Legacy JWT-format anon/service_role keys still work with no code changes —
> just pass them as `supabaseKey` the same way.

## API Keys

This client accepts any Supabase API key format. Pick the one that matches where
your code runs:

| Key format            | Where it runs            | Replaces                  |
| --------------------- | ------------------------ | ------------------------- |
| `sb_publishable_...`  | Browser / client-side    | Legacy `anon` key         |
| `sb_secret_...`       | Server only              | Legacy `service_role` key |
| Legacy JWT (`eyJ...`) | Either (still supported) | —                         |

**Never ship a `sb_secret_...` key to the browser** — it bypasses Row Level
Security. Use the publishable key in client code and keep the secret key in
server-side environments only.

If you need to check a key's format programmatically (e.g., to guard a
server-only code path), use the `detectKeyType` helper:

```typescript
import { detectKeyType } from '@jtclarkjr/supabase-rest-client'

detectKeyType('sb_publishable_abc123') // 'publishable'
detectKeyType('sb_secret_xyz789') // 'secret'
detectKeyType('eyJhbGciOi...') // 'legacy'
```

## Authentication Methods

### Sign Up

```typescript
const result = await client.signUp('user@example.com', 'password123', {
  data: { name: 'User Name' },
  captchaToken: 'optional-captcha-token',
  redirectTo: 'https://app.example.com/auth/callback'
})
console.log(result)
```

### Sign In

```typescript
const authResponse = await client.signIn('user@example.com', 'password123')
console.log(authResponse.access_token)

// Update client token for authenticated requests
client.setToken(authResponse.access_token)
```

### Token Refresh

```typescript
const refreshedAuth = await client.refreshToken('your-refresh-token')
client.setToken(refreshedAuth.access_token)
```

### Magic Link

```typescript
const result = await client.sendMagicLink('user@example.com')
console.log(result)
```

### Password Recovery

```typescript
const result = await client.sendPasswordRecovery('user@example.com')
console.log(result)
```

### Verify OTP

```typescript
const result = await client.verifyOTP('user@example.com', '123456', 'signup')
console.log(result)
```

### User Management

```typescript
// Get current user
const user = await client.getUser()

// Update user
const updatedUser = await client.updateUser({
  email: 'newemail@example.com'
})

// Sign out
await client.signOut()
```

## REST API Operations

### GET Request

```typescript
// Simple GET
const users = await client.get('users')

// GET with query parameters
const filteredUsers = await client.get('users', {
  status: 'active'
})
```

### POST Request

```typescript
const newUser = await client.post('users', {
  name: 'John Doe',
  email: 'john@example.com'
})
```

### PUT Request

```typescript
const updatedUser = await client.put('users', 'id', '123', {
  name: 'Jane Doe',
  email: 'jane@example.com'
})
```

### PATCH Request

```typescript
const patchedUser = await client.patch(
  'users',
  { id: '123' },
  {
    status: 'inactive'
  }
)
```

### DELETE Request

```typescript
const result = await client.delete('users', 'id', '123')
```

## Advanced Usage

### Token Management

```typescript
// Set token after authentication
client.setToken('your-jwt-token')

// Get current token
const currentToken = client.getToken()

// Clear token
client.setToken('')
```

### Error Handling

```typescript
import { SupabaseError } from '@jtclarkjr/supabase-rest-client'

try {
  const result = await client.get('users')
} catch (error) {
  if (error instanceof SupabaseError) {
    console.error('Supabase Error:', error.message)
    console.error('Status Code:', error.statusCode)
    console.error('Response:', error.response)
  } else {
    console.error('Unknown Error:', error)
  }
}
```

### Row Level Security (RLS)

```typescript
// Authenticate user first
const authResponse = await client.signIn('user@example.com', 'password')
client.setToken(authResponse.access_token)

// Now all requests will include the user's JWT token
// RLS policies will be automatically applied
const userSpecificData = await client.get('user_profiles')
```

## API Reference

### Client Configuration

```typescript
interface ClientConfig {
  baseUrl: string // Your Supabase project URL
  apiKey: string // sb_publishable_..., sb_secret_..., or a legacy anon/service_role key
  token?: string // Optional JWT token for authenticated requests
}
```

### Authentication Response

```typescript
interface AuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}
```

### Query Parameters

Query parameters are automatically formatted for Supabase compatibility using
the `eq.` operator:

```typescript
// This query
await client.get('users', { status: 'active', role: 'admin' })

// Becomes
// GET /rest/v1/users?status=eq.active&role=eq.admin
```

## Security Considerations

1. **API Key**: Use a publishable key (`sb_publishable_...`) or a legacy anon
   key for client-side applications. Secret keys (`sb_secret_...`) and legacy
   service_role keys bypass Row Level Security and must never ship to the
   browser — keep them in server-side environments only.
2. **JWT Tokens**: Store JWT tokens securely and refresh them before expiration
3. **RLS**: Always implement Row Level Security policies in your Supabase
   database
4. **Environment Variables**: Store sensitive configuration in environment
   variables (e.g., `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, or the
   legacy `SUPABASE_ANON_KEY`)

## Development

```bash
# Run tests
vp test

# Run tests in watch mode
vp test watch

# Run checks
vp check

# Build the library package
vp pack
```

## TypeScript Support

This package includes full TypeScript definitions. Import types as needed:

```typescript
import type {
  SupabaseClient,
  ClientConfig,
  AuthTokenResponse,
  QueryParams,
  SupabaseError
} from '@jtclarkjr/supabase-ts-rest'
```

## License

MIT
