import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// ── Mock Gemini — hoisted automatically by Vitest ─────────────────
// Covers both static AND dynamic imports of the module
vi.mock('@google/generative-ai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: { text: () => 'Mocked AI response' },
  });
  const mockGetGenerativeModel = vi.fn().mockReturnValue({ generateContent: mockGenerateContent });
  const MockGoogleGenerativeAI = vi.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  }));
  return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

// ── Mock security utilities ───────────────────────────────────────
vi.mock('../utils/security', () => ({
  sanitizeInput: (input) => input?.trim() || '',
  checkRateLimit: vi.fn(() => ({ allowed: true, waitMs: 0 })),
}));

// ── Mock translations ─────────────────────────────────────────────
vi.mock('../utils/translations', () => ({
  t: (key) => {
    const map = {
      va_welcome: 'Hello! I am Matdaata Mitra.',
      va_type_message: 'Type a message...',
      va_not_understood: "I'm having trouble connecting.",
    };
    return map[key] || key;
  },
}));

// ── Component (imported AFTER all vi.mock calls) ──────────────────
import AgentChatBox from './AgentChatBox';

// Disable Speech APIs for all tests
window.SpeechRecognition = undefined;
window.webkitSpeechRecognition = undefined;

const renderComponent = (props = {}) => {
  const playAudioMock = vi.fn();
  const utils = render(
    <BrowserRouter>
      <AgentChatBox playAudio={playAudioMock} language="en" {...props} />
    </BrowserRouter>
  );
  return { ...utils, playAudioMock };
};

// ─────────────────────────────────────────────────────────────────
describe('AgentChatBox - Rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderComponent();
    expect(container).toBeInTheDocument();
  });

  it('shows the Matdaata Mitra header', () => {
    renderComponent();
    expect(screen.getAllByText(/Matdaata Mitra/i).length).toBeGreaterThan(0);
  });

  it('displays the welcome message from agent on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Hello! I am Matdaata Mitra/i)).toBeInTheDocument();
    });
  });

  it('renders the microphone button', () => {
    renderComponent();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('renders the text input field with placeholder', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Type a message.../i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────
describe('AgentChatBox - Speech Recognition', () => {
  it('calls playAudio with fallback error when SpeechRecognition is unavailable', () => {
    const { playAudioMock } = renderComponent();
    const [micButton] = screen.getAllByRole('button');
    fireEvent.click(micButton);
    expect(playAudioMock).toHaveBeenCalledWith('Voice input is not supported on this browser.');
  });
});

// ─────────────────────────────────────────────────────────────────
describe('AgentChatBox - Input Handling', () => {
  it('updates input value as user types', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Type a message.../i);
    fireEvent.change(input, { target: { value: 'Where is my polling booth?' } });
    expect(input.value).toBe('Where is my polling booth?');
  });

  it('adds user message bubble when Enter is pressed', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Type a message.../i);
    fireEvent.change(input, { target: { value: 'How do I register to vote?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
    });
  });

  it('does not add user bubble for whitespace-only input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Type a message.../i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText(/Hello! I am Matdaata Mitra/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────
describe('AgentChatBox - Rate Limiting', () => {
  it('shows a wait message when the rate limit is exceeded', async () => {
    const { checkRateLimit } = await import('../utils/security');
    checkRateLimit.mockReturnValueOnce({ allowed: false, waitMs: 15000 });

    renderComponent();
    const input = screen.getByPlaceholderText(/Type a message.../i);
    fireEvent.change(input, { target: { value: 'Test query' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/Please wait 15 seconds/i)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────────────────────────
describe('AgentChatBox - Accessibility', () => {
  it('chat container has aria-live="polite"', () => {
    renderComponent();
    const chatLog = screen.getByRole('log');
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });

  it('chat container has a descriptive aria-label', () => {
    renderComponent();
    const chatLog = screen.getByRole('log');
    expect(chatLog).toHaveAttribute('aria-label', 'Conversation with Matdaata Mitra');
  });
});
