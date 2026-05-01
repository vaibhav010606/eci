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
    playAudio(`You voted for ${candidate.name}. In the real booth, your vote is now recorded.`);
    setTimeout(() => setBeeping(false), 3000);
  };

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  return (
    <div style={{ fontFamily: activeFont, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, color: '#000080', textAlign: 'center' }}>
        {t('evm_title', language)}
      </h2>
      <p style={{ margin: '0 0 2rem', fontSize: '1rem', color: '#767684', textAlign: 'center', fontWeight: 600 }}
         onClick={() => playAudio("This is safe. No real vote is cast. Tap a blue button to practice.")}>
        This is safe. No real vote is cast. Tap a blue button to practice.
      </p>

      {/* EVM Control Unit */}
      <div style={{
        background: '#1F2937', padding: '1.5rem', borderRadius: '1.25rem',
        width: '100%', maxWidth: '24rem', border: '4px solid #4B5563',
        boxShadow: '0 12px 24px -8px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        {/* Lights */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '1rem', height: '1rem', borderRadius: '9999px', backgroundColor: !voted ? '#22C55E' : '#4B5563', boxShadow: !voted ? '0 0 10px #22C55E' : 'none' }}></div>
            <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>Ready</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '1rem', height: '1rem', borderRadius: '9999px', backgroundColor: beeping ? '#EF4444' : '#4B5563', boxShadow: beeping ? '0 0 15px #EF4444' : 'none' }}></div>
            <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>Busy</span>
          </div>
        </div>

        {/* Ballot Unit List */}
        <div style={{ background: '#E5E7EB', borderRadius: '0.75rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.5rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #D1D5DB' }}>
              <div style={{ width: '1.5rem', textAlign: 'center', fontWeight: 800, color: '#9CA3AF', borderRight: '1px solid #E5E7EB', paddingRight: '0.5rem' }}>{i + 1}</div>
              <div style={{ flex: 1, padding: '0 0.5rem' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.875rem', color: '#1F2937', textTransform: 'uppercase' }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase' }}>{c.party}</p>
              </div>
              <div style={{ width: '2.5rem', height: '2.5rem', border: '1px solid #9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: '#F9FAFB' }}>
                {c.symbol}
              </div>
              <button 
                onClick={() => handleVote(c)}
                disabled={voted !== null}
                style={{
                  width: '3rem', height: '2.5rem', borderRadius: '9999px 0.375rem 0.375rem 9999px',
                  background: voted === c.id ? '#2563EB' : '#3B82F6', border: '2px solid #9CA3AF',
                  cursor: 'pointer', opacity: voted !== null && voted !== c.id ? 0.5 : 1
                }}
              ></button>
            </div>
          ))}
        </div>
      </div>

      {voted && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ background: '#138808', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontWeight: 800, marginBottom: '1rem', boxShadow: '0 4px 12px rgba(19,136,8,0.3)' }}>
            Vote Recorded Successfully!
          </div>
          <button 
            onClick={() => { setVoted(null); playAudio("Practice again."); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', background: '#EFF6FF', color: '#000080', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', fontFamily: activeFont }}
          >
            <RefreshCcw size={20} /> Practice Again
          </button>
        </motion.div>
      )}

      {/* Real ECI Links CTA */}
      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB', width: '100%', maxWidth: '24rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#767684', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Official Resources
        </p>
        <button
          onClick={() => openECILink(ECI_LINKS.ictApps, 'Official ECI EVM Resources', playAudio)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: '#ffffff', border: '2px solid #E5E7EB', color: '#000080', fontWeight: 800,
            padding: '1rem', borderRadius: '1.25rem', cursor: 'pointer', transition: 'border-color 0.2s',
            fontFamily: activeFont
          }}
        >
          <ExternalLink size={18} /> Official EVM Resources (ECI)
        </button>
      </div>
    </div>
  );
}
