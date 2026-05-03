import React, { useState } from 'react';
import { Mic, Search, MapPin, CheckCircle2, Loader2, ExternalLink, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

export default function ElectoralRollSearch({ playAudio, language }) {
  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  const ACTIONS = [
    { id: 'details', label: t('search_by_details', language) || "Search by Name / Details", icon: "🔍", url: ECI_LINKS.electoralSearch, color: '#1565C0' },
    { id: 'epic', label: t('search_by_epic', language) || "Search by EPIC Number", icon: "🎫", url: ECI_LINKS.electoralSearch, color: '#0D1B4B' },
    { id: 'roll', label: t('download_roll', language) || "Download Electoral Roll", icon: "📄", url: ECI_LINKS.downloadEroll, color: '#6B7280' },
  ];

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh', padding: '1.5rem 1.25rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, color: '#0D1B4B', textAlign: 'center' }}>
        {t('check_name', language)}
      </h2>
      <p style={{ margin: '0 0 2rem', fontSize: '14px', color: '#6B7280', textAlign: 'center', fontWeight: 600 }}>
        {t('search_intro_text', language) || "Find your name in the official Voter List and check your polling station."}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => openECILink(action.url, action.label, playAudio, language)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              background: '#FFFFFF', border: '1px solid #E2E6F0', borderRadius: '12px',
              padding: '16px', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <span style={{ fontSize: '24px' }}>{action.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: action.color }}>{action.label}</span>
            <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>→</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', borderTop: '1px solid #E2E6F0', paddingTop: '1.5rem' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {t('official_portal_disclaimer', language) || "SECURE OFFICIAL ECI PORTAL"}
        </p>
        <button
          onClick={() => openECILink(ECI_LINKS.vsp, 'ECI Portal', playAudio, language)}
          style={{
            width: '100%', padding: '14px', background: 'transparent', border: '1.5px solid #0D1B4B',
            borderRadius: '12px', color: '#0D1B4B', fontWeight: 700, marginTop: '12px', cursor: 'pointer'
          }}
        >
          {t('visit_vsp', language) || "Visit Voters' Services Portal"}
        </button>
      </div>
    </div>
  );
}
