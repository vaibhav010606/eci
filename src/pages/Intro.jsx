import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/language');
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[70vh]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="text-center"
      >
        <div className="w-32 h-32 bg-india-saffron rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
          <span className="text-6xl text-white">🗳️</span>
        </div>
        <h1 className="text-3xl font-bold text-navy-blue mb-4">Universal Voting Assistant</h1>
        <p className="text-lg text-gray-600 mb-8">Your voice-first guide to voting</p>
        
        <button 
          onClick={() => navigate('/language')}
          className="bg-india-green text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all w-full max-w-xs flex items-center justify-center gap-2"
        >
          Let's Start <span>→</span>
        </button>
      </motion.div>
    </div>
  );
}
