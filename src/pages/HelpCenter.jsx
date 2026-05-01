import React, { useState, useEffect } from 'react';
import {
  PhoneCall, Mail, Globe, Calendar, Mic, ChevronRight,
  AlertTriangle, Smartphone, BarChart2, Wifi, WifiOff,
  Shield, HelpCircle
} from 'lucide-react';
import { ECI_LINKS, ECI_CONTACTS, ECI_AUDIO, openECILink } from '../utils/eciLinks';
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    playAudio('Help and Complaints. Tap any option for assistance.');
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  const open = (url, label, audio) => {
    if (audio) playAudio(audio);
    openECILink(url, label, playAudio);
  };

  return (
    <div style={{ fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif", backgroundColor: '#F9F9F9', minHeight: '100vh', padding: '1.5rem 1.25rem 6rem' }}>

      {/* Offline Banner */}
      {!isOnline && (
        <div style={{ background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '0.875rem', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <WifiOff size={22} style={{ color: '#DC2626', flexShrink: 0 }} />
          <p style={{ margin: 0, fontWeight: 600, color: '#991B1B', fontSize: '0.9rem' }}>
            You are offline. ECI portals require internet. Practice Booth and FAQs still work.
          </p>
        </div>
      )}

      <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.75rem', fontWeight: 800, color: NAVY }}>{t('help_title', language)}</h2>

      {/* ── ASK BY VOICE ───────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a1a8c 100%)`,
        borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem',
        boxShadow: '0 6px 20px rgba(0,0,128,0.25)',
      }}>
        <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>Ask any voting question</p>
        <button
          onClick={() => playAudio('Tap to speak your question. I will answer it for you.')}
          style={{
            width: '5rem', height: '5rem', borderRadius: '9999px',
            background: SAFFRON, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem',
            boxShadow: '0 4px 16px rgba(255,153,51,0.5)',
          }}
        >
          <Mic size={40} color="#ffffff" />
        </button>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0 }}>Tap the mic and speak</p>
      </div>

      {/* ── IMMEDIATE CONTACT OPTIONS ─────────────────── */}
      <p style={{ fontWeight: 700, color: NAVY, fontSize: '1rem', margin: '0 0 0.75rem' }}>📞 Contact ECI Directly</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <LinkButton
          icon={PhoneCall} label="Call 1950" sublabel="Free ECI Helpline"
          color={GREEN}
          onPress={() => { playAudio(ECI_AUDIO.helpline); openECILink(ECI_LINKS.helpline, 'ECI Helpline 1950', null); }}
        />
        <LinkButton
          icon={Mail} label="Email ECI" sublabel="complaints@eci.gov.in"
          color={SAFFRON}
          onPress={() => open(ECI_LINKS.complaintsEmail, 'Email Complaint', ECI_AUDIO.email)}
        />
        <LinkButton
          icon={Globe} label="File Online Complaint" sublabel="NGSP Portal"
          color={NAVY}
          onPress={() => open(ECI_LINKS.ngsp, 'NGSP Grievance Portal', ECI_AUDIO.grievance)}
        />
        <LinkButton
          icon={Calendar} label="Book BLO Call" sublabel="Meet your Officer"
          color="#7C3AED"
          onPress={() => open(ECI_LINKS.eciNet, 'Book BLO Call', ECI_AUDIO.blo)}
        />
      </div>

      {/* ── QUICK LINKS ───────────────────────────────── */}
      <p style={{ fontWeight: 700, color: NAVY, fontSize: '1rem', margin: '0 0 0.75rem' }}>🔗 Quick Links</p>
      <div style={{ background: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {[
          { icon: Globe,       label: 'ECI Official Website',    sub: 'eci.gov.in',                url: ECI_LINKS.eciMain,         audio: null },
          { icon: Globe,       label: 'Voters Service Portal',   sub: 'voters.eci.gov.in',         url: ECI_LINKS.vsp,             audio: null },
          { icon: BarChart2,   label: 'Election Results',        sub: 'results.eci.gov.in',        url: ECI_LINKS.results,         audio: null },
          { icon: Globe,       label: 'My State CEO Office',     sub: 'All state CEO contacts',    url: ECI_LINKS.allCEOs,         audio: null },
          { icon: Smartphone,  label: 'Download Voter Helpline App', sub: 'Google Play Store',     url: ECI_LINKS.voterHelplineApp,audio: null },
          { icon: AlertTriangle, label: 'Report MCC Violation (cVIGIL)', sub: 'Citizen reporting', url: ECI_LINKS.cVigilApp,       audio: null },
          { icon: Shield,      label: 'Know Your Candidate',     sub: 'KYC App',                   url: ECI_LINKS.kycApp,          audio: null },
          { icon: Globe,       label: 'NVSP Legacy Portal',      sub: 'nvsp.in',                   url: ECI_LINKS.nvsp,            audio: null },
        ].map((item, i, arr) => (
          <button
            key={item.label}
            onClick={() => open(item.url, item.label, item.audio)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%',
              padding: '0.875rem 1.25rem', border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <item.icon size={20} style={{ color: NAVY, flexShrink: 0 }} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{item.label}</p>
              <p style={{ margin: 0, color: '#767684', fontSize: '0.75rem' }}>{item.sub}</p>
            </div>
            <ChevronRight size={18} style={{ color: '#c6c5d5' }} />
          </button>
        ))}
      </div>

      {/* ── FAQs ──────────────────────────────────────── */}
      <p style={{ fontWeight: 700, color: NAVY, fontSize: '1rem', margin: '0 0 0.75rem' }}>❓ Frequently Asked Questions</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff', border: '2px solid #e0e0e0',
              borderRadius: '0.875rem', overflow: 'hidden',
            }}
          >
            <button
              onClick={() => { setOpenFaq(openFaq === i ? null : i); playAudio(faq.a); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem 1.25rem', border: 'none', background: 'transparent', cursor: 'pointer',
              }}
            >
              <HelpCircle size={18} style={{ color: SAFFRON, flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: 'left', fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{faq.q}</span>
              <ChevronRight size={16} style={{ color: '#c6c5d5', transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 1.25rem 1rem', color: '#464653', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ECI Helpline Note */}
      <div style={{
        background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '0.875rem',
        padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      }}>
        <PhoneCall size={20} style={{ color: GREEN, flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>
          <strong>1950</strong> — Toll-free ECI Helpline<br />
          {ECI_CONTACTS.helplineHours}<br />
          Available in {ECI_CONTACTS.helplineLanguages}
        </p>
      </div>
    </div>
  );
}
