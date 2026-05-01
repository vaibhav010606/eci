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
    playAudio('Past Election Results. Tap any chart for details. Tap the link below for live results.');
  }, []);

  return (
    <div style={{ fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif", backgroundColor: '#F9F9F9', minHeight: '100vh', padding: '1.5rem 1.25rem 6rem' }}>

      <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.75rem', fontWeight: 800, color: NAVY }}
          onClick={() => playAudio(t('results_title', language))}>
        {t('results_title', language)}
      </h2>

      {/* Live results CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a1a8c 100%)`,
        borderRadius: '1.25rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <div>
          <p style={{ margin: 0, color: SAFFRON, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live &amp; Latest</p>
          <p style={{ margin: '0.2rem 0 0', color: '#ffffff', fontWeight: 700, fontSize: '1.05rem' }}>Official ECI Results Portal</p>
        </div>
        <button
          onClick={() => openECILink(ECI_LINKS.results, 'Election Results Portal', playAudio)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: SAFFRON, color: NAVY, border: 'none',
            borderRadius: '0.625rem', padding: '0.625rem 1rem',
            fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ExternalLink size={16} /> Open
        </button>
      </div>

      {/* Bar Chart — Seats */}
      <div style={{ background: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <p style={{ margin: '0 0 1rem', fontWeight: 700, color: NAVY, cursor: 'pointer' }}
           onClick={() => playAudio('Seats won by each party')}>
          Seats Won (Sample Data)
        </p>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontFamily: 'Public Sans', fontSize: 12 }} />
              <YAxis tick={{ fontFamily: 'Public Sans', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart — Vote Share */}
      <div style={{ background: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '1.25rem', padding: '1.25rem' }}>
        <p style={{ margin: '0 0 1rem', fontWeight: 700, color: NAVY, cursor: 'pointer' }}
           onClick={() => playAudio('Vote share percentage by party')}>
          Vote Share (%)
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
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p style={{ margin: '1rem 0 0', textAlign: 'center', fontSize: '0.8rem', color: '#767684', fontWeight: 500 }}>
        Chart shows sample data only. For real results, visit results.eci.gov.in
      </p>
    </div>
  );
}
