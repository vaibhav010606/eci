// ─── ECI LINK REGISTRY (Verified 2025–2026) ────────────────────────────────
// All URLs are live ECI portals. Do NOT substitute, shorten, or guess.

export const ECI_LINKS = {
  // TIER 1 — PRIMARY PORTALS
  vsp:                 'https://voters.eci.gov.in/',
  vspLogin:            'https://voters.eci.gov.in/login',
  electoralSearch:     'https://electoralsearch.eci.gov.in/',
  eciMain:             'https://www.eci.gov.in/',
  eciNet:              'https://ecinet.eci.gov.in/homepage',

  // TIER 2 — VOTER REGISTRATION FORMS
  form6:               'https://voters.eci.gov.in/form6',
  form6a:              'https://voters.eci.gov.in/form6a',
  form7:               'https://voters.eci.gov.in/form7',
  form8:               'https://voters.eci.gov.in/form8',
  form6Pdf:            'https://voters.eci.gov.in/formspdf/Form_6_English.pdf',
  allForms:            'https://www.eci.gov.in/download-forms',
  trackApplication:    'https://voters.eci.gov.in/track-application-status',

  // TIER 3 — VOTER ID & ELECTORAL ROLL
  eEpic:               'https://voters.eci.gov.in/e-epic',
  downloadEroll:       'https://voters.eci.gov.in/download-eroll/',
  electoralRollInfo:   'https://www.eci.gov.in/electoral-roll',

  // TIER 4 — GRIEVANCES
  ngsp:                'https://eci.gov.in/contact-us/ngsp/',
  complaintsEmail:     'mailto:complaints@eci.gov.in',
  helpline:            'tel:1950',

  // TIER 5 — RESULTS & CONTACTS
  results:             'https://results.eci.gov.in/',
  allCEOs:             'https://eci.gov.in/contact-us/ceos/',

  // TIER 6 — APPS
  voterHelplineApp:    'https://play.google.com/store/apps/details?id=com.eci.citizen&hl=en_US',
  cVigilApp:           'https://play.google.com/store/apps/details?id=in.eci.cvigil',
  kycApp:              'https://play.google.com/store/apps/details?id=com.eci.ksa',
  cVigilInfo:          'https://eci.gov.in/cvigil/',

  // TIER 8 — SUPPLEMENTARY
  digiLocker:          'https://www.digilocker.gov.in/',
  nvsp:                'https://www.nvsp.in',
  ictApps:             'https://eci.gov.in/divisions-of-eci/ict-apps/',
};

export const ECI_CONTACTS = {
  helplineNumber: '1950',
  helplineHours: 'Monday to Saturday, 10:00 AM to 5:00 PM',
  helplineLanguages: 'Hindi, English, and all major regional languages',
  complaintsEmail: 'complaints@eci.gov.in',
  smsFormat: 'SMS: ECI <space> <your EPIC number> to 1950',
};

// Health-check URLs for startup ping
export const ECI_HEALTH_CHECK_URLS = [
  'https://voters.eci.gov.in/',
  'https://electoralsearch.eci.gov.in/',
  'https://results.eci.gov.in/',
];

// Audio scripts
export const ECI_AUDIO = {
  openingPortal: 'I am opening the official Election Commission website. It is safe and government-run.',
  offline:       'You are currently offline. This feature requires internet. Please connect and try again. You can still use the Practice Booth and FAQs.',
  helpline:      'You can call 1950. It is free. The helpline is open Monday to Saturday, 10 AM to 5 PM. They speak Hindi, English, and most Indian languages.',
  email:         'You can email your complaint to complaints at eci dot gov dot in.',
  grievance:     'I am opening the online complaints portal of the Election Commission. You can file and track your complaint here.',
  blo:           'I am opening the Book-a-Call portal. You can schedule a call with your local Booth Level Officer here.',
};

// DISCLAIMER (must appear on Home & Settings)
export const APP_DISCLAIMER =
  'Vaibhav is an independent civic technology tool that helps users access official Election Commission of India services. All voter registrations, corrections, and complaints are processed directly by the ECI through their official portals. Vaibhav does not store your voter data. This app is not affiliated with or endorsed by the Election Commission of India.';

/**
 * Opens an ECI link in a new tab with audio briefing and offline check.
 * @param {string} url  - The ECI URL to open
 * @param {string} label - Human-readable label for audio & analytics
 * @param {Function} playAudio - App's audio function
 */
export function openECILink(url, label, playAudio) {
  if (!navigator.onLine) {
    if (playAudio) playAudio(ECI_AUDIO.offline);
    return false;
  }
  if (playAudio) playAudio(ECI_AUDIO.openingPortal);
  // tel: and mailto: don't need _blank
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return true;
}
