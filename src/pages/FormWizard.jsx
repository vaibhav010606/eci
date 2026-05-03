import React, { useState } from 'react';
import { Mic, CheckCircle, RotateCcw, ExternalLink, Printer, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const NAVY = '#000080';
const SAFFRON = '#FF9933';
const GREEN = '#138808';

// Map formType prop → ECI URLs and form metadata
const FORM_CONFIG = {
  '6':  { title: 'New Voter Registration', url: ECI_LINKS.form6,  pdfUrl: ECI_LINKS.form6Pdf,  audio: 'I am now taking you to the official ECI website to submit Form 6 — New Voter Registration.' },
  '6a': { title: 'NRI Voter Registration', url: ECI_LINKS.form6a, pdfUrl: null,                 audio: 'I am now taking you to the official ECI website to submit Form 6A — Overseas Voter Registration.' },
  '7':  { title: 'Deletion of Name',       url: ECI_LINKS.form7,  pdfUrl: null,                 audio: 'I am now taking you to the official ECI website to submit Form 7 — Deletion of Name.' },
  '8':  { title: 'Correction / Address Update', url: ECI_LINKS.form8, pdfUrl: null,             audio: 'I am now taking you to the official ECI website to submit Form 8 — Correction or Address Update.' },
};

export default function FormWizard({ formType, playAudio, language }) {
  const config = FORM_CONFIG[formType] || FORM_CONFIG['6'];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [tempText, setTempText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const mockAnswers = ['Ravi Kumar', '15 August 1998', 'Ward 4, Mysuru, Karnataka 570001'];

  const BASE_QUESTIONS = [
    { key: 'name',     q: t('q_name', language) },
    { key: 'dob',      q: t('q_dob', language) },
    { key: 'address',  q: t('q_address', language) },
  ];

  const handleRecord = () => {
    setIsRecording(true);
    playAudio(t('listening', language));
    setTimeout(() => {
      const mock = mockAnswers[step] || 'Sample Answer';
      setTempText(mock);
      setIsRecording(false);
      playAudio(t('correction_ask', language, { text: mock }));
    }, 2000);
  };

  const confirmAnswer = () => {
    const updated = { ...answers, [BASE_QUESTIONS[step].key]: tempText };
    setAnswers(updated);
    setTempText('');
    if (step < BASE_QUESTIONS.length - 1) {
      setStep(step + 1);
      playAudio(BASE_QUESTIONS[step + 1].q);
    } else {
      setStep(BASE_QUESTIONS.length);
      playAudio(t('form_complete', language));
    }
  };

  const handleSubmit = () => {
    playAudio(config.audio);
    setTimeout(() => {
      openECILink(config.url, config.title, playAudio, language);
      setSubmitted(true);
    }, 1800);
  };

  return (
    <div style={{ fontFamily: LANG_FONTS[language] || "'Public Sans', sans-serif", backgroundColor: '#F9F9F9', minHeight: '100vh', padding: '1.5rem 1.25rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: NAVY }}>{t('register_title', language)}</h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#767684', fontWeight: 500 }}>{t('form_eci_submission', language, { type: formType })}</p>
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {BASE_QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              width: '0.875rem', height: '0.875rem', borderRadius: '9999px',
              backgroundColor: i <= step ? GREEN : '#e0e0e0',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

      {/* Q&A Steps */}
      {step < BASE_QUESTIONS.length && (
        <motion.div
          key={step}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ background: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}
        >
          <p
            style={{ fontSize: '1.3rem', fontWeight: 700, color: NAVY, marginBottom: '1.5rem', cursor: 'pointer' }}
            onClick={() => playAudio(BASE_QUESTIONS[step].q)}
          >
            {BASE_QUESTIONS[step].q}
          </p>

          <button
            onClick={handleRecord}
            style={{
              width: '6rem', height: '6rem', borderRadius: '9999px',
              background: isRecording ? '#EF4444' : SAFFRON, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
              boxShadow: `0 4px 16px ${isRecording ? 'rgba(239,68,68,0.4)' : 'rgba(255,153,51,0.4)'}`,
              animation: isRecording ? 'pulse 1s infinite' : 'none',
            }}
          >
            <Mic size={44} color="#ffffff" />
          </button>
          <p style={{ color: '#767684', marginBottom: '1.25rem', fontWeight: 500 }}>
            {isRecording ? t('listening', language) : t('tap_mic', language)}
          </p>

          {tempText && (
            <div style={{ background: '#F9F9F9', border: '2px solid #e0e0e0', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: NAVY, marginBottom: '1rem' }}>"{tempText}"</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={() => setTempText('')} style={{ background: '#e0e0e0', border: 'none', borderRadius: '9999px', padding: '0.75rem', cursor: 'pointer' }}>
                  <RotateCcw size={24} color="#464653" />
                </button>
                <button onClick={confirmAnswer} style={{ background: GREEN, border: 'none', borderRadius: '9999px', padding: '0.75rem', cursor: 'pointer' }}>
                  <CheckCircle size={24} color="#ffffff" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary + Submit */}
      {step >= BASE_QUESTIONS.length && !submitted && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div style={{ background: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, color: NAVY }}>{t('review_details', language)}</h3>
            {BASE_QUESTIONS.map(q => (
              <div key={q.key} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#767684', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{q.q}</p>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 700, color: NAVY, fontSize: '1.05rem' }}>{answers[q.key]}</p>
              </div>
            ))}
          </div>

          {/* Action: Open ECI Form */}
          <button
            onClick={handleSubmit}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: NAVY, color: '#ffffff', border: 'none', borderRadius: '0.875rem', padding: '1rem', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '0.75rem', fontFamily: LANG_FONTS[language] }}
          >
            <ExternalLink size={22} /> {t('submit_eci', language)}
          </button>

          {/* Print fallback */}
          {config.pdfUrl && (
            <button
              onClick={() => openECILink(config.pdfUrl, 'Form 6 PDF', playAudio, language)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: '#F3F3F4', color: NAVY, border: `2px solid #e0e0e0`, borderRadius: '0.875rem', padding: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: '0.75rem', fontFamily: LANG_FONTS[language] }}
            >
              <Printer size={20} /> {t('download_print', language)}
            </button>
          )}
        </motion.div>
      )}

      {/* Post-submit: track status + e-EPIC */}
      {submitted && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: GREEN, margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 800, color: NAVY, fontSize: '1.5rem', margin: '0 0 0.5rem' }}>{t('redirected_eci', language)}</h3>
          <p style={{ color: '#767684', fontWeight: 500, marginBottom: '1.5rem' }}>{t('form_complete_hint', language)}</p>

          <button
            onClick={() => openECILink(ECI_LINKS.trackApplication, 'Track Application', playAudio, language)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: SAFFRON, color: NAVY, border: 'none', borderRadius: '0.875rem', padding: '1rem', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', marginBottom: '0.75rem', fontFamily: LANG_FONTS[language] }}
          >
            <BarChart2 size={22} /> {t('track_status', language)}
          </button>

          <button
            onClick={() => openECILink(ECI_LINKS.eEpic, 'Download e-EPIC', playAudio, language)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: '#EFF6FF', color: NAVY, border: '2px solid #BFDBFE', borderRadius: '0.875rem', padding: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: LANG_FONTS[language] }}
          >
            <ExternalLink size={20} /> {t('download_id', language)}
          </button>
        </motion.div>
      )}
    </div>
  );
}
