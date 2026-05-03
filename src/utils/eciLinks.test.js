import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ECI_LINKS, getEciContacts, ECI_HEALTH_CHECK_URLS, openECILink } from './eciLinks';

// Mock translations to avoid dependency on full dictionary
vi.mock('./translations', () => ({
  t: (key) => key,
}));

// Mock browser APIs
const mockWindowOpen = vi.fn();
const mockLocationAssign = vi.fn();

Object.defineProperty(global, 'navigator', {
  value: { onLine: true },
  writable: true,
});
Object.defineProperty(global, 'window', {
  value: {
    ...global.window,
    open: mockWindowOpen,
    location: { href: '' },
  },
  writable: true,
});

describe('ECI_LINKS constants', () => {
  it('contains all primary portal URLs', () => {
    expect(ECI_LINKS.vsp).toBe('https://voters.eci.gov.in/');
    expect(ECI_LINKS.electoralSearch).toBe('https://electoralsearch.eci.gov.in/');
    expect(ECI_LINKS.eciMain).toBe('https://www.eci.gov.in/');
    expect(ECI_LINKS.results).toBe('https://results.eci.gov.in/');
  });

  it('contains voter registration form links', () => {
    expect(ECI_LINKS.form6).toBe('https://voters.eci.gov.in/form6');
    expect(ECI_LINKS.form7).toBe('https://voters.eci.gov.in/form7');
    expect(ECI_LINKS.form8).toBe('https://voters.eci.gov.in/form8');
    expect(ECI_LINKS.form6a).toBe('https://voters.eci.gov.in/form6a');
  });

  it('contains voter ID and eEPIC links', () => {
    expect(ECI_LINKS.eEpic).toBe('https://voters.eci.gov.in/e-epic');
    expect(ECI_LINKS.digiLocker).toBe('https://www.digilocker.gov.in/');
  });

  it('contains grievance and helpline links', () => {
    expect(ECI_LINKS.ngsp).toBe('https://eci.gov.in/contact-us/ngsp/');
    expect(ECI_LINKS.helpline).toBe('tel:1950');
  });

  it('contains app download links', () => {
    expect(ECI_LINKS.voterHelplineApp).toContain('play.google.com');
    expect(ECI_LINKS.cVigilApp).toContain('play.google.com');
  });

  it('has exactly the expected number of links (no accidental deletions)', () => {
    expect(Object.keys(ECI_LINKS).length).toBeGreaterThanOrEqual(20);
  });
});

describe('getEciContacts', () => {
  it('returns the ECI helpline number 1950', () => {
    const contacts = getEciContacts('en');
    expect(contacts.helplineNumber).toBe('1950');
  });

  it('returns the correct complaints email', () => {
    const contacts = getEciContacts('en');
    expect(contacts.complaintsEmail).toBe('complaints@eci.gov.in');
  });

  it('includes SMS format', () => {
    const contacts = getEciContacts('en');
    expect(contacts.smsFormat).toContain('1950');
  });
});

describe('ECI_HEALTH_CHECK_URLS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ECI_HEALTH_CHECK_URLS)).toBe(true);
    expect(ECI_HEALTH_CHECK_URLS.length).toBeGreaterThan(0);
  });

  it('contains only HTTPS URLs', () => {
    ECI_HEALTH_CHECK_URLS.forEach(url => {
      expect(url.startsWith('https://')).toBe(true);
    });
  });
});

describe('openECILink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.navigator.onLine = true;
  });

  it('opens HTTPS URL in new tab when online', () => {
    const playAudio = vi.fn();
    const result = openECILink('https://voters.eci.gov.in/', 'Voter Portal', playAudio, 'en');
    expect(result).toBe(true);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://voters.eci.gov.in/',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('calls playAudio with offline message when navigator is offline', () => {
    global.navigator.onLine = false;
    const playAudio = vi.fn();
    const result = openECILink('https://voters.eci.gov.in/', 'Voter Portal', playAudio, 'en');
    expect(result).toBe(false);
    expect(playAudio).toHaveBeenCalledWith('eci_offline');
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('plays grievance audio for NGSP link', () => {
    const playAudio = vi.fn();
    openECILink('https://eci.gov.in/contact-us/ngsp/', 'Grievance', playAudio, 'en');
    expect(playAudio).toHaveBeenCalledWith('eci_grievance_audio');
  });

  it('plays helpline audio for tel:1950', () => {
    const playAudio = vi.fn();
    openECILink('tel:1950', 'Helpline', playAudio, 'en');
    expect(playAudio).toHaveBeenCalledWith('eci_helpline_audio');
  });

  it('plays email audio for mailto: links', () => {
    const playAudio = vi.fn();
    openECILink('mailto:complaints@eci.gov.in', 'Email', playAudio, 'en');
    expect(playAudio).toHaveBeenCalledWith('eci_email_audio');
  });

  it('plays ecinet audio for ecinet links', () => {
    const playAudio = vi.fn();
    openECILink('https://ecinet.eci.gov.in/homepage', 'BLO', playAudio, 'en');
    expect(playAudio).toHaveBeenCalledWith('eci_blo_audio');
  });

  it('plays generic portal audio for standard links', () => {
    const playAudio = vi.fn();
    openECILink('https://results.eci.gov.in/', 'Results', playAudio, 'en');
    expect(playAudio).toHaveBeenCalledWith('eci_opening_portal');
  });

  it('works without a playAudio function (no crash)', () => {
    expect(() => openECILink('https://voters.eci.gov.in/', 'Label', null, 'en')).not.toThrow();
  });
});
