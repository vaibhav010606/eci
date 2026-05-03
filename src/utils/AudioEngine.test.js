import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AudioEngine from './AudioEngine';

// ── Mock browser APIs ────────────────────────────────────────────
const mockAudioPlay = vi.fn().mockResolvedValue(undefined);
const mockAudioPause = vi.fn();

// Create a mock Audio element
const mockAudioElement = {
  play: mockAudioPlay,
  pause: mockAudioPause,
  currentTime: 0,
  volume: 1,
  src: '',
  playbackRate: 1,
  onended: null,
};

// Patch AudioEngine.audio to use our mock
AudioEngine.audio = mockAudioElement;

// Mock fetch globally
global.fetch = vi.fn();

// Mock URL API
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock atob + Uint8Array
global.atob = vi.fn().mockReturnValue('\x00\x01');

// Mock speechSynthesis
const mockSynthSpeak = vi.fn();
const mockSynthCancel = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([
  { lang: 'hi-IN', name: 'Hindi Voice' },
  { lang: 'en-IN', name: 'English Voice' },
]);
global.speechSynthesis = {
  speaking: false,
  speak: mockSynthSpeak,
  cancel: mockSynthCancel,
  getVoices: mockGetVoices,
};

class MockSpeechSynthesisUtterance {
  constructor(text) { this.text = text; this.volume = 1; this.rate = 1; this.voice = null; }
}
global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── Tests ────────────────────────────────────────────────────────
describe('AudioEngine.getLanguageCode', () => {
  it('maps English to en-IN', () => {
    expect(AudioEngine.getLanguageCode('en')).toBe('en-IN');
  });
  it('maps Hindi to hi-IN', () => {
    expect(AudioEngine.getLanguageCode('hi')).toBe('hi-IN');
  });
  it('maps Bengali to bn-IN', () => {
    expect(AudioEngine.getLanguageCode('bn')).toBe('bn-IN');
  });
  it('maps Tamil to ta-IN', () => {
    expect(AudioEngine.getLanguageCode('ta')).toBe('ta-IN');
  });
  it('maps Telugu to te-IN', () => {
    expect(AudioEngine.getLanguageCode('te')).toBe('te-IN');
  });
  it('maps Kannada to kn-IN', () => {
    expect(AudioEngine.getLanguageCode('kn')).toBe('kn-IN');
  });
  it('maps Malayalam to ml-IN', () => {
    expect(AudioEngine.getLanguageCode('ml')).toBe('ml-IN');
  });
  it('maps Gujarati to gu-IN', () => {
    expect(AudioEngine.getLanguageCode('gu')).toBe('gu-IN');
  });
  it('falls back to en-IN for unknown code', () => {
    expect(AudioEngine.getLanguageCode('xyz')).toBe('en-IN');
  });
  it('falls back to en-IN for undefined', () => {
    expect(AudioEngine.getLanguageCode(undefined)).toBe('en-IN');
  });
});

describe('AudioEngine.stop', () => {
  it('pauses the audio and resets currentTime', () => {
    AudioEngine.stop();
    expect(mockAudioPause).toHaveBeenCalled();
    expect(mockAudioElement.currentTime).toBe(0);
  });

  it('cancels speechSynthesis if speaking', () => {
    global.speechSynthesis.speaking = true;
    AudioEngine.stop();
    expect(mockSynthCancel).toHaveBeenCalled();
    global.speechSynthesis.speaking = false;
  });
});

describe('AudioEngine.speak', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AudioEngine.currentAbortController = null;
    AudioEngine.audio = mockAudioElement;
  });

  it('returns early if text is empty', async () => {
    await AudioEngine.speak('');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('calls Sarvam API with correct params and plays audio on success', async () => {
    const mockBase64 = 'SGVsbG8=';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audios: [mockBase64] }),
      text: async () => '',
    });
    global.atob.mockReturnValueOnce('Hello');

    await AudioEngine.speak('Test text', 'hi');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sarvam.ai/text-to-speech',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(mockAudioPlay).toHaveBeenCalled();
  });

  it('falls back to browser TTS if fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const browserSpeakSpy = vi.spyOn(AudioEngine, 'browserSpeak').mockImplementation(() => {});

    await AudioEngine.speak('Fallback text', 'en');
    expect(browserSpeakSpy).toHaveBeenCalledWith('Fallback text', 'en');

    browserSpeakSpy.mockRestore();
  });

  it('falls back to browser TTS if API returns non-ok status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    });
    const browserSpeakSpy = vi.spyOn(AudioEngine, 'browserSpeak').mockImplementation(() => {});

    await AudioEngine.speak('Error text', 'en');
    expect(browserSpeakSpy).toHaveBeenCalled();

    browserSpeakSpy.mockRestore();
  });

  it('respects playback speed from localStorage', async () => {
    localStorageMock.setItem('voting_agent_speed', 'slow');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audios: ['dGVzdA=='] }),
    });
    global.atob.mockReturnValueOnce('test');

    await AudioEngine.speak('Speed test', 'en');
    expect(mockAudioElement.playbackRate).toBe(0.8);
    localStorageMock.clear();
  });
});

describe('AudioEngine.browserSpeak', () => {
  it('calls speechSynthesis.speak with the correct utterance', () => {
    AudioEngine.browserSpeak('Hello', 'hi');
    expect(mockSynthSpeak).toHaveBeenCalled();
    const utterance = mockSynthSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('Hello');
    expect(utterance.voice?.lang).toBe('hi-IN');
  });

  it('cancels any ongoing speech before speaking', () => {
    global.speechSynthesis.speaking = true;
    AudioEngine.browserSpeak('Interrupt test', 'en');
    expect(mockSynthCancel).toHaveBeenCalled();
    global.speechSynthesis.speaking = false;
  });

  it('does nothing if speechSynthesis is unavailable', () => {
    const originalSynth = global.speechSynthesis;
    global.speechSynthesis = null;
    // Should not throw
    expect(() => AudioEngine.browserSpeak('No synth', 'en')).not.toThrow();
    global.speechSynthesis = originalSynth;
  });
});

describe('AudioEngine.unlock', () => {
  it('plays a silent sound to unlock audio context', () => {
    AudioEngine.unlocked = false;
    AudioEngine.unlock();
    expect(mockAudioElement.src).toContain('data:audio/wav');
  });

  it('does not re-unlock if already unlocked', () => {
    AudioEngine.unlocked = true;
    mockAudioPlay.mockClear();
    AudioEngine.unlock();
    expect(mockAudioPlay).not.toHaveBeenCalled();
    AudioEngine.unlocked = false;
  });
});
