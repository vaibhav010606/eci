import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';

// Explicit font per language — guarantees correct script rendering
const LANG_FONTS = {
  en:  "'Public Sans', sans-serif",
  hi:  "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  mr:  "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  ne:  "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  mai: "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  kok: "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  doi: "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  mni: "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  brx: "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  sa:  "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  ks:  "'Noto Sans Devanagari', 'Public Sans', sans-serif",
  bn:  "'Noto Sans Bengali', 'Public Sans', sans-serif",
  as:  "'Noto Sans Bengali', 'Public Sans', sans-serif",
  te:  "'Noto Sans Telugu', 'Public Sans', sans-serif",
  ta:  "'Noto Sans Tamil', 'Public Sans', sans-serif",
  kn:  "'Noto Sans Kannada', 'Public Sans', sans-serif",
  ml:  "'Noto Sans Malayalam', 'Public Sans', sans-serif",
  gu:  "'Noto Sans Gujarati', 'Public Sans', sans-serif",
  pa:  "'Noto Sans Gurmukhi', 'Public Sans', sans-serif",
  or:  "'Noto Sans Odia', 'Public Sans', sans-serif",
  ur:  "'Noto Sans Arabic', 'Public Sans', sans-serif",
  sd:  "'Noto Sans Arabic', 'Public Sans', sans-serif",
  sat: "sans-serif",
};


const NAVY = '#000080';
const SAFFRON = '#FF9933';

const data = [
  { name: 'Party A', seats: 240, color: SAFFRON },
  { name: 'Party B', seats: 99,  color: '#138808' },
  { name: 'Party C', seats: 37,  color: NAVY },
  { name: 'Others',  seats: 167, color: '#A855F7' },
];

export default function ElectionResults({ playAudio, language }) {
  useEffect(() => {
    playAudio(t('results_audio', language));
  }, []);

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh', padding: '1.5rem 1.25rem' }}>

      <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#0D1B4B', textAlign: 'center' }}
          onClick={() => playAudio(t('results_title', language))}>
        {t('results_title', language)}
      </h2>

      {/* Live results CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B4B 0%, #1a1a3a 100%)',
        borderRadius: '16px', padding: '1.5rem', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        boxShadow: '0 4px 12px rgba(13,27,75,0.15)'
      }}>
        <div>
          <p style={{ margin: 0, color: '#FF6B00', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('live_and_latest', language)}</p>
          <p style={{ margin: '2px 0 0', color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{t('official_results_portal', language)}</p>
        </div>
        <button
          onClick={() => openECILink(ECI_LINKS.results, 'Election Results Portal', playAudio, language)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#FF6B00', color: '#FFFFFF', border: 'none',
            borderRadius: '10px', padding: '10px 14px',
            fontWeight: 800, fontSize: '14px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ExternalLink size={18} /> {t('open_btn', language)}
        </button>
      </div>

      {/* Bar Chart — Seats */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E6F0', borderRadius: '16px', padding: '1.5rem', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 1rem', fontWeight: 700, color: '#0D1B4B', cursor: 'pointer' }}
           onClick={() => playAudio(t('seats_won_audio', language))}>
          {t('seats_won_sample', language)}
        </p>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontFamily: 'Public Sans', fontSize: 11, fontWeight: 600 }} />
              <YAxis tick={{ fontFamily: 'Public Sans', fontSize: 11, fontWeight: 600 }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="seats" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart — Vote Share */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E6F0', borderRadius: '16px', padding: '1.5rem' }}>
        <p style={{ margin: '0 0 1rem', fontWeight: 700, color: '#0D1B4B', cursor: 'pointer' }}
           onClick={() => playAudio(t('vote_share_audio', language))}>
          {t('vote_share_sample', language)}
        </p>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="seats" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontFamily: 'Public Sans', fontSize: '12px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p style={{ margin: '1.5rem 0 0', textAlign: 'center', fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
        {t('results_disclaimer', language)}
      </p>
    </div>
  );
}
