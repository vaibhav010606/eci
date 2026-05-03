import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ECI_LINKS, openECILink } from '../utils/eciLinks';
import { t } from '../utils/translations';
import { LANG_FONTS } from '../utils/constants';

const C = {
  green: "#0A7A3E",
  greenLight: "#E8F5EE",
  navy: "#0D1B4B",
  gray: "#6B7280",
  border: "#E2E6F0",
  white: "#FFFFFF",
  saffron: "#FF6B00",
};

export default function RegisterAI({ back, playAudio, language }) {
  const [step, setStep] = useState("choose"); // choose | ai
  const [form, setForm] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef(null);

  const FORMS = [
    { id: "form6", label: t('form6_label', language) || "New Registration", sub: t('form6_sub', language) || "Turned 18 or first time voter", icon: "🆕", url: ECI_LINKS.form6 },
    { id: "form6a", label: t('form6a_label', language) || "NRI / Overseas", sub: t('form6a_sub', language) || "Living outside India", icon: "✈️", url: ECI_LINKS.form6a },
    { id: "form8", label: t('form8_label', language) || "Correction / Shift", sub: t('form8_sub', language) || "Wrong details or moved house", icon: "✏️", url: ECI_LINKS.form8 },
    { id: "form7", label: t('form7_label', language) || "Delete Name", sub: t('form7_sub', language) || "Remove a deceased relative", icon: "🗑️", url: ECI_LINKS.form7 },
  ];

  const startAI = (selectedForm) => {
    setForm(selectedForm);
    setStep("ai");
    setLoading(true);
    
    // Initial message
    const initialMsg = `I am Matdaata Mitra. I will help you with ${selectedForm.label}. Do you have your Aadhaar card ready with you?`;
    setTimeout(() => {
      setChat([{ role: "assistant", content: initialMsg }]);
      playAudio(initialMsg);
      setLoading(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: "user", content: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    // Mock AI response for now (Integration with Gemini/Claude can be added later)
    setTimeout(() => {
      const reply = "That's great. Please tell me your full name as it appears on your ID.";
      setChat([...newChat, { role: "assistant", content: reply }]);
      playAudio(reply);
      setLoading(false);
    }, 1500);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { 
      playAudio("Voice input is not supported on this browser."); 
      return; 
    }
    const rec = new SR();
    rec.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    rec.onresult = (e) => { 
      const text = e.results[0][0].transcript;
      setInput(text); 
      setIsListening(false); 
    };
    rec.onend = () => setIsListening(false);
    rec.start();
    setIsListening(true);
    recRef.current = rec;
  };

  const activeFont = LANG_FONTS[language] || "'Public Sans', sans-serif";

  return (
    <div style={{ fontFamily: activeFont, backgroundColor: '#F5F6FA', minHeight: '100vh', paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: '#FFFFFF', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={back} style={{ background: 'none', border: 'none', color: C.saffron, fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={18} /> {t('back', language) || "Back"}
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '16px', color: C.navy }}>
          {step === "choose" ? (t('register_update', language)) : form?.label}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: '12px 14px' }}>
        <AnimatePresence mode="wait">
          {step === "choose" ? (
            <motion.div key="choose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ border: `1.5px solid ${C.green}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', background: C.greenLight }}>
                <p style={{ margin: 0, fontSize: '14px', color: C.navy, lineHeight: 1.55 }}>
                  {t('register_intro_ai', language) || "What do you need to do? I'll guide you through the right process."}
                </p>
              </div>

              {FORMS.map(f => (
                <button key={f.id} onClick={() => startAI(f)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: C.white, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '13px 14px', cursor: 'pointer', marginBottom: '8px', textAlign: 'left' }}>
                  <span style={{ fontSize: '22px' }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: C.navy }}>{f.label}</div>
                    <div style={{ fontSize: '12px', color: C.gray }}>{f.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '18px', color: C.gray }}>→</span>
                </button>
              ))}

              <button 
                onClick={() => openECILink(ECI_LINKS.trackApplication, "Track Status", playAudio, language)}
                style={{ width: '100%', padding: '14px', background: C.gray, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                🔍 {t('track_status', language)}
              </button>
            </motion.div>
          ) : (
            <motion.div key="ai" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
               <div style={{ border: `1.5px solid ${C.green}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', background: C.greenLight }}>
                <p style={{ margin: 0, fontSize: '14px', color: C.navy, lineHeight: 1.55 }}>
                  {t('ai_guide_disclaimer', language) || "I'll ask you a few questions, then take you directly to the official ECI form."}
                </p>
              </div>

              <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '12px', minHeight: '120px', maxHeight: '300px', overflowY: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chat.map((m, i) => (
                  <div key={i} style={{ 
                    background: m.role === "assistant" ? "#E3F0FF" : C.navy, 
                    borderRadius: m.role === "assistant" ? "12px 12px 12px 2px" : "12px 12px 2px 12px", 
                    padding: "10px 12px", fontSize: "13.5px", 
                    color: m.role === "assistant" ? C.navy : C.white, 
                    maxWidth: "90%", alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
                    lineHeight: 1.5 
                  }}>
                    {m.role === "assistant" && <span style={{ marginRight: 6 }}>🤖</span>}
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ background: "#E3F0FF", borderRadius: "12px 12px 12px 2px", padding: "10px 12px", fontSize: "13.5px", color: C.navy, width: 'fit-content' }}>
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none' }}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={t('va_type_message', language)}
                />
                <button onClick={isListening ? () => recRef.current?.stop() : startVoice} style={{ background: C.saffron, border: 'none', borderRadius: '10px', padding: '10px 12px', fontSize: '18px', cursor: 'pointer' }}>
                  {isListening ? "⏹️" : "🎙️"}
                </button>
                <button onClick={handleSend} disabled={loading} style={{ background: C.navy, border: 'none', borderRadius: '10px', padding: '10px 16px', color: C.white, fontWeight: 700, cursor: 'pointer' }}>
                  <Send size={18} />
                </button>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  onClick={() => openECILink(form.url, form.label, playAudio, language)}
                  style={{ width: '100%', padding: '14px', background: C.green, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ExternalLink size={18} /> {t('submit_eci', language)}
                </button>
                <button 
                  onClick={() => setStep("choose")}
                  style={{ width: '100%', padding: '10px', background: 'transparent', color: C.gray, border: `1px solid ${C.border}`, borderRadius: '12px', fontWeight: 600, fontSize: '13px' }}
                >
                  {t('restart', language) || "Restart Guide"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
