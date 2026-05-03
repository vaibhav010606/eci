import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';
import '@testing-library/jest-dom';

// Mock translations
vi.mock('../utils/translations', () => ({
  t: (key) => {
    const map = {
      settings_title: 'Settings',
      eci_disclaimer_full: 'Official ECI advisory.',
    };
    return map[key] || key;
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const renderSettings = (props = {}) => {
  const playAudioMock = vi.fn();
  const setHighContrastMock = vi.fn();
  const setFontSizeMock = vi.fn();
  const utils = render(
    <BrowserRouter>
      <Settings
        highContrast={false}
        setHighContrast={setHighContrastMock}
        fontSize="medium"
        setFontSize={setFontSizeMock}
        playAudio={playAudioMock}
        language="en"
        {...props}
      />
    </BrowserRouter>
  );
  return { ...utils, playAudioMock, setHighContrastMock, setFontSizeMock };
};

describe('Settings - Rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderSettings();
    expect(container).toBeInTheDocument();
  });

  it('shows the settings title', () => {
    renderSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the High Contrast section', () => {
    renderSettings();
    expect(screen.getByText(/High Contrast Mode/i)).toBeInTheDocument();
  });

  it('renders the Text Size section', () => {
    renderSettings();
    expect(screen.getByText(/Text Size/i)).toBeInTheDocument();
  });

  it('renders all 4 font size options', () => {
    renderSettings();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('Extra Large')).toBeInTheDocument();
  });

  it('renders the Voice Notifications section', () => {
    renderSettings();
    expect(screen.getByText(/Voice Notifications/i)).toBeInTheDocument();
  });

  it('renders the Privacy & Data section', () => {
    renderSettings();
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    renderSettings();
    expect(screen.getByText(/Official ECI advisory/i)).toBeInTheDocument();
  });
});

describe('Settings - High Contrast Toggle', () => {
  it('calls setHighContrast with toggled value when clicked', () => {
    const { setHighContrastMock } = renderSettings({ highContrast: false });
    const toggle = screen.getByRole('switch', { name: /High Contrast Mode/i });
    fireEvent.click(toggle);
    expect(setHighContrastMock).toHaveBeenCalledWith(true);
  });

  it('saves new value to localStorage', () => {
    renderSettings({ highContrast: false });
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(localStorageMock.getItem('voting_agent_hc')).toBe('true');
  });

  it('calls playAudio with "enabled" when turning on', () => {
    const { playAudioMock } = renderSettings({ highContrast: false });
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(playAudioMock).toHaveBeenCalledWith(expect.stringContaining('enabled'));
  });

  it('calls playAudio with "disabled" when turning off', () => {
    const { playAudioMock } = renderSettings({ highContrast: true });
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(playAudioMock).toHaveBeenCalledWith(expect.stringContaining('disabled'));
  });

  it('toggle has aria-checked="false" when highContrast is false', () => {
    renderSettings({ highContrast: false });
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggle has aria-checked="true" when highContrast is true', () => {
    renderSettings({ highContrast: true });
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Settings - Font Size Selector', () => {
  it('calls setFontSize with "small" when Small is clicked', () => {
    const { setFontSizeMock } = renderSettings();
    fireEvent.click(screen.getByText('Small'));
    expect(setFontSizeMock).toHaveBeenCalledWith('small');
  });

  it('calls setFontSize with "large" when Large is clicked', () => {
    const { setFontSizeMock } = renderSettings();
    fireEvent.click(screen.getByText('Large'));
    expect(setFontSizeMock).toHaveBeenCalledWith('large');
  });

  it('calls setFontSize with "extra-large" when Extra Large is clicked', () => {
    const { setFontSizeMock } = renderSettings();
    fireEvent.click(screen.getByText('Extra Large'));
    expect(setFontSizeMock).toHaveBeenCalledWith('extra-large');
  });

  it('saves font size choice to localStorage', () => {
    renderSettings();
    fireEvent.click(screen.getByText('Large'));
    expect(localStorageMock.getItem('voting_agent_fs')).toBe('large');
  });

  it('calls playAudio with the selected font size label', () => {
    const { playAudioMock } = renderSettings();
    fireEvent.click(screen.getByText('Normal'));
    expect(playAudioMock).toHaveBeenCalledWith(expect.stringContaining('Normal'));
  });
});
