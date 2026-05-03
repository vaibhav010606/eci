import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ElectoralRollSearch from './ElectoralRollSearch';
import '@testing-library/jest-dom';

describe('ElectoralRollSearch Component', () => {
  const defaultProps = {
    playAudio: vi.fn(),
    language: 'en',
  };

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ElectoralRollSearch {...defaultProps} />
      </BrowserRouter>
    );
    // Component uses t('check_name') which is "Check My Name"
    expect(screen.getByText(/Check My Name/i)).toBeInTheDocument();
  });

  it('renders search action buttons', () => {
    render(
      <BrowserRouter>
        <ElectoralRollSearch {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Search by Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Search by EPIC/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Electoral Roll/i)).toBeInTheDocument();
  });

  it('renders the official portal link', () => {
    render(
      <BrowserRouter>
        <ElectoralRollSearch {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Voters' Services Portal/i)).toBeInTheDocument();
  });
});
