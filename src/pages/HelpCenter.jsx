import React, { useState, useEffect } from 'react';
import {
  PhoneCall, Mail, Globe, Calendar, Mic, ChevronRight,
  AlertTriangle, Smartphone, BarChart2, Wifi, WifiOff,
  Shield, HelpCircle
} from 'lucide-react';
import { ECI_LINKS, getEciContacts, openECILink } from '../utils/eciLinks';
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
const GREEN = '#138808';

const faqs = [
  { q: 'What time do polls open?', a: 'Polling booths open at 7 AM and close at 6 PM on election day.' },
  { q: 'What ID do I need at the booth?', a: 'You need your Voter ID card. If lost, you can also use Aadhaar, PAN card, or passport as alternate photo ID.' },
  { q: 'What is NOTA?', a: 'NOTA means None Of The Above. It is the last option on the EVM if you do not want to vote for any candidate.' },
  { q: 'How do I check my name on the voter list?', a: 'Go to electoralsearch.eci.gov.in and enter your name and state. Or call 1950 for free help.' },
  { q: 'What if my name is missing from the voter list?', a: 'Fill Form 6 online at voters.eci.gov.in to register. You can also call 1950 or visit your nearest Booth Level Officer.' },
  { q: 'Can I vote if I move to a new address?', a: 'Yes. Fill Form 8 online at voters.eci.gov.in to update your address and get transferred to the correct booth.' },
];

function LinkButton({ icon: Icon, label, sublabel, url, onPress, color }) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '0.5rem',
        background: '#ffffff', border: `2px solid #e0e0e0`,
        borderRadius: '1rem', padding: '1rem 0.75rem',
        cursor: 'pointer', width: '100%',
        transition: 'border-color 0.15s ease',
      }}
    >
      <Icon size={30} style={{ color: color || NAVY }} />
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: NAVY, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
      {sublabel && <span style={{ fontSize: '0.75rem', color: '#767684', textAlign: 'center' }}>{sublabel}</span>}
    </button>
  );
}

export default function HelpCenter({ playAudio, language }) {
  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";
  const [openFaq, setOpenFaq] = useState(null);

  const HELP_ACTIONS = [
    { id: 'helpline', label: "Call ECI Helpline", sub: "Toll-free 1950", icon: "📞", url: ECI_LINKS.helpline, color: '#0A7A3E' },
    { id: 'grievance', label: "NGS Portal", sub: "File a formal complaint", icon: "⚖️", url: ECI_LINKS.ngsp, color: '#0D1B4B' },
    { id: 'ceos', label: "CEO Directory", sub: "Contact state officers", icon: "📁", url: ECI_LINKS.ceosDir, color: '#6B7280' },
  ];

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh', padding: '1.5rem 1.25rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, color: '#0D1B4B', textAlign: 'center' }}>
        {t('help_complaints', language)}
      </h2>

      {/* AI Assistant Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B4B 0%, #1a1a3a 100%)', borderRadius: '16px', padding: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>
          {t('ask_ai_help', language) || "Ask Matdaata Mitra anything about voting"}
        </p>
        <button
          onClick={() => playAudio(t('ask_voice_audio', language))}
          style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: '#FF6B00', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 4px 12px rgba(255,107,0,0.3)', cursor: 'pointer'
          }}
        >
          <Mic size={24} color="#FFFFFF" />
        </button>
      </div>

      {/* Immediate Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
        {HELP_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => openECILink(action.url, action.label, playAudio, language)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              background: '#FFFFFF', border: '1px solid #E2E6F0', borderRadius: '12px',
              padding: '16px', cursor: 'pointer', textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '24px' }}>{action.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: action.color }}>{action.label}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{action.sub}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>→</span>
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      <p style={{ fontWeight: 700, color: '#0D1B4B', fontSize: '14px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('faqs_title', language)}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E6F0', borderRadius: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => { setOpenFaq(openFaq === i ? null : i); playAudio(faq.a); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              <HelpCircle size={18} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 700, color: '#0D1B4B', fontSize: '13.5px' }}>{faq.q}</span>
              <ChevronRight size={16} style={{ color: '#9CA3AF', transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 14px 14px', color: '#464653', fontSize: '13px', lineHeight: 1.5 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
