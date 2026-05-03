import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit3, Inbox, Gamepad2, Bell, CreditCard, BarChart2, Mic, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';
import AgentChatBox from '../components/AgentChatBox';
import PropTypes from 'prop-types';

Home.propTypes = {
  isSirActive: PropTypes.bool.isRequired,
  playAudio: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

export default function Home({ isSirActive, playAudio, language }) {
  const navigate = useNavigate();
  const font = LANG_FONTS[language] || "'Public Sans', sans-serif";

  useEffect(() => {
    playAudio(t('welcome', language));
  }, [language]);

  const tiles = [
    { id: 'search',     title: t('check_name', language),      icon: Search,    path: '/search',   audio: t('search_audio', language), color: '#1565C0', bg: '#E3F0FF' },
    { id: 'register',   title: t('register_update', language),  icon: Edit3,     path: '/register', audio: t('register_audio', language), color: '#0A7A3E', bg: '#E8F5EE' },
    { id: 'voting_day', title: t('voting_day', language),       icon: Inbox,     path: '/voting-day', audio: t('voting_day_audio', language), color: '#FF6B00', bg: '#FFF3E8' },
    { id: 'results',    title: t('past_results', language),     icon: BarChart2, path: '/results',  audio: t('results_audio', language), color: '#6A1B9A', bg: '#F3E5F5' },
    { id: 'practice',   title: t('practice_voting', language),  icon: Gamepad2,  path: '/evm',      audio: t('practice_audio', language), color: '#00695C', bg: '#E0F2F1' },
    { id: 'help',       title: t('help_complaints', language),  icon: Bell,      path: '/help',     audio: t('help_audio', language), color: '#C62828', bg: '#FFEBEE' },
    { id: 'id_card',    title: t('my_voter_id', language),      icon: CreditCard,path: '/voter-id',   audio: t('id_card_audio', language), color: '#0D1B4B', bg: '#EEF0F8' },
  ];

  return (
    <div style={{ fontFamily: font, backgroundColor: '#F5F6FA', minHeight: '100vh' }}>
      <div className="home-layout">
        <div className="home-left">
          {/* ── GOLD ALERT BANNER ──────────────────────────────── */}
          {isSirActive && (
            <div
              className="saffron-banner cursor-pointer"
              onClick={() => {
                playAudio(t('banner_audio', language));
                navigate('/search');
              }}
              style={{ marginBottom: '1.5rem', borderRadius: '12px', background: '#F9A825', padding: '12px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '22px' }}>📢</span>
                <div>
                  <p style={{ fontFamily: font, fontWeight: 700, fontSize: '13px', color: '#0D1B4B', margin: 0, letterSpacing: '0.04em' }}>
                    {t('voter_drive_active', language).toUpperCase()}
                  </p>
                  <p style={{ fontFamily: font, fontWeight: 500, fontSize: '12px', color: '#0D1B4B', margin: '2px 0 0', opacity: 0.8 }}>
                    {t('tap_check_name', language)}
                  </p>
                </div>
              </div>
              <button className="banner-btn" style={{ fontFamily: font, background: '#0D1B4B', color: '#FFFFFF', padding: '8px 14px' }} onClick={e => e.stopPropagation()}>
                {t('check_now', language)}
              </button>
            </div>
          )}

          {/* ── PAGE CONTENT ─────────────────────────────────────── */}
          <div>
            {/* App Brand + Voice Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '100%' }}>
                <h1 style={{ fontFamily: font, margin: 0, fontSize: '26px', fontWeight: 800, color: '#0D1B4B' }}>
                  Matdaata Mitra
                </h1>
                <p style={{ fontFamily: font, margin: '4px 0 0', fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
                  Your Guide to Voting in India
                </p>
              </div>
              <button
                onClick={() => navigate('/assistant')}
                style={{
                  position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                  width: '42px', height: '42px', borderRadius: '50%',
                  backgroundColor: '#FF6B00', color: '#ffffff',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(255,107,0,0.35)', cursor: 'pointer'
                }}
                className="mobile-only-mic"
              >
                <Mic size={20} />
              </button>
            </div>

            {/* ── GRID OF TILES ──────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {tiles.map((tile, i) => {
                const Icon = tile.icon;
                return (
                  <motion.button
                    key={tile.id}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    onClick={() => { playAudio(tile.audio); setTimeout(() => navigate(tile.path), 1200); }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '18px 10px 14px', border: `1.5px solid ${tile.color}33`, borderRadius: '14px',
                      cursor: 'pointer', background: tile.bg, position: 'relative'
                    }}
                    aria-label={tile.title}
                  >
                    <Icon size={28} style={{ color: tile.color, marginBottom: '8px' }} strokeWidth={2.5} />
                    <span style={{ fontFamily: font, fontWeight: 700, fontSize: '13px', color: tile.color, textAlign: 'center', lineHeight: 1.2 }}>
                      {tile.title}
                    </span>
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '14px', opacity: 0.5, color: tile.color }}>→</span>
                  </motion.button>
                );
              })}
            </div>

            {/* ── DISCLAIMER ──────────────────────────────────── */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#ffffff', border: '1.5px solid #e0e0e0', borderRadius: '0.875rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <Info size={16} style={{ color: '#767684', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#767684', lineHeight: 1.6, fontWeight: 500 }}>
                {t('eci_disclaimer_full', language)}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: AGENT CHAT BOX ───────────────────── */}
        <div className="home-right">
          <AgentChatBox playAudio={playAudio} language={language} />
        </div>
      </div>
    </div>
  );
}
