import { t } from './translations';

export const ECI_LINKS = {
  // TIER 1 — PRIMARY PORTALS
  vsp:                 'https://voters.eci.gov.in/',
  vspHomepage:         'https://voters.eci.gov.in/homepage',
  vspLogin:            'https://voters.eci.gov.in/login',
  electoralSearch:     'https://electoralsearch.eci.gov.in/',
  eciMain:             'https://www.eci.gov.in/',
  eciNet:              'https://ecinet.eci.gov.in/homepage',

  // TIER 2 — VOTER REGISTRATION FORMS
  form6:               'https://voters.eci.gov.in/form6',
  form6a:              'https://voters.eci.gov.in/form6a',
  form7:               'https://voters.eci.gov.in/form7',
  form8:               'https://voters.eci.gov.in/form8',
  allForms:            'https://www.eci.gov.in/download-forms',
  form6Pdf:            'https://voters.eci.gov.in/formspdf/Form_6_English.pdf',
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
  allCEOs:             'https://www.eci.gov.in/ceo-websites',
  ceosDir:             'https://eci.gov.in/contact-us/ceos/',
  bookBLO:             'https://ecinet.eci.gov.in/homepage',

  // TIER 6 — APPS
  voterHelplineApp:    'https://play.google.com/store/apps/details?id=com.eci.citizen&hl=en_US',
  cVigilApp:           'https://play.google.com/store/apps/details?id=in.nic.eci.cvigil',
  kycApp:              'https://play.google.com/store/apps/details?id=com.eci.ksa',
  cVigilInfo:          'https://eci.gov.in/cvigil/',

  // TIER 8 — SUPPLEMENTARY
  digiLocker:          'https://www.digilocker.gov.in/',
  nvsp:                'https://www.nvsp.in',
  ictApps:             'https://eci.gov.in/divisions-of-eci/ict-apps/',
};

export const getEciContacts = (lang) => ({
  helplineNumber: '1950',
  helplineHours: t('eci_helpline_hours', lang),
  helplineLanguages: t('eci_helpline_langs', lang),
  complaintsEmail: 'complaints@eci.gov.in',
  smsFormat: 'SMS: ECI <space> <your EPIC number> to 1950',
});

// Health-check URLs for startup ping
export const ECI_HEALTH_CHECK_URLS = [
  'https://voters.eci.gov.in/',
  'https://electoralsearch.eci.gov.in/',
  'https://results.eci.gov.in/',
];

/**
 * Opens an ECI link in a new tab with audio briefing and offline check.
 * @param {string} url  - The ECI URL to open
 * @param {string} label - Human-readable label for audio & analytics
 * @param {Function} playAudio - App's audio function
 * @param {string} lang - Selected language
 */
export function openECILink(url, label, playAudio, lang = 'en') {
  if (!navigator.onLine) {
    if (playAudio) playAudio(t('eci_offline', lang));
    return false;
  }
  
  // Custom audio logic based on URL type
  if (url.includes('ngsp')) {
    if (playAudio) playAudio(t('eci_grievance_audio', lang));
  } else if (url.includes('ecinet')) {
    if (playAudio) playAudio(t('eci_blo_audio', lang));
  } else if (url === 'tel:1950') {
    if (playAudio) playAudio(t('eci_helpline_audio', lang));
  } else if (url.startsWith('mailto:')) {
    if (playAudio) playAudio(t('eci_email_audio', lang));
  } else {
    if (playAudio) playAudio(t('eci_opening_portal', lang));
  }

  // tel: and mailto: don't need _blank
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return true;
}
