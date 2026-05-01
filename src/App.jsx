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
import AudioEngine from './utils/AudioEngine';
import { t } from './utils/translations';
import { LANG_FONTS } from './utils/constants';

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '2px solid #E0E0E0',
  height: '72px',
  padding: '0 1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const iconBtnStyle = {
  padding: '0.625rem',
  borderRadius: '9999px',
  border: 'none',
  backgroundColor: '#F3F3F4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const replayBtnStyle = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  width: '3.75rem',
  height: '3.75rem',
  backgroundColor: '#000080',
  color: '#ffffff',
  borderRadius: '9999px',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(0,0,128,0.35)',
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
    }
  }, [language]);

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
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={headerStyle}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
          onClick={() => { navigate('/'); playScreenAudio('Home Screen'); }}
        >
          <div style={{
            width: '2.5rem', height: '2.5rem',
            backgroundColor: '#FF9933',
            borderRadius: '9999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontWeight: 800, fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(255,153,51,0.4)',
          }}>
            V
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#000080', fontFamily: activeFont }}>
            {t('title', language) || 'Voting Assistant'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggleMute} style={iconBtnStyle} aria-label={isMuted ? t('aria_unmute', language) : t('aria_mute', language)}>
            {isMuted
              ? <VolumeX size={24} style={{ color: '#767684' }} />
              : <Speaker size={24} style={{ color: '#FF9933' }} />
            }
          </button>
          <button onClick={() => navigate('/settings')} style={iconBtnStyle} aria-label={t('aria_settings', language)}>
            <SettingsIcon size={24} style={{ color: '#000080' }} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', minHeight: 'calc(100vh - 72px)' }}>
        <Routes>
          <Route path="/" element={!language ? <LanguageSelect setLanguage={setLanguage} playAudio={playScreenAudio} /> : <Home isSirActive={isSirActive} playAudio={playScreenAudio} language={language} />} />
          <Route path="/language" element={<LanguageSelect setLanguage={setLanguage} playAudio={playScreenAudio} />} />
          <Route path="/search" element={<ElectoralRollSearch playAudio={playScreenAudio} language={language} />} />
          <Route path="/register" element={<FormWizard formType="6" playAudio={playScreenAudio} language={language} />} />
          <Route path="/update" element={<FormWizard formType="8" playAudio={playScreenAudio} language={language} />} />
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
