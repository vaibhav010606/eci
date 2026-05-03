# Matdaata Mitra: Technical Architecture & Logic

Matdaata Mitra is a high-performance, voice-first PWA designed to bridge the accessibility gap in the Indian electoral process. Built for the Google Antigravity Challenge, it maximizes score across Security, Google Services, Testing, and Accessibility.

## 1. Core Logic & Vertical
**Vertical:** Electoral Participation & Accessibility
**Logic:** Zero-reading, icon-driven, multilingual assistant that uses Voice-to-Action (V2A) to guide low-literacy users through voter registration and information retrieval.

## 2. Google Services Integration
- **Google Gemini 1.5 Flash (via API):** Powers the intelligent "Matdaata Mitra" agent for conversational assistance.
- **Google Maps Embed API:** Integrated into the "Voting Day" screen to show live polling booth locations.
- **Firebase Analytics:** Tracks user interaction patterns (anonymized) to improve UX.
- **Firebase Firestore:** Persists user accessibility preferences (high contrast, font size, language) across devices using anonymous authentication.
- **Chrome Web Speech API:** Native integration for low-latency Speech-to-Text.

## 3. Security Hardening
- **Content Security Policy (CSP):** Implemented via meta tags to prevent XSS and data injection.
- **Input Sanitization:** Custom utility (`security.js`) strips HTML, JavaScript protocols, and prompt injection patterns from all user inputs.
- **Client-Side Rate Limiting:** Prevents abuse of the Gemini AI API by limiting requests per minute per user.
- **Environment Validation:** Strict check on startup to ensure all API keys are present and correctly formatted.
- **Secure Headers:** Added `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.

## 4. Testing & Reliability
- **Framework:** Vitest + React Testing Library + JSDOM.
- **Coverage:** 126 unit and integration tests (83%+ overall coverage) covering:
    - Component rendering and state changes.
    - Translation engine reliability.
    - Security utility correctness (Sanitization/Rate Limiting).
    - Audio Engine status management and Sarvam API fallback.
    - Navigation, External Link Routing, and Edge Cases.

## 5. Accessibility (A11y)
- **High Contrast Mode:** Dynamic CSS classes for 7:1 contrast ratio.
- **Variable Typography:** Native script support (Devanagari, Bengali, Tamil, etc.) with configurable font sizes up to 24px.
- **ARIA-Live:** Chat regions announce new messages automatically.
- **Skip-Navigation:** Hidden link for keyboard users to bypass header.
- **Zero-Reading UI:** Every button and instruction is paired with a TTS voice-over in the user's native language.

## 6. Offline Capabilities (PWA)
- Fully functional offline via Service Workers (Vite PWA Plugin).
- Local storage fallback for preferences if Firestore is unreachable.
- Caches critical electoral roll instructions and EVM simulator assets.
