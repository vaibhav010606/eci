import React from 'react';
import { Check, Settings as SettingsIcon, Bell, Shield, Type, MonitorSmartphone, Info } from 'lucide-react';
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


const SECTION_GAP = '1.25rem';
const NAVY = '#000080';
const SAFFRON = '#FF9933';
const GREEN = '#138808';

function SectionIcon({ icon: Icon }) {
  return <Icon size={26} style={{ color: NAVY, flexShrink: 0 }} />;
}

export default function Settings({ highContrast, setHighContrast, fontSize, setFontSize, playAudio, language }) {
  const fontSizes = [
    { id: 'small',       label: 'Small',       size: '0.875rem' },
    { id: 'medium',      label: 'Normal',      size: '1rem'     },
    { id: 'large',       label: 'Large',       size: '1.25rem'  },
    { id: 'extra-large', label: 'Extra Large', size: '1.5rem'   },
  ];

  return (
    <div
      style={{
        fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif",
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
        padding: '1.5rem 1.25rem 6rem',
      }}
    >
      {/* Page Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', cursor: 'default' }}
        onClick={() => playAudio(t('settings_title', language))}
      >
        <SettingsIcon size={30} style={{ color: NAVY }} />
        <h2 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, color: NAVY }}>{t('settings_title', language)}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>

        {/* ── HIGH CONTRAST TOGGLE ──────────────────────────── */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <SectionIcon icon={MonitorSmartphone} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>High Contrast Mode</p>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 500, fontSize: '0.875rem', color: '#464653' }}>
                  Make colours more distinct &amp; borders thicker
                </p>
              </div>
            </div>
            <button
              className={`toggle-track ${highContrast ? 'on' : 'off'}`}
              onClick={() => {
                const next = !highContrast;
                setHighContrast(next);
                localStorage.setItem('voting_agent_hc', next);
                playAudio(`High contrast mode ${next ? 'enabled' : 'disabled'}`);
              }}
              aria-label="Toggle High Contrast Mode"
              aria-checked={highContrast}
              role="switch"
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>

        {/* ── TEXT SIZE SELECTOR ────────────────────────────── */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <SectionIcon icon={Type} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>Text Size</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {fontSizes.map(opt => {
              const selected = fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`font-option ${selected ? 'selected' : ''}`}
                  onClick={() => {
                    setFontSize(opt.id);
                    localStorage.setItem('voting_agent_fs', opt.id);
                    playAudio(`${opt.label} text size selected`);
                  }}
                >
                  <span style={{ fontWeight: 700, color: NAVY, fontSize: opt.size }}>
                    {opt.label}
                  </span>
                  {selected && <Check size={22} style={{ color: NAVY }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── VOICE NOTIFICATIONS (display-only) ─────────────── */}
        <div className="settings-card" style={{ opacity: 0.75 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <SectionIcon icon={Bell} />
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>Voice Notifications</p>
            </div>
            <div className="toggle-track on" style={{ pointerEvents: 'none' }}>
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>

        {/* ── PRIVACY & DATA (display-only) ─────────────────── */}
        <div className="settings-card" style={{ opacity: 0.75 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <SectionIcon icon={Shield} />
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>Privacy &amp; Data</p>
            </div>
            <span style={{
              background: '#EEEEEE',
              color: '#767684',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.35rem 0.875rem',
              borderRadius: '0.5rem',
            }}>
              Manage
            </span>
          </div>
        </div>

      </div>

      {/* ── DISCLAIMER ─────────────────────────────── */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#F9F9F9', border: '1.5px solid #e0e0e0', borderRadius: '0.875rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
        <Info size={16} style={{ color: '#767684', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#767684', lineHeight: 1.6, fontWeight: 500 }}>
          {t('eci_disclaimer_full', language)}
        </p>
      </div>
    </div>
  );
}
