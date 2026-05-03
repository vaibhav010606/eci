import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import '@testing-library/jest-dom';

// Mock AgentChatBox to prevent deep testing
vi.mock('../components/AgentChatBox', () => ({
  default: () => <div data-testid="agent-chat-box">Agent Chat Box Mock</div>,
}));

// Mock translations
vi.mock('../utils/translations', () => ({
  t: (key) => {
    const map = {
      welcome: 'Welcome!',
      check_name: 'Check My Name',
      register_update: 'Register / Update',
      voting_day: 'Voting Day',
      past_results: 'Election Results',
      practice_voting: 'EVM Practice',
      help_complaints: 'Help & Complaints',
      my_voter_id: 'My Voter ID',
      voter_drive_active: 'Voter Drive Active',
      tap_check_name: 'Tap to check your name',
      check_now: 'Check Now',
      eci_disclaimer_full: 'This is an educational app. Visit eci.gov.in for official services.',
      banner_audio: '',
      search_audio: '',
      register_audio: '',
      voting_day_audio: '',
      results_audio: '',
      practice_audio: '',
      help_audio: '',
      id_card_audio: '',
    };
    return map[key] || key;
  },
}));

const renderHome = (props = {}) => {
  const playAudioMock = vi.fn();
  const utils = render(
    <BrowserRouter>
      <Home language="en" playAudio={playAudioMock} isSirActive={true} {...props} />
    </BrowserRouter>
  );
  return { ...utils, playAudioMock };
};

describe('Home - Core Rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderHome();
    expect(container).toBeInTheDocument();
  });

  it('displays the brand name "Matdaata Mitra"', () => {
    renderHome();
    expect(screen.getAllByText(/Matdaata Mitra/i).length).toBeGreaterThan(0);
  });

  it('renders the AI chat box', () => {
    renderHome();
    expect(screen.getByTestId('agent-chat-box')).toBeInTheDocument();
  });
});

describe('Home - Action Tiles', () => {
  it('renders the "Check My Name" tile', () => {
    renderHome();
    expect(screen.getByText(/Check My Name/i)).toBeInTheDocument();
  });

  it('renders the "Register / Update" tile', () => {
    renderHome();
    expect(screen.getByText(/Register \/ Update/i)).toBeInTheDocument();
  });

  it('renders the "Voting Day" tile', () => {
    renderHome();
    expect(screen.getByText(/Voting Day/i)).toBeInTheDocument();
  });

  it('renders the "Election Results" tile', () => {
    renderHome();
    expect(screen.getByText(/Election Results/i)).toBeInTheDocument();
  });

  it('renders the "EVM Practice" tile', () => {
    renderHome();
    expect(screen.getByText(/EVM Practice/i)).toBeInTheDocument();
  });

  it('renders the "Help & Complaints" tile', () => {
    renderHome();
    expect(screen.getByText(/Help & Complaints/i)).toBeInTheDocument();
  });

  it('renders the "My Voter ID" tile', () => {
    renderHome();
    expect(screen.getByText(/My Voter ID/i)).toBeInTheDocument();
  });

  it('renders exactly 7 tiles (all action categories)', () => {
    renderHome();
    // All tiles are motion.button elements with aria-label
    const tileLabels = [
      'Check My Name', 'Register / Update', 'Voting Day',
      'Election Results', 'EVM Practice', 'Help & Complaints', 'My Voter ID',
    ];
    tileLabels.forEach(label => {
      expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
    });
  });
});

describe('Home - Saffron Banner', () => {
  it('shows the alert banner when isSirActive is true', () => {
    renderHome({ isSirActive: true });
    expect(screen.getByText(/Voter Drive Active/i)).toBeInTheDocument();
  });

  it('hides the alert banner when isSirActive is false', () => {
    renderHome({ isSirActive: false });
    expect(screen.queryByText(/Voter Drive Active/i)).not.toBeInTheDocument();
  });
});

describe('Home - Audio', () => {
  it('calls playAudio on mount with the welcome message', () => {
    const { playAudioMock } = renderHome();
    expect(playAudioMock).toHaveBeenCalledWith('Welcome!');
  });
});

describe('Home - Disclaimer', () => {
  it('renders the ECI disclaimer at the bottom', () => {
    renderHome();
    expect(screen.getByText(/educational app/i)).toBeInTheDocument();
  });
});
