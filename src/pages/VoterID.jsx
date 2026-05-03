import React from 'react';
import { ArrowLeft, ExternalLink, Download, FileText, Search } from 'lucide-react';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const C = {
  navy: "#0D1B4B",
  gray: "#6B7280",
  border: "#E2E6F0",
  white: "#FFFFFF",
  saffron: "#FF6B00",
  blue: "#1565C0",
};

export default function VoterID({ back, playAudio, language }) {
  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  const STEPS = [
    { icon: <Search size={20} />, text: t('voter_id_step1', language) || "Search your name in Electoral Roll" },
    { icon: <FileText size={20} />, text: t('voter_id_step2', language) || "Note down your EPIC Number" },
    { icon: <Download size={20} />, text: t('voter_id_step3', language) || "Download from VSP Portal" },
  ];

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: '#FFFFFF', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={back} style={{ background: 'none', border: 'none', color: C.saffron, fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={18} /> {t('back', language) || "Back"}
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '16px', color: C.navy }}>
          {t('my_voter_id', language)}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: '1.5rem 1.25rem' }}>
        <div style={{ background: C.white, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', color: C.navy, fontSize: '18px', fontWeight: 800 }}>
            {t('voter_id_download_title', language) || "Get your digital Voter ID (e-EPIC)"}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step.icon}
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: C.navy, fontWeight: 600 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => openECILink(ECI_LINKS.eEpic, 'Download e-EPIC', playAudio, language)}
          style={{
            width: '100%', padding: '16px', background: C.navy, color: '#FFFFFF',
            border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(13,27,75,0.2)'
          }}
        >
          <Download size={20} /> {t('download_epic_btn', language) || "Download e-EPIC Card"}
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: C.gray, lineHeight: 1.6 }}>
            {t('voter_id_disclaimer', language) || "e-EPIC is a secure PDF version of the Voter ID card that can be downloaded on mobile or in self-printable form on the computer."}
          </p>
        </div>

        <div style={{ marginTop: '2rem', borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {t('more_options', language) || "MORE OPTIONS"}
          </p>
          <button
            onClick={() => openECILink(ECI_LINKS.digiLocker, 'DigiLocker', playAudio, language)}
            style={{
              width: '100%', padding: '14px', background: '#FFFFFF', border: `1.5px solid ${C.border}`,
              borderRadius: '12px', color: C.blue, fontWeight: 700, marginTop: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <ExternalLink size={18} /> {t('get_via_digilocker', language) || "Get via DigiLocker"}
          </button>
        </div>
      </div>
    </div>
  );
}
