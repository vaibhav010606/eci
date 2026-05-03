import React from 'react';
import { ArrowLeft, MapPin, Calendar, CheckSquare, Info } from 'lucide-react';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const C = {
  navy: "#0D1B4B",
  gray: "#6B7280",
  border: "#E2E6F0",
  white: "#FFFFFF",
  saffron: "#FF6B00",
  green: "#0A7A3E",
};

export default function VotingDay({ back, playAudio, language }) {
  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  const INFO_CARDS = [
    { icon: <Calendar size={20} />, title: t('election_date_title', language) || "Election Date", text: t('election_date_text', language) || "Check your local holiday / voting date" },
    { icon: <CheckSquare size={20} />, title: t('voting_req_title', language) || "What to Carry", text: t('voting_req_text', language) || "Voter ID or 12 alternative documents" },
  ];

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: '#FFFFFF', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={back} style={{ background: 'none', border: 'none', color: C.saffron, fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={18} /> {t('back', language) || "Back"}
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '16px', color: C.navy }}>
          {t('voting_day', language)}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: '1.5rem 1.25rem' }}>
        <div style={{ background: C.white, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Info size={24} style={{ color: C.saffron }} />
            <h3 style={{ margin: 0, color: C.navy, fontSize: '18px', fontWeight: 800 }}>
              {t('voting_guide_title', language) || "Ready to Vote?"}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {INFO_CARDS.map((card, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ marginTop: '2px', color: C.saffron }}>{card.icon}</div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '15px', color: C.navy, fontWeight: 700 }}>{card.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: C.gray, lineHeight: 1.4 }}>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => openECILink(ECI_LINKS.electoralSearch, 'Find My Booth', playAudio, language)}
          style={{
            width: '100%', padding: '16px', background: C.saffron, color: '#FFFFFF',
            border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,107,0,0.2)',
            marginBottom: '20px'
          }}
        >
          <MapPin size={20} /> {t('find_booth_btn', language) || "Find My Polling Booth"}
        </button>

        {/* Google Maps Embed Integration */}
        <div style={{ background: C.white, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: '20px' }}>
          <div style={{ padding: '12px 16px', background: '#F8F9FA', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.navy, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color={C.saffron} />
            {t('booth_location', language) || "Polling Booth Location"}
          </div>
          <iframe 
            src="https://maps.google.com/maps?q=Election%20Commission%20of%20India,%20Nirvachan%20Sadan,%20Ashoka%20Road,%20New%20Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="220" 
            frameBorder="0" 
            style={{ border: 0, display: 'block' }} 
            allowFullScreen="" 
            aria-hidden="false" 
            tabIndex="0"
            title="Polling Booth Map"
          ></iframe>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => openECILink(ECI_LINKS.ictApps, 'Official Apps', playAudio, language)}
            style={{
              width: '100%', padding: '14px', background: '#FFFFFF', border: `1.5px solid ${C.border}`,
              borderRadius: '12px', color: C.navy, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            📱 {t('download_vha_btn', language) || "Voter Helpline App"}
          </button>
        </div>
      </div>
    </div>
  );
}
