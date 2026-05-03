class AudioEngine {
  static API_KEY = import.meta.env.VITE_SARVAM_API_KEY || "fallback-key";
  // Use non-stream endpoint — returns JSON with base64 audio
  static API_URL = "https://api.sarvam.ai/text-to-speech";

  static audio = new Audio();
  static currentAbortController = null;
  static unlocked = false;

  static unlock() {
    if (!this.unlocked && this.audio) {
      // Play a tiny silent wav to unlock the audio context on user interaction
      this.audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      this.audio.volume = 0;
      this.audio.play().then(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.volume = 1;
        this.unlocked = true;
      }).catch(() => {});
      
      // Also try unlocking speechSynthesis
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance("");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
    }
  }

  static getLanguageCode(langCode) {
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'or': 'or-IN',
      'pa': 'pa-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'gu': 'gu-IN',
    };
    return langMap[langCode] || 'en-IN';
  }

  static async speak(text, lang = 'en') {
    if (!text) return;

    // Cancel any pending request
    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }
    this.currentAbortController = new AbortController();
    const { signal } = this.currentAbortController;

    // Stop currently playing audio
    this.stop();

    try {
      const targetLang = this.getLanguageCode(lang);

      const response = await fetch(this.API_URL, {
        method: "POST",
        signal,
        headers: {
          "api-subscription-key": this.API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: targetLang,
          speaker: "shubh",
          model: "bulbul:v3",
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          output_format: "wav"
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Sarvam API ${response.status}: ${errText}`);
      }

      if (signal.aborted) return;

      const data = await response.json();

      // Response: { audios: ["<base64_wav>", ...] }
      const base64Audio = data?.audios?.[0];
      if (!base64Audio) throw new Error("No audio in Sarvam response");

      if (signal.aborted) return;

      // Decode base64 → Uint8Array → Blob → Object URL
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      this.audio.src = url;

      const speedMap = { slow: 0.8, normal: 1, fast: 1.2 };
      const userSpeed = localStorage.getItem('voting_agent_speed') || 'normal';
      this.audio.playbackRate = speedMap[userSpeed] || 1;
      this.audio.volume = 1;

      // Clean up object URL after playback
      this.audio.onended = () => URL.revokeObjectURL(url);

      await this.audio.play();

    } catch (error) {
      if (error.name === 'AbortError') return; // intentional cancel

      console.warn("Sarvam TTS failed, using browser TTS:", error.message);
      this.browserSpeak(text, lang);
    }
  }

  static browserSpeak(text, lang) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = this.getLanguageCode(lang);

    // Wait for voices to load if needed
    const setVoiceAndSpeak = () => {
      const voices = synth.getVoices();
      const voice =
        voices.find(v => v.lang === targetLang) ||
        voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) ||
        voices[0];
      if (voice) utterance.voice = voice;

      const speedMap = { slow: 0.8, normal: 1, fast: 1.2 };
      utterance.rate = speedMap[localStorage.getItem('voting_agent_speed') || 'normal'] || 1;

      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }
  }

  static stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
  }
}

export default AudioEngine;
