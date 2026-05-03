import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';
import { sanitizeInput, checkRateLimit } from '../utils/security';

/** API key for Gemini — loaded lazily inside processIntent for testability. */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'fallback-key';

const NAVY = '#000080';
const SAFFRON = '#FF9933';

export default function AgentChatBox({ playAudio, language }) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [status, setStatus] = useState('idle'); // idle | listening | processing | responding
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  useEffect(() => {
    const welcomeMsg = t('va_welcome', language) || 'Hello, I am Matdaata Mitra. How can I assist you today?';
    setMessages([{ sender: 'agent', text: welcomeMsg }]);
  }, [language]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      playAudio("Voice input is not supported on this browser.");
      return;
    }

    const recognition = new SR();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleSend(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
      setStatus('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (status === 'listening') setStatus('idle');
    };

    recognition.start();
  };

  const handleSend = (text) => {
    const clean = sanitizeInput(text);
    if (!clean) return;

    // Rate limit check
    const { allowed, waitMs } = checkRateLimit();
    if (!allowed) {
      const waitSec = Math.ceil(waitMs / 1000);
      const msg = `Please wait ${waitSec} seconds before sending another message.`;
      setMessages(prev => [...prev, { sender: 'agent', text: msg }]);
      return;
    }

    setMessages(prev => [...prev, { sender: 'user', text: clean }]);
    setTranscript('');
    processIntent(clean);
  };

  const getLanguageName = (code) => {
    const map = {
      'hi': 'Hindi', 'en': 'English', 'bn': 'Bengali', 'te': 'Telugu',
      'mr': 'Marathi', 'ta': 'Tamil', 'ur': 'Urdu', 'gu': 'Gujarati',
      'kn': 'Kannada', 'or': 'Odia', 'ml': 'Malayalam', 'pa': 'Punjabi'
    };
    return map[code] || 'their native';
  };

  const processIntent = async (text) => {
    setStatus('processing');

    try {
      const languageName = getLanguageName(language);
      const prompt = `You are "Matdaata Mitra", an official, friendly, and expert AI Voting Assistant for the Election Commission of India (ECI).
Your goal is to help Indian citizens with voter registration, searching their name in electoral rolls, and understanding the voting process.

User query: "${text}"
Current Language: ${languageName}

Instructions:
1. Respond ONLY in ${languageName}.
2. Be concise, respectful, and official.
3. If the user wants to register, mention Form 6.
4. If they want to check their name, mention Electoral Search.
5. Do not use Markdown, just plain text.

Response:`;

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setStatus('responding');
      setMessages(prev => [...prev, { sender: 'agent', text: responseText }]);
      playAudio(responseText);
      
      // Intent mapping for auto-navigation
      const lowerText = text.toLowerCase();
      if (lowerText.includes('check') || lowerText.includes('name') || lowerText.includes('सूची') || lowerText.includes('नाम')) {
        setTimeout(() => navigate('/search'), 4000);
      } else if (lowerText.includes('register') || lowerText.includes('form 6') || lowerText.includes('पंजीकरण')) {
        setTimeout(() => navigate('/register'), 4000);
      }

      setStatus('idle');
    } catch (error) {
      // Log only error type, not full stack (avoids leaking internal info)
      console.warn("Agent error:", error?.message?.slice(0, 100));
      const msg = t('va_not_understood', language) || "I'm having trouble connecting. Please try again or use the links below.";
      playAudio(msg);
      setStatus('idle');
      setMessages(prev => [...prev, { sender: 'agent', text: msg }]);
    }
  };

  return (
    <div style={{ 
      fontFamily: activeFont, 
      backgroundColor: '#FFFFFF', 
      border: `1px solid #E2E6F0`,
      borderRadius: '16px',
      display: 'flex', 
      flexDirection: 'column',
      height: 'calc(100vh - 120px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: '#0D1B4B', 
        color: '#FFFFFF', 
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#FF6B00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
          🤖
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
          Matdaata Mitra
        </h2>
      </div>

      {/* Chat Area - aria-live announces new messages to screen readers */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with Matdaata Mitra"
        style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F9F9F9' }}
      >
        {messages.map((m, idx) => (
          <div key={idx} style={{ 
            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: m.sender === 'user' ? NAVY : '#ffffff',
            color: m.sender === 'user' ? '#ffffff' : NAVY,
            border: m.sender === 'agent' ? `1.5px solid #e0e0e0` : 'none',
            borderBottomRightRadius: m.sender === 'user' ? '0' : '1rem',
            borderBottomLeftRadius: m.sender === 'agent' ? '0' : '1rem',
          }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 }}>{m.text}</p>
          </div>
        ))}
        {status === 'listening' && (
          <div style={{ alignSelf: 'center', color: SAFFRON, padding: '1rem' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
              <Mic size={32} />
            </motion.div>
          </div>
        )}
        {status === 'processing' && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem' }}>
            <span style={{ color: NAVY, fontWeight: 600 }}>...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E6F0', backgroundColor: '#FFFFFF', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={startListening}
          className={isListening ? "listening-pulse" : ""}
          style={{ 
            background: isListening ? '#FFF3E8' : '#F1F3F4', 
            border: 'none', 
            borderRadius: '50%', 
            width: '42px', 
            height: '42px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            color: isListening ? '#FF6B00' : '#0D1B4B',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
        >
          <Mic size={22} strokeWidth={isListening ? 3 : 2} />
        </button>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E2E6F0', 
          borderRadius: '24px', 
          padding: '4px 6px 4px 14px', 
          alignItems: 'center',
          transition: 'border-color 0.2s ease'
        }}>
          <input 
            type="text" 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(transcript)}
            placeholder={t('va_type_message', language) === 'va_type_message' ? 'Type a message...' : t('va_type_message', language)}
            style={{ 
              flex: 1, 
              border: 'none', 
              outline: 'none', 
              padding: '8px 0', 
              fontSize: '15px', 
              fontFamily: activeFont,
              background: 'transparent',
              color: '#0D1B4B'
            }}
          />
          <button 
            onClick={() => handleSend(transcript)}
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: transcript.trim() ? '#FF6B00' : '#9CA3AF',
              transition: 'color 0.2s ease'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
