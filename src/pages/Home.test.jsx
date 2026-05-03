import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import '@testing-library/jest-dom';

// Mock AgentChatBox to avoid deep testing it within Home
vi.mock('../components/AgentChatBox', () => ({
  default: () => <div data-testid="agent-chat-box">Agent Chat Box Mock</div>
}));

describe('Home Component', () => {
  it('renders the Matdaata Mitra header and main action tiles', () => {
    const playAudioMock = vi.fn();
    render(
      <BrowserRouter>
        <Home language="en" playAudio={playAudioMock} isSirActive={true} />
      </BrowserRouter>
    );

    // Verify main brand heading (header + main content)
    expect(screen.getAllByText(/Matdaata Mitra/i).length).toBeGreaterThan(0);

    // Verify presence of tiles using translations.js defaults (English)
    expect(screen.getByText(/Check My Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Register \/ Update/i)).toBeInTheDocument();
    expect(screen.getByText(/EVM Practice/i)).toBeInTheDocument();
    
    // Verify the mock chat box exists
    expect(screen.getByTestId('agent-chat-box')).toBeInTheDocument();
  });
});
