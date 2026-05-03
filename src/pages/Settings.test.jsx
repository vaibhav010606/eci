import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';
import '@testing-library/jest-dom';

describe('Settings Component', () => {
  const defaultProps = {
    highContrast: false,
    setHighContrast: vi.fn(),
    fontSize: 'medium',
    setFontSize: vi.fn(),
    playAudio: vi.fn(),
    language: 'en',
  };

  it('renders the settings page without crashing', () => {
    render(
      <BrowserRouter>
        <Settings {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('renders font size options', () => {
    render(
      <BrowserRouter>
        <Settings {...defaultProps} />
      </BrowserRouter>
    );
    // Use getAllByText because 'Normal' and 'Large' might appear in descriptions or other labels
    expect(screen.getAllByText(/Normal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Large/i).length).toBeGreaterThan(0);
  });

  it('calls setHighContrast when high contrast toggle is clicked', () => {
    const setHighContrastMock = vi.fn();
    render(
      <BrowserRouter>
        <Settings {...defaultProps} setHighContrast={setHighContrastMock} />
      </BrowserRouter>
    );
    // Find the toggle button by its aria-label
    const toggleButton = screen.getByRole('switch', { name: /Toggle High Contrast Mode/i });
    fireEvent.click(toggleButton);
    expect(setHighContrastMock).toHaveBeenCalled();
  });
});
