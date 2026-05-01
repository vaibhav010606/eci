import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, X, ChevronRight, Speaker, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const NAVY = '#000080';
const SAFFRON = '#FF9933';

export default function VoiceAssistant({ playAudio, language }) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [status, setStatus] = useState('idle'); // idle | listening | processing | responding

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  useEffect(() => {
    const welcomeMsg = t('va_welcome', language);
    playAudio(welcomeMsg);
    setAiResponse(welcomeMsg);
    
    const timer = setTimeout(() => {
      startListening();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  const startListening = () => {
    setIsListening(true);
    setStatus('listening');
    setTranscript('');
    playAudio('');
  };

  const handleStopListening = () => {
    setIsListening(false);
    setStatus('processing');
    
    setTimeout(() => {
      const mockTranscript = language === 'hi' ? 'मेरा नाम जांचें' : 'Check my name';
      setTranscript(mockTranscript);
      processIntent(mockTranscript);
    }, 1500);
  };

  const processIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    setTimeout(() => {
      setStatus('responding');
      
      if (lowerText.includes('check') || lowerText.includes('name') || lowerText.includes('जांचें') || lowerText.includes('नाम')) {
        const msg = t('va_certainly_search', language);
        setAiResponse(msg);
        playAudio(msg);
        setTimeout(() => navigate('/search'), 3000);
      } 
      else if (lowerText.includes('register') || lowerText.includes('new') || lowerText.includes('पंजीकरण') || lowerText.includes('नया')) {
        const msg = t('va_alright_register', language);
        setAiResponse(msg);
        playAudio(msg);
        setTimeout(() => navigate('/register'), 3000);
      }
      else {
        const msg = t('va_not_understood', language);
        setAiResponse(msg);
        playAudio(msg);
        setStatus('idle');
      }
    }, 1000);
  };

  return (
    <div style={{ 
      fontFamily: activeFont, 
      backgroundColor: NAVY, 
      minHeight: '100vh', 
      color: '#ffffff',
      display: 'flex', 
      flexDirection: 'column',
      padding: '2rem 1.5rem'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.75rem', cursor: 'pointer' }}
        >
          <X color="#ffffff" size={24} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <AnimatePresence mode="wait">
          {status === 'listening' ? (
            <motion.div
              key="listening"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 2rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ position: 'absolute', inset: 0, background: SAFFRON, borderRadius: '50%' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  style={{ position: 'absolute', inset: '10px', background: SAFFRON, borderRadius: '50%' }}
                />
                <div style={{ 
                  position: 'absolute', inset: '20px', background: SAFFRON, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(255,153,51,0.5)'
                }}>
                  <Mic size={48} color="#ffffff" />
                </div>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t('va_listening', language)}</h2>
            </motion.div>
          ) : (
            <motion.div
              key="others"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%' }}
            >
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '1.5rem', 
                padding: '1.5rem',
                borderLeft: `4px solid ${SAFFRON}`,
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: SAFFRON }}>
                  <MessageSquare size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Voting Assistant</span>
                </div>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                  {aiResponse}
                </p>
              </div>

              {transcript && (
                <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                  <p style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', borderRadius: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
                    "{transcript}"
                  </p>
                </div>
              )}

              {status === 'idle' && (
                <button
                  onClick={startListening}
                  style={{
                    width: '100%', padding: '1.25rem', borderRadius: '1rem',
                    background: SAFFRON, color: '#ffffff', border: 'none',
                    fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    fontFamily: activeFont
                  }}
                >
                  <Mic size={24} /> {t('va_tap_to_speak', language)}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
