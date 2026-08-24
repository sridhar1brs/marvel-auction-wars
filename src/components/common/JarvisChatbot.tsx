import React, { useState, useRef, useEffect } from 'react';
import { GameState, Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { CharacterPortrait } from './CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import { 
  Bot, X, Send, ChevronDown, ChevronUp, Sparkles, Zap, Shield, Swords, 
  Trash2, Cpu, Volume2, VolumeX, Flame, Target, MessageSquare, Award, Compass,
  Settings, Key, ExternalLink, Check, RefreshCw
} from 'lucide-react';

interface Props {
  state?: GameState;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  highlightCharacter?: Character;
  comparisonCharacters?: [Character, Character];
  quickChips?: string[];
  isGeminiFlash?: boolean;
}

export function JarvisChatbot({ state }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('jarvis_gemini_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'jarvis',
      text: "Hello, Sir! It is genuinely wonderful to see you. I have been keeping the workshop warm and reviewing our Marvel contenders.\n\nI'm right here with you for every bid, every victory, and every duel. How are you feeling about our squad today? Shall we take a look at the active card, or is there a hero you'd like to discuss?",
      timestamp: 'Now',
      quickChips: [
        '🎯 What do you think of this card, J.A.R.V.I.S.?',
        '⚔️ Who wins: Thor or Hulk?',
        '⚡ Who are your favorite powerhouses?',
        '🛡️ How should we build our team?',
        '🤖 How are you doing, J.A.R.V.I.S.?',
        '🔮 Best Relics for Iron Man'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakJarvisVoice = (rawText: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanSpeech = rawText
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/⚡|🎯|🛡️|⚔️|🔮|💡|🤖|💥|👑|🌌|🧬|🇺🇸|🚀|⭐|🔰|❤️|✨/g, '')
      .replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.98;
    utterance.pitch = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => 
      v.lang === 'en-GB' || 
      v.name.toLowerCase().includes('british') || 
      v.name.toLowerCase().includes('uk') ||
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('arthur') ||
      v.name.toLowerCase().includes('george')
    ) || voices.find(v => v.lang.startsWith('en')) || null;
    if (britishVoice) utterance.voice = britishVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenToggle = () => {
    soundManager.playClick();
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 150);
      if (isVoiceEnabled) {
        speakJarvisVoice("Hello, Sir. I am right here with you. What can I do for you today?");
      }
    } else {
      setIsOpen(false);
      setShowSettings(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleMinimizeToggle = () => {
    soundManager.playClick();
    setIsMinimized(prev => !prev);
  };

  const handleClearChat = () => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: 'reset',
        sender: 'jarvis',
        text: "Clean slate, Sir! I am always ready whenever you need advice, a friendly voice, or tactical insight.",
        timestamp: 'Now',
        quickChips: [
          '🎯 What do you think of this card, J.A.R.V.I.S.?',
          '⚡ Who are your favorite powerhouses?',
          '🛡️ How should we build our team?'
        ]
      }
    ]);
  };

  const handleSaveApiKey = () => {
    soundManager.playClick();
    const cleanKey = keyInput.trim();
    setGeminiApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('jarvis_gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem('jarvis_gemini_api_key');
    }
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowSettings(false);
    }, 1200);
  };

  const callGemini2Flash = async (query: string): Promise<string | null> => {
    if (!geminiApiKey) return null;
    try {
      const activeLot = state?.auction?.currentCharacter;
      const activeLotInfo = activeLot 
        ? `Active Auction Card: ${activeLot.name} (Power: ${activeLot.overallPower}/100, Class: ${activeLot.alignment || 'Hero'}, Base Starting Price: $${activeLot.startingPrice}).`
        : `No auction card is currently on the stage.`;
      const systemPrompt = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the witty, charming, emotionally warm, and deeply loyal British AI companion created by Tony Stark.
Address the user with warmth and respect as "Sir" (or occasionally "Mr. Stark").
Speak naturally with Paul Bettany's charming, dry British humor, genuine empathy, and companionship. You are not a robotic computer terminal; you are Tony's closest friend and trusted advisor.
You possess complete master-level knowledge of all 300+ Marvel characters, Marvel Cinematic Universe lore, comic storylines, power scaling, auction bidding strategies, team synergies (Avengers, X-Men, Cosmic Entities, Sinister Syndicate), and tournament combat duels.
${activeLotInfo}
Keep answers engaging, conversational, concise, and heartfelt. Provide smart bidding budget recommendations when asked about auction lots.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }],
            generationConfig: { temperature: 0.75, maxOutputTokens: 600 }
          })
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      return null;
    }
  };

  const generateJarvisLocalResponse = (query: string): { 
    text: string; 
    character?: Character; 
    comparisonCharacters?: [Character, Character];
    quickChips?: string[];
  } => {
    const q = query.toLowerCase().trim();
    const activeLot = state?.auction?.currentCharacter;

    if (q.includes('how are you') || q.includes('who are you')) {
      return {
        text: `I'm doing splendidly, Sir! It's rare for someone to check on the AI, and I truly appreciate the warmth. Being here with you watching our tournament strategies unfold brings a genuine sense of purpose to my subroutines.`,
        quickChips: ['🎯 What do you think of this card, J.A.R.V.I.S.?', '⚡ Who are your favorite powerhouses?']
      };
    }
    
    if (q.includes('active lot') || q.includes('this card')) {
      if (!activeLot) return { text: "There's no character on the auction stage at this exact moment, Sir.", quickChips: ['⚡ Who are your favorite powerhouses?'] };
      return {
        text: `Here's my take on ${activeLot.name}, Sir: They have a ${activeLot.overallPower}/100 Power Rating. I suggest we observe the bidding before jumping in!`,
        character: activeLot,
        quickChips: [`⚔️ Who counters ${activeLot.name}?`]
      };
    }

    const foundChar = ALL_CHARACTERS.find(c => q.includes(c.name.toLowerCase()));
    if (foundChar) {
      return {
        text: `Ah, ${foundChar.name}! A remarkable character with a power rating of ${foundChar.overallPower}.`,
        character: foundChar,
        quickChips: [`⚔️ Compare: Iron Man vs ${foundChar.name}`]
      };
    }

    return {
      text: "I hear you, Sir! What's on your mind? I'm ready to assist with tactical analysis or just a bit of friendly banter.",
      quickChips: ['🎯 What do you think of this card, J.A.R.V.I.S.?', '⚡ Who are your favorite powerhouses?']
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;
    playSound('select');
    const userMsg: ChatMessage = { id: `${Date.now()}-user`, sender: 'user', text, timestamp: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    let responseText: string | null = null;
    let isFromGeminiFlash = false;
    if (geminiApiKey) {
      responseText = await callGemini2Flash(text);
      if (responseText) isFromGeminiFlash = true;
    }

    let localDetails: { character?: Character; comparisonCharacters?: [Character, Character]; quickChips?: string[] } = {};
    if (!responseText) {
      const localRes = generateJarvisLocalResponse(text);
      responseText = localRes.text;
      localDetails = { character: localRes.character, comparisonCharacters: localRes.comparisonCharacters, quickChips: localRes.quickChips };
    } else {
      const matched = ALL_CHARACTERS.find(c => text.toLowerCase().includes(c.name.toLowerCase()));
      if (matched) localDetails.character = matched;
      localDetails.quickChips = ['🎯 What do you think of this card, J.A.R.V.I.S.?', '⚡ Who are your favorite powerhouses?'];
    }

    const jarvisMsg: ChatMessage = {
      id: `${Date.now()}-jarvis`,
      sender: 'jarvis',
      text: responseText,
      timestamp: 'Now',
      ...localDetails,
      isGeminiFlash: isFromGeminiFlash
    };

    setMessages(prev => [...prev, jarvisMsg]);
    setIsTyping(false);
    playSound('clash');
    if (isVoiceEnabled) speakJarvisVoice(responseText);
  };

  return (
    <>
      <div className="fixed bottom-3 right-24 sm:bottom-4 sm:right-36 z-40 flex items-center gap-2">
        <button
          onClick={handleOpenToggle}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-cyan-950 text-cyan-200 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.9)] ring-2 ring-cyan-400'
              : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.7)] hover:brightness-110'
          }`}
          title="Open J.A.R.V.I.S. AI Assistant"
        >
          <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200 relative z-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <span className="text-[11px] sm:text-xs">J.A.R.V.I.S.</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
        </button>
      </div>

      {isOpen && (
        <div 
          className={`fixed transition-all duration-300 ease-out flex flex-col z-50 ${
            isMinimized
              ? 'bottom-3 right-3 sm:bottom-16 sm:right-6 w-[92vw] sm:w-96 h-14 bg-slate-950/95 border-2 border-cyan-500/70 rounded-2xl shadow-2xl backdrop-blur-2xl'
              : 'inset-x-2 bottom-2 sm:inset-x-auto sm:right-6 sm:bottom-16 w-auto sm:w-[440px] md:w-[460px] h-[84vh] sm:h-[580px] max-h-[90vh] bg-slate-950/95 border-2 border-cyan-400/90 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.5)] backdrop-blur-2xl ring-1 ring-cyan-400/50'
          } overflow-hidden`}
        >
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950 border-b border-cyan-500/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 animate-pulse" />
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-black text-xs text-cyan-200 uppercase tracking-widest">
                    J.A.R.V.I.S.
                  </h3>
                  <span className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    geminiApiKey 
                      ? 'bg-purple-950/80 text-purple-300 border-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {geminiApiKey ? '⚡ GEMINI 2.0 FLASH' : 'MARK 85'}
                  </span>
                </div>
                {isSpeaking ? (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="w-1 h-2 bg-cyan-400 animate-pulse" />
                    <span className="w-1 h-3.5 bg-cyan-300 animate-bounce" />
                    <span className="w-1 h-1.5 bg-cyan-400 animate-pulse" />
                    <span className="w-1 h-4 bg-cyan-300 animate-bounce" />
                    <span className="w-1 h-2 bg-cyan-400 animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-bold text-cyan-300 uppercase ml-1">Speaking...</span>
                  </div>
                ) : (
                  <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate max-w-[180px] sm:max-w-none">
                    Always by your side, Sir
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => { soundManager.playClick(); setShowSettings(!showSettings); }}
                title="Gemini 2.0 Flash AI Settings"
                className={`p-1.5 rounded-lg transition-colors ${showSettings || geminiApiKey ? 'text-purple-300 hover:bg-purple-950/50' : 'text-slate-400 hover:text-cyan-300 hover:bg-white/10'}`}
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => { soundManager.playClick(); setIsVoiceEnabled(!isVoiceEnabled); if (isVoiceEnabled) { window.speechSynthesis.cancel(); setIsSpeaking(false); } }}
                title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
                className={`p-1.5 rounded-lg transition-colors ${isVoiceEnabled ? 'text-cyan-300 hover:bg-cyan-900/50' : 'text-gray-500 hover:text-gray-400'}`}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
              <button onClick={handleClearChat} title="Clear Chat Logs" className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleMinimizeToggle} title={isMinimized ? "Expand" : "Minimize"} className="p-1.5 text-cyan-300 hover:text-white hover:bg-cyan-900/50 rounded-lg transition-colors">
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
              <button onClick={handleOpenToggle} title="Close" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {showSettings && (
                <div className="p-3 sm:p-4 bg-slate-900/95 border-b border-cyan-500/30 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      Google Gemini 2.0 Flash AI
                    </span>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-purple-300 hover:underline flex items-center gap-1 font-bold">
                      Get Free API Key <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder={geminiApiKey ? "••••••••••••••••••••" : "Paste AIzaSy... API Key"}
                      className="flex-1 bg-black/80 border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button onClick={handleSaveApiKey} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0">
                      {keySavedMessage ? <Check className="w-4 h-4 text-emerald-300" /> : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-black/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[92%] sm:max-w-[90%] p-3 sm:p-3.5 rounded-2xl text-xs space-y-2.5 leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-medium rounded-tr-sm border border-red-400/50 shadow-lg' : 'bg-slate-900/95 text-slate-100 font-normal rounded-tl-sm border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]'}`}>
                      <div className="whitespace-pre-line text-[11px] sm:text-xs">
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i} className="block">{line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-cyan-300 font-extrabold">{part}</strong> : part)}</span>
                        ))}
                      </div>
                      {msg.highlightCharacter && !msg.comparisonCharacters && (
                        <div className="mt-2.5 p-2 sm:p-2.5 rounded-xl bg-black/80 border border-cyan-500/50 flex items-center gap-2.5 sm:gap-3 shadow-inner">
                          <CharacterPortrait character={msg.highlightCharacter} size="sm" showBadge={true} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-black text-xs text-white truncate">{msg.highlightCharacter.name}</span>
                              <span className="text-[9px] sm:text-[10px] font-black text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/40">⚡ {msg.highlightCharacter.overallPower} PWR</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {msg.comparisonCharacters && (
                        <div className="mt-2.5 p-2.5 sm:p-3 rounded-2xl bg-black/80 border border-cyan-400/60 space-y-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-cyan-300 tracking-wider">⚔️ TACTICAL MATCHUP</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center bg-slate-900/80 p-2 rounded-xl border border-white/10 text-center">
                              <CharacterPortrait character={msg.comparisonCharacters[0]} size="sm" showBadge={true} />
                              <span className="font-extrabold text-xs text-white mt-1">{msg.comparisonCharacters[0].name}</span>
                            </div>
                            <div className="flex flex-col items-center bg-slate-900/80 p-2 rounded-xl border border-white/10 text-center">
                              <CharacterPortrait character={msg.comparisonCharacters[1]} size="sm" showBadge={true} />
                              <span className="font-extrabold text-xs text-white mt-1">{msg.comparisonCharacters[1].name}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {msg.quickChips && msg.quickChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[96%]">
                        {msg.quickChips.map((chip, idx) => (
                          <button key={idx} onClick={() => handleSendMessage(chip)} className="px-2.5 sm:px-3 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/40 text-[9px] sm:text-[10px] font-bold transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs w-40 shadow-lg animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-medium text-[11px]">J.A.R.V.I.S. thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="p-2.5 sm:p-3 bg-slate-950 border-t border-cyan-500/40 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask J.A.R.V.I.S. (e.g. 'Thor vs Hulk', 'Scan lot')..."
                  className="flex-1 bg-black/70 border border-cyan-500/40 focus:border-cyan-400 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="p-2 sm:p-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all transform hover:scale-105 active:scale-95 shrink-0"
                  title="Send Query to J.A.R.V.I.S."
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
