import { describe, it, expect } from 'vitest';
import { t } from './translations';

describe('Translations', () => {
  it('should fall back to English if language is missing', () => {
    expect(t('title', 'xyz')).toBe('Voting Assistant');
  });

  it('should resolve key in Hindi', () => {
    expect(t('title', 'hi')).toBe('मतदान सहायक');
  });

  it('should replace variables in strings', () => {
    // E.g. vote_recorded_audio: 'You voted for {{name}}. In the real booth, your vote is now recorded.'
    const result = t('vote_recorded_audio', 'en', { name: 'Lotus' });
    expect(result).toBe('You voted for Lotus. In the real booth, your vote is now recorded.');
  });
});
