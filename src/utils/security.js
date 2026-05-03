/**
 * Security utilities for Matdaata Mitra
 * Provides input sanitization and rate limiting to protect the AI API.
 */

// ── Input Sanitization ──────────────────────────────────────────────────────
// Strip HTML tags, script injection, and prompt injection patterns
const DANGEROUS_PATTERNS = [
  /<[^>]*>/g,                                    // HTML tags
  /javascript:\S*/gi,                            // JS protocol + value
  /on\w+\s*=\s*\S*/gi,                          // Event handlers + value (onclick=doEvil())
  /ignore\s+(all\s+)?previous\s+instructions/gi, // Prompt injection (full phrase)
  /forget\s+(all\s+)?previous\s+instructions/gi, // Prompt injection variant
  /you\s+are\s+now\s+\w+/gi,                    // Role hijacking
  /act\s+as\s+(?!a\s+voting)\w+/gi,             // Persona override (allow "act as a voting assistant")
];

/**
 * Sanitizes user input before sending to the AI model.
 * @param {string} input - Raw user input string
 * @returns {string} - Sanitized, trimmed string (max 500 chars)
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  let clean = input.trim();

  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    clean = clean.replace(pattern, '');
  });

  // Limit input length to prevent token abuse
  if (clean.length > 500) {
    clean = clean.slice(0, 500);
  }

  return clean.trim();
}

// ── Rate Limiter ────────────────────────────────────────────────────────────
// Prevents rapid repeated API calls (max 5 requests per 30 seconds per session)
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 30_000; // 30 seconds

const requestTimestamps = [];

/**
 * Checks if the user is within the allowed request rate.
 * @returns {{ allowed: boolean, waitMs: number }}
 */
export function checkRateLimit() {
  const now = Date.now();

  // Drop timestamps older than the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    const oldestInWindow = requestTimestamps[0];
    const waitMs = RATE_LIMIT_WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, waitMs };
  }

  requestTimestamps.push(now);
  return { allowed: true, waitMs: 0 };
}

// ── Environment Validation ──────────────────────────────────────────────────
/**
 * Validates that required environment variables are present.
 * Logs a warning (never throws) to avoid breaking the app in demo mode.
 */
export function validateEnv() {
  const required = ['VITE_GEMINI_API_KEY', 'VITE_SARVAM_API_KEY'];
  const missing = required.filter(key => !import.meta.env[key] || import.meta.env[key] === 'fallback-key');

  if (missing.length > 0) {
    console.warn(
      `[Matdaata Mitra] Missing environment variables: ${missing.join(', ')}.\n` +
      'Copy .env.example to .env and fill in your API keys.'
    );
  }
}
