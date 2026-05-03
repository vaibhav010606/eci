import { describe, it, expect } from 'vitest';
import AudioEngine from './AudioEngine';

describe('AudioEngine', () => {
  it('should be defined', () => {
    expect(AudioEngine).toBeDefined();
  });

  it('should correctly map language codes', () => {
    expect(AudioEngine.getLanguageCode('hi')).toBe('hi-IN');
    expect(AudioEngine.getLanguageCode('en')).toBe('en-IN');
    expect(AudioEngine.getLanguageCode('ta')).toBe('ta-IN');
    expect(AudioEngine.getLanguageCode('unknown')).toBe('en-IN'); // fallback
  });
});
