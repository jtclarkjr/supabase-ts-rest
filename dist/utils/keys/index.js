/**
 * Detects the format of a Supabase API key by its prefix.
 *
 * Useful for guarding server-only code paths (never ship a `secret` key
 * to the browser) or for logging and telemetry.
 *
 * @param apiKey - The Supabase API key to inspect.
 * @returns `'publishable'`, `'secret'`, or `'legacy'`.
 *
 * @example
 * ```typescript
 * detectKeyType('sb_publishable_abc123') // 'publishable'
 * detectKeyType('sb_secret_xyz789')      // 'secret'
 * detectKeyType('eyJhbGciOi...')         // 'legacy'
 * ```
 */
export function detectKeyType(apiKey) {
    if (apiKey.startsWith('sb_publishable_'))
        return 'publishable';
    if (apiKey.startsWith('sb_secret_'))
        return 'secret';
    return 'legacy';
}
//# sourceMappingURL=index.js.map