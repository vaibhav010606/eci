import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Speaker, VolumeX, Settings as SettingsIcon } from 'lucide-react';
import Home from './pages/Home';
import LanguageSelect from './pages/LanguageSelect';
import Intro from './pages/Intro';
import FormWizard from './pages/FormWizard';
import ElectoralRollSearch from './pages/ElectoralRollSearch';
import EVMSimulator from './pages/EVMSimulator';
import HelpCenter from './pages/HelpCenter';
import Settings from './pages/Settings';
import ElectionResults from './pages/ElectionResults';
import VoiceAssistant from './pages/VoiceAssistant';
import RegisterAI from './pages/RegisterAI';
import VoterID from './pages/VoterID';
import VotingDay from './pages/VotingDay';
import AudioEngine from './utils/AudioEngine';
import { analytics, logEvent } from './utils/firebase';
import { saveUserPreferences, loadUserPreferences, ensureAnonymousAuth } from './utils/firestore';
import { t } from './utils/translations';
import { LANG_FONTS } from './utils/constants';

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: '#FFFFFF',
  borderBottom: '1px solid #E2E6F0',
  height: '64px',
  padding: '0 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

const iconBtnStyle = {
  padding: '0.5rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const replayBtnStyle = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  width: '3.5rem',
  height: '3.5rem',
  backgroundColor: '#FF6B00',
  color: '#ffffff',
  borderRadius: '9999px',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(255,107,0,0.35)',
  cursor: 'pointer',
  zIndex: 50,
};

function App() {
  const [isMuted, setIsMuted] = useState(localStorage.getItem('voting_agent_muted') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('voting_agent_lang') || '');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('voting_agent_hc') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('voting_agent_fs') || 'medium');
  const [isSirActive, setIsSirActive] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Log page views to Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname
      });
    }
  }, [location]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize =
      fontSize === 'small' ? '14px' :
      fontSize === 'large' ? '20px' :
      fontSize === 'extra-large' ? '24px' : '16px';
  }, [fontSize]);

  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
      // Persist language to Firestore for cross-device sync
      saveUserPreferences({ language, highContrast, fontSize });
    }
  }, [language]);

  // Load preferences from Firestore on first mount
  useEffect(() => {
    ensureAnonymousAuth().then(() => {
      loadUserPreferences().then(prefs => {
        if (prefs?.language && !localStorage.getItem('voting_agent_lang')) {
          setLanguage(prefs.language);
          localStorage.setItem('voting_agent_lang', prefs.language);
        }
      });
    });
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      AudioEngine.unlock();
      // Remove listener after first interaction to avoid overhead
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    localStorage.setItem('voting_agent_muted', newMute);
    if (newMute) AudioEngine.stop();
  };

  const playScreenAudio = (text) => {
    if (!isMuted) {
      AudioEngine.speak(text, language);
    }
  };

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";
  const appStyle = {
    minHeight: '100vh',
    paddingBottom: '5rem',
    fontFamily: activeFont,
    backgroundColor: highContrast ? '#000000' : '#F9F9F9',
    color: highContrast ? '#ffffff' : '#1A1C1C',
  };

  return (
    <div style={appStyle}>
      {/* ── SKIP NAVIGATION (Accessibility) ────────────────────── */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: '-40px', left: '1rem', zIndex: 999,
          background: '#FF6B00', color: '#fff', padding: '8px 16px',
          borderRadius: '4px', fontWeight: 700, fontSize: '14px',
          textDecoration: 'none',
          transition: 'top 0.2s',
        }}
        onFocus={e => (e.target.style.top = '8px')}
        onBlur={e => (e.target.style.top = '-40px')}
      >
        Skip to main content
      </a>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={headerStyle}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => { navigate('/'); playScreenAudio('Home Screen'); }}
        >
          <div style={{
            width: '2.1rem', height: '2.1rem',
            backgroundColor: '#FF6B00',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: '1.1rem',
          }}>
            🗳️
          </div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0D1B4B', fontFamily: activeFont }}>
            Matdaata Mitra
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={toggleMute} style={iconBtnStyle} aria-label={isMuted ? t('aria_unmute', language) : t('aria_mute', language)}>
            {isMuted
              ? <VolumeX size={22} style={{ color: '#6B7280' }} />
              : <Speaker size={22} style={{ color: '#FF6B00' }} />
            }
          </button>
          <button onClick={() => navigate('/settings')} style={iconBtnStyle} aria-label={t('aria_settings', language)}>
            <SettingsIcon size={22} style={{ color: '#0D1B4B' }} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main id="main-content" style={{ maxWidth: location.pathname === '/' || location.pathname === '/language' ? '1200px' : '480px', margin: '0 auto', position: 'relative', minHeight: 'calc(100vh - 72px)' }}>
        <Routes>
          <Route path="/" element={!language ? <LanguageSelect setLanguage={setLanguage} playAudio={playScreenAudio} /> : <Home isSirActive={isSirActive} playAudio={playScreenAudio} language={language} />} />
          <Route path="/language" element={<LanguageSelect setLanguage={setLanguage} playAudio={playScreenAudio} />} />
          <Route path="/search" element={<ElectoralRollSearch playAudio={playScreenAudio} language={language} />} />
          <Route path="/register" element={<RegisterAI back={() => navigate('/')} playAudio={playScreenAudio} language={language} />} />
          <Route path="/update" element={<RegisterAI back={() => navigate('/')} playAudio={playScreenAudio} language={language} />} />
          <Route path="/voter-id" element={<VoterID back={() => navigate('/')} playAudio={playScreenAudio} language={language} />} />
          <Route path="/voting-day" element={<VotingDay back={() => navigate('/')} playAudio={playScreenAudio} language={language} />} />
          <Route path="/evm" element={<EVMSimulator playAudio={playScreenAudio} language={language} />} />
          <Route path="/help" element={<HelpCenter playAudio={playScreenAudio} language={language} />} />
          <Route path="/results" element={<ElectionResults playAudio={playScreenAudio} language={language} />} />
          <Route path="/settings" element={<Settings highContrast={highContrast} setHighContrast={setHighContrast} fontSize={fontSize} setFontSize={setFontSize} playAudio={playScreenAudio} language={language} />} />
          <Route path="/assistant" element={<VoiceAssistant playAudio={playScreenAudio} language={language} />} />
        </Routes>
      </main>

      {/* ── REPLAY AUDIO BUTTON ─────────────────────────────── */}
      {!isMuted && (
        <button
          onClick={() => playScreenAudio(t('tap_anything_audio', language))}
          style={replayBtnStyle}
          aria-label={t('aria_replay', language)}
        >
          <Speaker size={28} />
        </button>
      )}
    </div>
  );
}

export default App;
