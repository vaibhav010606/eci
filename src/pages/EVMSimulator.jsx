import React, { useState } from 'react';
import { RefreshCcw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const candidates = [
  { id: 1, name: 'Candidate A', party: 'Party A', symbol: '🌸' },
  { id: 2, name: 'Candidate B', party: 'Party B', symbol: '🐘' },
  { id: 3, name: 'Candidate C', party: 'Party C', symbol: '✋' },
  { id: 4, name: 'NOTA', party: 'None of the Above', symbol: '❌' }
];

export default function EVMSimulator({ playAudio, language }) {
  const [voted, setVoted] = useState(null);
  const [beeping, setBeeping] = useState(false);

  const handleVote = (candidate) => {
    if (voted) return;
    setVoted(candidate.id);
    setBeeping(true);
    playAudio(t('vote_recorded_audio', language, { name: candidate.name }));
    setTimeout(() => setBeeping(false), 3000);
  };

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  return (
    <div style={{ fontFamily: activeFont, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F5F6FA', minHeight: '100vh' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, color: '#0D1B4B', textAlign: 'center' }}>
        {t('evm_title', language)}
      </h2>
      <p style={{ margin: '0 0 2rem', fontSize: '14px', color: '#6B7280', textAlign: 'center', fontWeight: 600 }}
         onClick={() => playAudio(t('evm_intro_text', language))}>
        {t('evm_intro_text', language)}
      </p>

      {/* EVM Machine */}
      <div style={{
        background: '#1a1a2e', padding: '16px 14px', borderRadius: '16px',
        width: '100%', maxWidth: '24rem', border: '3px solid #333',
        boxShadow: '0 12px 24px -8px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        {/* Lights */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: !voted ? '#4CAF50' : '#555', boxShadow: !voted ? '0 0 10px #4CAF50' : 'none' }}></div>
          <span style={{ color: '#aaa', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>BALLOT UNIT — PRACTICE</span>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: beeping ? '#FF6B00' : (voted ? '#4CAF50' : '#555'), boxShadow: beeping ? '0 0 15px #FF6B00' : 'none' }}></div>
        </div>

        {/* Ballot Unit List */}
        <div style={{ background: 'transparent', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#2a2a3e', padding: '10px 12px', borderRadius: '10px' }}>
              <div style={{ width: '32px', textAlign: 'center', fontSize: '22px' }}>{c.symbol}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{c.party}</p>
              </div>
              <button 
                onClick={() => handleVote(c)}
                disabled={voted !== null}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: voted === c.id ? '#FF6B00' : '#ddd', border: '2px solid #555',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: voted === c.id ? '#FFFFFF' : '#333', fontSize: '18px', fontWeight: 700
                }}
              >
                {voted === c.id ? '✓' : '●'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {beeping && (
        <div style={{ background: '#FF6B00', color: '#FFFFFF', borderRadius: '12px', padding: '14px 16px', textAlign: 'center', fontSize: '18px', marginTop: '1.5rem', fontWeight: 700, width: '100%', maxWidth: '24rem' }}>
          🔔 <strong>BEEP!</strong> — Vote Registered
        </div>
      )}

      {voted && !beeping && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '2rem', width: '100%', maxWidth: '24rem' }}>
          <div style={{ background: '#E8F5EE', border: '2px solid #0A7A3E', color: '#0D1B4B', padding: '16px', borderRadius: '12px', fontWeight: 600, marginBottom: '1rem', fontSize: '14px' }}>
            ✅ {t('vote_recorded_success', language)}
          </div>
          <button 
            onClick={() => { setVoted(null); playAudio(t('practice_again_audio', language)); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto', background: '#0D1B4B', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: activeFont }}
          >
            <RefreshCcw size={20} /> {t('practice_again_btn', language)}
          </button>
        </motion.div>
      )}

      {/* Real ECI Links CTA */}
      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E6F0', width: '100%', maxWidth: '24rem' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          {t('official_resources_title', language)}
        </p>
        <button
          onClick={() => openECILink(ECI_LINKS.ictApps, 'Official ECI EVM Resources', playAudio, language)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: '#ffffff', border: `1.5px solid #E2E6F0`, color: '#0D1B4B', fontWeight: 700,
            padding: '14px', borderRadius: '12px', cursor: 'pointer', transition: 'border-color 0.2s',
            fontFamily: activeFont, fontSize: '14px'
          }}
        >
          <ExternalLink size={18} /> {t('official_evm_resources_btn', language)}
        </button>
      </div>
    </div>
  );
}
