import React, { useState } from 'react';
import { Mic, Search, MapPin, CheckCircle2, Loader2, ExternalLink, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

export default function ElectoralRollSearch({ playAudio, language }) {
  const [status, setStatus] = useState('idle'); // idle | searching | found

  const handleSearch = () => {
    setStatus('searching');
    playAudio(t('search_progress', language));
    setTimeout(() => {
      setStatus('found');
      playAudio(t('search_found', language));
    }, 2200);
  };

  const openRealSearch = () => {
    playAudio(t('search_eci_audio', language));
    openECILink(ECI_LINKS.electoralSearch, 'Electoral Search Portal', null);
  };

  return (
    <div style={{ fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif", backgroundColor: '#F9F9F9', minHeight: '100vh', padding: '1.5rem 1.25rem', paddingBottom: '6rem' }}>

      <h2 style={{ margin: '0 0 2rem', fontSize: '1.75rem', fontWeight: 800, color: '#000080' }}
          onClick={() => playAudio(t('check_name', language))}>
        {t('check_name', language)}
      </h2>

      <AnimatePresence mode="wait">

        {/* ── IDLE STATE ───────────────────────────────────────── */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}
          >
            {/* Big Saffron Mic Button */}
            <button className="mic-btn" onClick={handleSearch} aria-label={t('aria_voice_search', language)}>
              <Mic size={64} strokeWidth={2} />
            </button>

            <p style={{
              margin: '1.5rem 0 2.5rem',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#000080',
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              {t('search_voice_btn', language)}
            </p>

            {/* Text Search Input */}
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '2.5px solid #000080',
              borderRadius: '0.875rem',
              padding: '0.25rem 0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,128,0.08)',
            }}>
              <Search size={22} style={{ color: '#000080', marginLeft: '0.5rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={t('enter_name_placeholder', language)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0.85rem 0.75rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#000080',
                  fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif",
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                style={{
                  background: '#000080',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.625rem',
                  padding: '0.625rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif",
                }}
              >
                {t('search_btn', language)}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SEARCHING STATE ──────────────────────────────────── */}
        {status === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5rem', gap: '1.5rem' }}
          >
            <Loader2
              size={72}
              style={{ color: '#FF9933', animation: 'spin 1s linear infinite' }}
            />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000080', margin: 0 }}>
              {t('search_records', language)}
            </p>
          </motion.div>
        )}

        {/* ── FOUND STATE ──────────────────────────────────────── */}
        {status === 'found' && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="result-card">

              {/* Success Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={40} style={{ color: '#138808', flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#000080' }}>{t('name_found', language)}</h3>
                  <span style={{
                    display: 'inline-block',
                    background: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    marginTop: '0.25rem',
                  }}>
                    ✓ {t('active_voter', language)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="result-field">
                  <label>{t('name_label', language)}</label>
                  <span>Ravi Kumar</span>
                </div>
                <div className="result-field">
                  <label>{t('serial_label', language)}</label>
                  <span>247</span>
                </div>
              </div>

              {/* Booth Box */}
              <div className="booth-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={22} style={{ color: '#000080' }} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#000080' }}>{t('booth_label', language)}</span>
                </div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem', color: '#1e3a6e', lineHeight: 1.5 }}>
                  {t('booth_name', language)}
                </p>
              </div>

              {/* CTA Buttons */}
              <button
                className="btn-saffron"
                style={{ marginTop: '1.5rem' }}
                onClick={() => playAudio(t('saved_success', language))}
              >
                {t('save_details', language)}
              </button>

              {/* Real ECI Portal Link */}
              <button
                onClick={openRealSearch}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', marginTop: '0.75rem',
                  background: '#EFF6FF', color: '#000080', border: '2px solid #BFDBFE',
                  borderRadius: '0.875rem', padding: '0.875rem', fontWeight: 700,
                  fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif",
                }}
              >
                <ExternalLink size={18} /> {t('search_eci_btn', language)}
              </button>

              {/* Download e-EPIC */}
              <button
                onClick={() => openECILink(ECI_LINKS.eEpic, 'Download e-EPIC', playAudio)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', marginTop: '0.625rem',
                  background: 'transparent', color: '#767684', border: 'none',
                  padding: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif",
                }}
              >
                <ExternalLink size={16} /> {t('download_id', language)}
              </button>

              {/* Call helpline */}
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#767684' }}>
                  {t('search_help_btn', language)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
