import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentChatBox from './AgentChatBox';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';

// Mocking window.SpeechRecognition
window.SpeechRecognition = undefined;
window.webkitSpeechRecognition = undefined;

describe('AgentChatBox Error Handling', () => {
  it('shows error if SpeechRecognition is missing and mic is clicked', () => {
    const playAudioMock = vi.fn();
    render(
      <BrowserRouter>
        <AgentChatBox playAudio={playAudioMock} language="en" />
      </BrowserRouter>
    );

    // Click the microphone button (assuming it has a specific class or ARIA we can query, we'll just click the first button for simplicity as a basic test)
    const buttons = screen.getAllByRole('button');
    const micButton = buttons[0]; 
    
    fireEvent.click(micButton);

    // It should call playAudio with the fallback message
    expect(playAudioMock).toHaveBeenCalledWith('Voice input is not supported on this browser.');
  });
});
