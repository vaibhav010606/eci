import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit3, Inbox, Gamepad2, Bell, CreditCard, BarChart2, Mic, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_DISCLAIMER } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

export default function Home({ isSirActive, playAudio, language }) {
  const navigate = useNavigate();
  const font = LANG_FONTS[language] || "'Public Sans', sans-serif";

  useEffect(() => {
    playAudio(t('welcome', language));
  }, [language]);

  const tiles = [
    { id: 'search',     title: t('check_name', language),      icon: Search,    path: '/search',   audio: t('search_audio', language) },
    { id: 'register',   title: t('register_update', language),  icon: Edit3,     path: '/register', audio: t('register_audio', language) },
    { id: 'voting_day', title: t('voting_day', language),       icon: Inbox,     path: '/help',     audio: t('voting_day_audio', language) },
    { id: 'results',    title: t('past_results', language),     icon: BarChart2, path: '/results',  audio: t('results_audio', language) },
    { id: 'practice',   title: t('practice_voting', language),  icon: Gamepad2,  path: '/evm',      audio: t('practice_audio', language) },
    { id: 'help',       title: t('help_complaints', language),  icon: Bell,      path: '/help',     audio: t('help_audio', language) },
    { id: 'id_card',    title: t('my_voter_id', language),      icon: CreditCard,path: '/search',   audio: t('id_card_audio', language) },
  ];

  return (
    <div style={{ fontFamily: font, backgroundColor: '#F9F9F9', minHeight: '100vh' }}>

      {/* ── SAFFRON ALERT BANNER ──────────────────────────────── */}
      {isSirActive && (
        <div
          className="saffron-banner cursor-pointer"
          onClick={() => {
            playAudio(t('banner_audio', language));
            navigate('/search');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={28} style={{ color: '#000080', flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: font, fontWeight: 800, fontSize: '1rem', color: '#000080', margin: 0, lineHeight: 1.2 }}>
                {t('voter_drive_active', language)}
              </p>
              <p style={{ fontFamily: font, fontWeight: 600, fontSize: '0.85rem', color: '#000080', margin: '2px 0 0', opacity: 0.8 }}>
                {t('tap_check_name', language)}
              </p>
            </div>
          </div>
          <button className="banner-btn" style={{ fontFamily: font }} onClick={e => e.stopPropagation()}>
            {t('check_now', language)}
          </button>
        </div>
      )}

      {/* ── PAGE CONTENT ─────────────────────────────────────── */}
      <div style={{ padding: '1.5rem 1.25rem' }}>

        {/* App Brand + Voice Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: font, margin: 0, fontSize: '2rem', fontWeight: 800, color: '#000080', lineHeight: 1 }}>
              {t('title', language)}
            </h1>
            <p style={{ fontFamily: font, margin: '0.25rem 0 0', fontSize: '1rem', color: '#767684', fontWeight: 500 }}>
              {t('subtitle', language)}
            </p>
          </div>
          <button
            onClick={() => navigate('/assistant')}
            style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '9999px',
              backgroundColor: '#000080', color: '#ffffff',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,128,0.3)', cursor: 'pointer'
            }}
          >
            <Mic size={24} />
          </button>
        </div>

        {/* ── GRID OF TILES ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {tiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <motion.button
                key={tile.id}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => { playAudio(tile.audio); setTimeout(() => navigate(tile.path), 1200); }}
                className="voting-tile"
                aria-label={tile.title}
              >
                <Icon size={44} strokeWidth={2} />
                <span style={{ fontFamily: font, fontWeight: 700, fontSize: '1rem', textAlign: 'center', lineHeight: 1.3 }}>
                  {tile.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ── DISCLAIMER ──────────────────────────────────── */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#F9F9F9', border: '1.5px solid #e0e0e0', borderRadius: '0.875rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
          <Info size={16} style={{ color: '#767684', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#767684', lineHeight: 1.6, fontWeight: 500 }}>
            {APP_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
