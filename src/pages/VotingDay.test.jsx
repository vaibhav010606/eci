import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VotingDay from './VotingDay';
import '@testing-library/jest-dom';

describe('VotingDay Component', () => {
  const defaultProps = {
    back: vi.fn(),
    playAudio: vi.fn(),
    language: 'en',
  };

  it('renders the polling booth map section', () => {
    render(
      <BrowserRouter>
        <VotingDay {...defaultProps} />
      </BrowserRouter>
    );
    // Google Maps iframe should be present
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.title).toBe('Polling Booth Map');
  });

  it('renders information cards', () => {
    render(
      <BrowserRouter>
        <VotingDay {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Election Date/i)).toBeInTheDocument();
    expect(screen.getByText(/What to Carry/i)).toBeInTheDocument();
  });

  it('renders the Find My Polling Booth button', () => {
    render(
      <BrowserRouter>
        <VotingDay {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Find My Polling Booth/i)).toBeInTheDocument();
  });

  it('renders the Voter Helpline App button', () => {
    render(
      <BrowserRouter>
        <VotingDay {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Voter Helpline App/i)).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(
      <BrowserRouter>
        <VotingDay {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });
});
