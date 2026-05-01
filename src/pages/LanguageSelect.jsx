import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LANG_FONTS, OFFICIAL_LANGUAGES } from '../utils/constants';

export default function LanguageSelect({ setLanguage, playAudio }) {
  const navigate = useNavigate();

  const selectLang = (code) => {
    setLanguage(code);
    localStorage.setItem('voting_agent_lang', code);
    // Brief audio feedback in the chosen language if possible, 
    // but usually a simple "OK" or silence is fine as we navigate immediately.
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#000080', minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Choose Language</h1>
        <p style={{ color: '#ffffff', opacity: 0.8, fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>भाषा चुनें / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {OFFICIAL_LANGUAGES.map((lang) => (
          <motion.button
            key={lang.code}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectLang(lang.code)}
            style={{
              background: '#ffffff',
              border: 'none',
              borderRadius: '1.25rem',
              padding: '1.25rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              fontFamily: LANG_FONTS[lang.code] || "'Public Sans', sans-serif"
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000080' }}>
              {lang.native}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#767684', textTransform: 'uppercase' }}>
              {lang.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
