import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ElectoralRollSearch from './ElectoralRollSearch';
import '@testing-library/jest-dom';

// Mock eciLinks to control URL opening
vi.mock('../utils/eciLinks', () => ({
  ECI_LINKS: {
    electoralSearch: 'https://electoralsearch.eci.gov.in/',
    downloadEroll: 'https://voters.eci.gov.in/download-eroll/',
    vsp: 'https://voters.eci.gov.in/',
  },
  openECILink: vi.fn(),
}));

// Mock translations
vi.mock('../utils/translations', () => ({
  t: (key) => {
    const map = {
      check_name: 'Check My Name',
      search_by_details: 'Search by Name / Details',
      search_by_epic: 'Search by EPIC Number',
      download_roll: 'Download Electoral Roll',
      official_portal_disclaimer: 'SECURE OFFICIAL ECI PORTAL',
      visit_vsp: "Visit Voters' Services Portal",
      search_intro_text: 'Find your name in the official Voter List.',
    };
    return map[key] || key;
  },
}));

const renderSearch = (props = {}) => {
  const playAudioMock = vi.fn();
  const utils = render(
    <BrowserRouter>
      <ElectoralRollSearch playAudio={playAudioMock} language="en" {...props} />
    </BrowserRouter>
  );
  return { ...utils, playAudioMock };
};

describe('ElectoralRollSearch - Rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderSearch();
    expect(container).toBeInTheDocument();
  });

  it('displays the page heading', () => {
    renderSearch();
    expect(screen.getByText(/Check My Name/i)).toBeInTheDocument();
  });

  it('renders intro text', () => {
    renderSearch();
    expect(screen.getByText(/Find your name/i)).toBeInTheDocument();
  });

  it('renders "Search by Name / Details" action button', () => {
    renderSearch();
    expect(screen.getByText(/Search by Name \/ Details/i)).toBeInTheDocument();
  });

  it('renders "Search by EPIC Number" action button', () => {
    renderSearch();
    expect(screen.getByText(/Search by EPIC Number/i)).toBeInTheDocument();
  });

  it('renders "Download Electoral Roll" action button', () => {
    renderSearch();
    expect(screen.getByText(/Download Electoral Roll/i)).toBeInTheDocument();
  });

  it('renders the "Visit Voters Services Portal" fallback button', () => {
    renderSearch();
    expect(screen.getByText(/Visit Voters' Services Portal/i)).toBeInTheDocument();
  });

  it('renders the official portal disclaimer label', () => {
    renderSearch();
    expect(screen.getByText(/SECURE OFFICIAL ECI PORTAL/i)).toBeInTheDocument();
  });
});

describe('ElectoralRollSearch - Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls openECILink with electoralSearch URL on "Search by Name" click', async () => {
    const { openECILink } = await import('../utils/eciLinks');
    renderSearch();
    fireEvent.click(screen.getByText(/Search by Name \/ Details/i));
    expect(openECILink).toHaveBeenCalledWith(
      'https://electoralsearch.eci.gov.in/',
      expect.any(String),
      expect.any(Function),
      'en'
    );
  });

  it('calls openECILink with electoralSearch URL on "Search by EPIC" click', async () => {
    const { openECILink } = await import('../utils/eciLinks');
    renderSearch();
    fireEvent.click(screen.getByText(/Search by EPIC Number/i));
    expect(openECILink).toHaveBeenCalledWith(
      'https://electoralsearch.eci.gov.in/',
      expect.any(String),
      expect.any(Function),
      'en'
    );
  });

  it('calls openECILink with downloadEroll URL on "Download Roll" click', async () => {
    const { openECILink } = await import('../utils/eciLinks');
    renderSearch();
    fireEvent.click(screen.getByText(/Download Electoral Roll/i));
    expect(openECILink).toHaveBeenCalledWith(
      'https://voters.eci.gov.in/download-eroll/',
      expect.any(String),
      expect.any(Function),
      'en'
    );
  });

  it('calls openECILink with VSP URL on portal button click', async () => {
    const { openECILink } = await import('../utils/eciLinks');
    renderSearch();
    fireEvent.click(screen.getByText(/Visit Voters' Services Portal/i));
    expect(openECILink).toHaveBeenCalledWith(
      'https://voters.eci.gov.in/',
      expect.any(String),
      expect.any(Function),
      'en'
    );
  });
});
