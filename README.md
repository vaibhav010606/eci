# 🗳️ Matdaata Mitra (मतदाता मित्र) — Your AI Voting Assistant

> **Empowering every Indian citizen with a voice-first, zero-reading, and multilingual voting guide.**

Matdaata Mitra is a high-performance Progressive Web App (PWA) designed to eliminate barriers to electoral participation in India. It is specifically engineered for rural, elderly, and low-literacy populations by providing a **zero-reading interface** where every interaction is driven by icons, voice, and intelligent AI assistance.

---

## 🎯 Challenge Vertical: Smart Governance & Civic Education

This project addresses the critical need for accessible civic tools in a diverse democracy. It bridges the gap between complex official government portals and the end-user through a simplified, guided, and highly accessible experience.

### Key Capabilities:
- **Guided Voter Registration**: AI-led walkthroughs for Form 6, 7, and 8.
- **Electoral Search**: Instant confirmation of voter status in the national roll.
- **Polling Booth Discovery**: Interactive Google Maps integration for locating booths.
- **EVM Simulator**: A safe, educational environment to practice using Electronic Voting Machines.
- **Live Election Results**: Real-time data visualization of electoral outcomes.
- **Multilingual Support**: Full localized experience across **22 official Indian languages**.

---

## 🏗️ Technology Stack

### **Core Frontend**
- **React 19**: Modern component-based architecture.
- **Vite 6**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling for responsive and high-contrast UI.
- **Framer Motion**: Smooth, premium micro-animations and transitions.
- **Lucide React**: Clean, consistent iconography for the zero-reading interface.

### **Artificial Intelligence & Speech**
- **Google Gemini 1.5 Flash**: Orchestrates the conversational agent and processes natural language intent.
- **Sarvam AI (Bulbul v3)**: High-quality, natural-sounding Text-to-Speech (TTS) for regional Indian languages.
- **Web Speech API**: Browser-native Speech-to-Text (STT) for low-latency voice commands.

### **Google Cloud & Services**
- **Firebase Firestore**: Secure, cross-device persistence for user accessibility settings.
- **Firebase Analytics**: Anonymized telemetry to monitor feature usage and improve UX.
- **Google Maps Embed API**: Dynamic mapping for polling station locations.
- **Google Fonts (Noto Sans)**: Optimized scripts for Devanagari, Bengali, Tamil, Telugu, and 18+ other Indian scripts.

---

## 🔐 Security & Robustness

We implement a **Defense-in-Depth** strategy to ensure user safety and API integrity:
- **Input Sanitization**: All user inputs (voice and text) are scrubbed of HTML, JavaScript, and prompt-injection patterns via `security.js`.
- **Client-Side Rate Limiting**: Intelligent throttling prevents API abuse and manages quota effectively.
- **Content Security Policy (CSP)**: Hardened headers to prevent XSS and unauthorized data fetching.
- **Environment Validation**: Strict startup checks ensure API keys and configurations are valid before the app initializes.
- **Anonymous Authentication**: Firebase Auth ensures preference syncing remains private and session-based.

---

## ♿ Accessibility (A11y) Standards

Designed for **WCAG 2.1 AA** compliance:
- **Zero-Reading UI**: Every instruction is spoken aloud; icons represent all major actions.
- **Touch Optimisation**: 52px+ touch targets for users with motor impairments.
- **Variable Typography**: Configurable font sizes (Small to Extra Large) and High Contrast modes.
- **Screen Reader Support**: Full ARIA-Live integration for chat and dynamic content.
- **Keyboard Navigation**: Skip-navigation links and logical tab-flow for power users.

---

## 🌐 Multilingual Architecture

Matdaata Mitra features a centralized translation engine supporting:
- **Linguistic Parity**: 600+ localized strings across 22 languages.
- **Dynamic Script Rendering**: Automatically switches font-families based on the active language to ensure correct glyph rendering for complex scripts like Urdu or Odia.
- **Audio Descriptions**: Every UI label has a corresponding audio key for immediate narration.

---

## 🧪 Testing Suite

We maintain a robust testing environment with **Vitest** and **React Testing Library**:
- **Unit Tests**: Logic verification for the translation engine, security utilities, and audio mapping.
- **Integration Tests**: Verification of the Home dashboard, AI Chatbox, and Electoral Search flows.
- **Accessibility Audit**: Automated checks for ARIA compliance and color contrast.

Run the test suite:
```bash
npm run test:coverage
```

---

## 🚀 Getting Started

### Installation
1. Clone the repository: `git clone https://github.com/vaibhav010606/eciagent.git`
2. Install dependencies: `npm install`

### Environment Variables
Create a `.env` file with:
```env
VITE_GEMINI_API_KEY=your_key
VITE_SARVAM_API_KEY=your_key
VITE_FIREBASE_API_KEY=your_key
```

### Development
```bash
npm run dev
```

---

## 📄 Disclaimer
Matdaata Mitra is an independent educational tool. All official voter registrations and services are processed directly through the **Election Commission of India (ECI)** official portals.

---
*Built with ❤️ for an inclusive and accessible democracy.*
