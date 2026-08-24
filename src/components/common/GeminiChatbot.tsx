import React, { useState, useRef, useEffect } from 'react';
import { GameState, Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { CharacterPortrait } from './CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import { 
  Sparkles, X, Send, ChevronDown, ChevronUp, Zap, Shield, Swords, 
  Trash2, Volume2, VolumeX, Flame, Target, MessageSquare, Award, Compass,
  Settings, Key, ExternalLink, Check, RefreshCw, Bot, Globe, BookOpen,
  HelpCircle, Lightbulb, User, Info
} from 'lucide-react';

interface Props {
  state?: GameState;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  highlightCharacter?: Character;
  comparisonCharacters?: [Character, Character];
  quickChips?: string[];
  isApiCall?: boolean;
}

export function GeminiChatbot({ state }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_ai_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: "Hi there! I'm **Gemini**, your AI assistant. ✨\n\nI have real-time knowledge about the world—from science, tech, history, and gaming, to everything about **Marvel canon**, lore, characters, matchups, and strategic auction coaching for Marvel Auction Wars.\n\nWhat would you like to explore or discuss today?",
      timestamp: 'Now',
      quickChips: [
        '✨ Analyze the active auction card',
        '⚔️ Who wins: Thor vs Thanos?',
        '💡 Best auction bidding strategy?',
        '🌍 How big is the Marvel Multiverse?',
        '🛡️ What are the top team synergies?',
        '🚀 Explain quantum computing simply'
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

  const speakVoice = (rawText: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanSpeech = rawText
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/[✨⚔️🛡️💡🚀🌍🔥]/g, '')
      .replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Natural') || 
      v.lang.startsWith('en')
    ) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
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
        sender: 'gemini',
        text: "Chat cleared! I'm right here ready for any question—world knowledge, Marvel debates, auction tactics, or anything else you'd like to talk about.",
        timestamp: 'Now',
        quickChips: [
          '✨ Analyze active auction card',
          '⚔️ Top Mythic tier heroes',
          '💡 How do synergy combos work?'
        ]
      }
    ]);
  };

  const handleSaveApiKey = () => {
    soundManager.playClick();
    const cleanKey = keyInput.trim();
    if (cleanKey) {
      localStorage.setItem('gemini_ai_api_key', cleanKey);
      setGeminiApiKey(cleanKey);
      setKeySavedMessage(true);
      setTimeout(() => {
        setKeySavedMessage(false);
        setShowSettings(false);
      }, 1500);
    } else {
      localStorage.removeItem('gemini_ai_api_key');
      setGeminiApiKey('');
      setKeySavedMessage(true);
      setTimeout(() => {
        setKeySavedMessage(false);
        setShowSettings(false);
      }, 1500);
    }
  };

  // Direct Live Google Gemini API Integration (Gemini 2.0 / 1.5 Flash)
  const callLiveGeminiApi = async (userPrompt: string): Promise<string | null> => {
    if (!geminiApiKey) return null;
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      const systemInstruction = `You are Gemini, Google's advanced AI assistant embedded inside the "Marvel: Auction Wars" game. 
You are warm, intelligent, engaging, articulate, and natural. You possess comprehensive general knowledge about the real world (science, technology, culture, history, computing, gaming, life) as well as encyclopedic mastery of Marvel comics canon, the Marvel Cinematic Universe (MCU), character powers, and strategic coaching for card drafting and turn-based battles.
Keep answers concise, insightful, nicely formatted with bold text, bullet points when appropriate, and avoid robotic phrases.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        // Fallback to gemini-1.5-flash
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const fallbackRes = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
          })
        });
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          return fbData?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
        return null;
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.warn('Gemini API call error:', err);
      return null;
    }
  };

  // Comprehensive Built-in Gemini Natural Knowledge & Marvel Intelligence Engine
  const generateGeminiResponse = (query: string): { 
    text: string; 
    character?: Character; 
    comparisonCharacters?: [Character, Character];
    quickChips?: string[];
  } => {
    const q = query.toLowerCase().trim();
    const activeLot = state?.auction?.currentCharacter;

    // 1. Casual & Greeting queries
    if (/^(hi|hello|hey|greetings|what's up|sup|howdy)\b/.test(q)) {
      return {
        text: "Hey! Great to connect with you. How's your tournament roster coming along, or is there something in particular you'd like to learn or discuss today?",
        quickChips: ['✨ Analyze the active card', '⚔️ Who are the top 5 heroes?', '💡 Share a winning tip']
      };
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('your name')) {
      return {
        text: "I'm **Gemini**, Google's conversational AI assistant! I'm built to help you explore ideas, understand complex topics, analyze strategies, and have great conversations. In Marvel Auction Wars, I serve as your real-time strategic advisor and Marvel lore expert.",
        quickChips: ['🌍 Tell me about Marvel canon', '⚔️ Best character in the game', '🚀 Ask a science question']
      };
    }

    if (q.includes('how are you') || q.includes('how are you doing') || q.includes('how do you feel')) {
      return {
        text: "I'm doing great, thanks for asking! Ready to dive into some intense Marvel debates, breakdown auction strategies, or talk about anything from science to gaming. How are things on your side?",
        quickChips: ['⚔️ Compare Thor and Hulk', '💡 How to win boss raids', '✨ Scan active card']
      };
    }

    // 2. Active Auction Lot Analysis
    if (q.includes('active lot') || q.includes('this card') || q.includes('current card') || q.includes('should i buy') || q.includes('analyze card') || q.includes('active auction')) {
      if (!activeLot) {
        return {
          text: "There is no character actively on the auction block right now. Once the draft begins or the next lot appears, ask me again and I'll give you a full tactical breakdown!",
          quickChips: ['⚔️ Top Mythic tier picks', '💡 What is the best starting budget?']
        };
      }
      const skills = getSkillsForCharacter(activeLot);
      return {
        text: `**Tactical Scouting on ${activeLot.name}**:
• **Tier Grade**: ${activeLot.grade} Tier
• **Base Power Rating**: **${activeLot.overallPower}/100**
• **Starting Value**: ${activeLot.startingPrice} - ${activeLot.startingPrice + 10}
• **Combat Ability**: *${skills[0]?.name || activeLot.specialAbilities[0]?.name || 'Power Strike'}* (${skills[0]?.description || activeLot.specialAbilities[0]?.description || 'High damage attack'})

**Strategic Recommendation**: ${
  activeLot.grade === 'MYTHIC' 
    ? 'An absolute powerhouse win condition. Highly worth spending 25-40% of your starting treasury.' 
    : activeLot.grade === 'A'
    ? 'Solid frontline carry with high power output. Great core addition to build synergies around.'
    : 'Cost-effective squad builder. Grab them if the price stays low to preserve funds for artifacts!'
}`,
        character: activeLot,
        quickChips: [`⚔️ Who counters ${activeLot.name}?`, `🛡️ Synergies for ${activeLot.name}`, `⏩ Skip or Buy?`]
      };
    }

    // 3. Head-to-Head Comparison ("X vs Y")
    const vsMatch = q.match(/(.+?)\s+(?:vs|versus|against|counter)\s+(.+)/);
    if (vsMatch) {
      const term1 = vsMatch[1].replace(/who (wins|is better|counters|stronger)|compare/gi, '').trim();
      const term2 = vsMatch[2].replace(/\?/g, '').trim();
      const c1 = ALL_CHARACTERS.find(c => c.name.toLowerCase().includes(term1) || term1.includes(c.name.toLowerCase()));
      const c2 = ALL_CHARACTERS.find(c => c.name.toLowerCase().includes(term2) || term2.includes(c.name.toLowerCase()));

      if (c1 && c2) {
        const diff = Math.abs(c1.overallPower - c2.overallPower);
        const winner = c1.overallPower >= c2.overallPower ? c1 : c2;
        const loser = winner === c1 ? c2 : c1;
        return {
          text: `**Matchup Breakdown: ${c1.name} vs ${c2.name}**

• **${c1.name}**: Power **${c1.overallPower}** (${c1.grade} Grade)
• **${c2.name}**: Power **${c2.overallPower}** (${c2.grade} Grade)

**Analytical Verdict**: **${winner.name}** holds the statistical and canonical advantage with a **+${diff} Power edge**.
${winner.name === c1.name ? `${c1.name}'s tier abilities and higher baseline combat stats give them superior resilience in clutch turns.` : `${c2.name}'s raw offensive output and artifact synergy potential give them the upper hand.`}`,
          comparisonCharacters: [c1, c2],
          quickChips: [`🛡️ How to counter ${winner.name}`, `✨ Best Relic for ${c1.name}`]
        };
      }
    }

    // 4. Character Specific Knowledge Search
    const matchedChar = ALL_CHARACTERS.find(c => {
      const name = c.name.toLowerCase();
      return q.includes(name) || (name.includes(' ') && name.split(' ').some(part => part.length > 3 && q.includes(part)));
    });

    if (matchedChar) {
      const skills = getSkillsForCharacter(matchedChar);
      return {
        text: `**${matchedChar.name}** (${matchedChar.grade} Tier)
• **Overall Power**: **${matchedChar.overallPower}/100**
• **Signature Ultimate**: *${skills[1]?.name || matchedChar.specialAbilities[0]?.name || 'Superpower Burst'}* — ${skills[1]?.description || matchedChar.specialAbilities[0]?.description || 'Unleashes hero energy'}
• **Passive Trait**: *${skills[0]?.name || 'Combat Mastery'}* — ${skills[0]?.description || 'Tactical duel buffs'}
• **Starting Auction Value**: ${matchedChar.startingPrice}

**Lore & Playstyle**: ${matchedChar.description || 'A prominent Marvel character with exceptional combat capabilities in both solo showdowns and tag-team synergy rosters.'}`,
        character: matchedChar,
        quickChips: [`⚔️ Compare ${matchedChar.name} vs Thor`, `🛡️ Squad builds for ${matchedChar.name}`]
      };
    }

    // 5. Strategy, Synergies & Rules
    if (q.includes('strategy') || q.includes('tip') || q.includes('how to win') || q.includes('advice') || q.includes('guide')) {
      return {
        text: `**Winning Strategies for Marvel Auction Wars**:

1. **Treasury Management**: Never blow your entire budget on the first lot. Aim to secure 1 High-Tier anchor (Mythic or Grade A) and 2-3 value picks.
2. **Tag-Team Synergy Multipliers**: Pairing heroes with thematic ties (e.g. Iron Man + War Machine, Captain America + Bucky) unlocks massive team attack multipliers (+15% to +35% damage).
3. **Tactical Relics**: In the Relic Shop, prioritize defensive shields or ultimate amplification relics (like the *Infinity Gauntlet* or *Mjolnir*) for your primary fighter.
4. **Counter-Bidding**: If an opponent is running low on funds, place a minimum bid to force them into spending or concede the lot to you!`,
        quickChips: ['✨ Analyze active card', '⚔️ Strongest combos', '🛡️ Relic Guide']
      };
    }

    if (q.includes('synergy') || q.includes('combo') || q.includes('team up') || q.includes('pairs')) {
      return {
        text: `**Top Tag-Team Synergy Combos in the Game**:

• **Avengers Assembled**: *Captain America + Iron Man + Thor* (+30% Team ATK & Kinetic Guard)
• **Web Warriors**: *Spider-Man + Miles Morales + Ghost-Spider* (+25% Dodge & Web Trap)
• **Cosmic Overlords**: *Thanos + Galactus + Adam Warlock* (+40% Reality Distortion)
• **Wakandan Royalty**: *Black Panther + Shuri + Okoye* (+20% Vibranium Armor Absorption)
• **Midnight Sons**: *Moon Knight + Blade + Ghost Rider* (+25% Hellfire & Lifesteal)`,
        quickChips: ['⚔️ Compare Thor vs Thanos', '💡 Best Relics', '✨ Who is the strongest?']
      };
    }

    if (q.includes('boss raid') || q.includes('raid') || q.includes('boss fight') || q.includes('titan')) {
      return {
        text: `**Co-Op Boss Raid Guide**:
In Boss Raid mode, you and your squad take on cosmic titans like **Infinity Ultron (5,000 HP)**, **Galactus (8,500 HP)**, and **Infinity Gauntlet Thanos (12,000 HP)**!

• **Co-Op Stacking**: Build a shared equipment pool from the Relic Vault before engaging.
• **Turn Cycles**: Alternate between Guard actions on high-damage boss turns and Ultimate bursts when the Boss is staggered.
• **Defeat Rewards**: Conquering Titans yields exclusive Mythic trophies and leaderboard dominance.`,
        quickChips: ['⚔️ Thanos Boss Guide', '🛡️ Best Raid Team', '✨ Relics for Raids']
      };
    }

    // 6. Real-World Knowledge (Science, Tech, History, Culture, Logic)
    if (q.includes('quantum') || q.includes('physics') || q.includes('relativity') || q.includes('space') || q.includes('universe')) {
      return {
        text: `**A Look at Quantum Mechanics & the Cosmos**:

In real-world quantum physics, particles can exist in superpositions of multiple states simultaneously until observed (like Schrödinger's cat), and experience **quantum entanglement**—where states are linked across vast distances instantaneously.

In Marvel canon, the **Quantum Realm** draws inspiration from these real principles, imagining a subatomic dimension where traditional laws of space and time break down!`,
        quickChips: ['🚀 What is artificial intelligence?', '🌍 Tell me about the Multiverse', '✨ Back to Marvel']
      };
    }

    if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('machine learning') || q.includes('gemini') || q.includes('google')) {
      return {
        text: `**About Modern AI & Gemini**:

**Gemini** is Google's multimodal AI model family designed to understand, process, and combine information across text, code, audio, image, and video seamlessly. It operates using deep transformer architectures trained on vast multimodal datasets to solve complex reasoning problems with speed and natural understanding.`,
        quickChips: ['💡 How do neural networks work?', '✨ What can you help me with?', '⚔️ Thor vs Iron Man']
      };
    }

    if (q.includes('joke') || q.includes('funny') || q.includes('humor')) {
      return {
        text: `Why does Thor love lightning storms so much?\n\nBecause he finds them truly **striking**, and Odin said he needed to stay *grounded*! ⚡😄\n\nGot another topic on your mind?`,
        quickChips: ['✨ Tell me another joke', '⚔️ Marvel trivia', '💡 Bidding tip']
      };
    }

    // 7. General Real-World Catch-All
    return {
      text: `That's an interesting question! Whether we're talking about real-world science, history, coding, general life topics, or deep-diving into Marvel lore and card tournament strategy, I'm here for it.\n\nCould you tell me a little more about what specific angle you'd like to explore?`,
      quickChips: [
        '✨ Analyze the active auction card',
        '⚔️ Who are the top 5 powerhouse heroes?',
        '💡 Best auction bidding strategy?',
        '🛡️ What are the top team synergies?'
      ]
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
    let isApi = false;

    if (geminiApiKey) {
      responseText = await callLiveGeminiApi(text);
      if (responseText) isApi = true;
    }

    let extraData: { character?: Character; comparisonCharacters?: [Character, Character]; quickChips?: string[] } = {};

    if (!responseText) {
      const localResult = generateGeminiResponse(text);
      responseText = localResult.text;
      extraData = {
        character: localResult.character,
        comparisonCharacters: localResult.comparisonCharacters,
        quickChips: localResult.quickChips
      };
    } else {
      const matched = ALL_CHARACTERS.find(c => text.toLowerCase().includes(c.name.toLowerCase()));
      if (matched) extraData.character = matched;
      extraData.quickChips = ['✨ Analyze active card', '⚔️ Who is stronger?', '💡 Share a strategy'];
    }

    const geminiMsg: ChatMessage = {
      id: `${Date.now()}-gemini`,
      sender: 'gemini',
      text: responseText,
      timestamp: 'Now',
      ...extraData,
      isApiCall: isApi
    };

    setMessages(prev => [...prev, geminiMsg]);
    setIsTyping(false);
    playSound('clash');
    if (isVoiceEnabled) speakVoice(responseText);
  };

  return (
    <>
      {/* Floating Gemini AI Launcher Button */}
      <div className="fixed bottom-3 right-24 sm:bottom-5 sm:right-36 z-40 flex items-center gap-2">
        <button
          onClick={handleOpenToggle}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-indigo-200 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.9)] ring-2 ring-indigo-400'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white border-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.7)] hover:brightness-110'
          }`}
          title="Open Gemini AI Assistant"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60" />
            <Sparkles className="w-4 h-4 text-cyan-200 relative z-10 animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-xs tracking-wide">GEMINI AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
        </button>
      </div>

      {/* Gemini Chat Window Overlay */}
      {isOpen && (
        <div 
          className={`fixed transition-all duration-300 ease-out flex flex-col z-50 ${
            isMinimized
              ? 'bottom-3 right-3 sm:bottom-16 sm:right-6 w-[92vw] sm:w-96 h-14 bg-[#0B0F19]/95 border-2 border-indigo-500/70 rounded-2xl shadow-2xl backdrop-blur-2xl'
              : 'inset-x-2 bottom-2 sm:inset-x-auto sm:right-6 sm:bottom-16 w-auto sm:w-[450px] md:w-[480px] h-[85vh] sm:h-[600px] max-h-[90vh] bg-[#0B0F19]/95 border-2 border-indigo-500/80 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.45)] backdrop-blur-2xl ring-1 ring-indigo-400/40'
          } overflow-hidden`}
        >
          {/* Header */}
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border-b border-indigo-500/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.8)]">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                </div>
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-black text-xs text-white uppercase tracking-widest flex items-center gap-1">
                    <span>GEMINI</span>
                  </h3>
                  <span className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    geminiApiKey 
                      ? 'bg-purple-950/90 text-purple-200 border-purple-400/70 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                      : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/40'
                  }`}>
                    {geminiApiKey ? '✨ LIVE 2.0 FLASH' : 'AI ASSISTANT'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate max-w-[180px] sm:max-w-none">
                  {isSpeaking ? 'Speaking response...' : 'World Knowledge & Marvel Strategist'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => { soundManager.playClick(); setShowSettings(!showSettings); }}
                title="Gemini API Key Settings"
                className={`p-1.5 rounded-lg transition-colors ${showSettings || geminiApiKey ? 'text-purple-300 hover:bg-purple-950/60' : 'text-slate-400 hover:text-indigo-300 hover:bg-white/10'}`}
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isVoiceEnabled && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                title={isVoiceEnabled ? "Mute Voice Narration" : "Enable Voice Narration"}
                className={`p-1.5 rounded-lg transition-colors ${isVoiceEnabled ? 'text-cyan-400 hover:bg-cyan-950/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleMinimizeToggle}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleOpenToggle}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Settings Panel for Gemini API Key */}
              {showSettings && (
                <div className="p-3 sm:p-4 bg-slate-900/98 border-b border-indigo-500/40 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Google Gemini API Key
                    </span>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1 font-bold"
                    >
                      Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder={geminiApiKey ? "••••••••••••••••••••••••" : "Paste AIzaSy... API Key"}
                      className="flex-1 bg-black/80 border border-slate-700 focus:border-indigo-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button 
                      onClick={handleSaveApiKey} 
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0"
                    >
                      {keySavedMessage ? <Check className="w-4 h-4 text-emerald-300" /> : 'Save'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Optional: Connect your Gemini API key for live online web generation, or use the built-in natural intelligence engine offline anytime!
                  </p>
                </div>
              )}

              {/* Chat Message Scroll List */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-black/60">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[92%] sm:max-w-[90%] p-3 sm:p-3.5 rounded-2xl text-xs space-y-2.5 leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium rounded-tr-sm border border-indigo-400/50 shadow-lg' 
                          : 'bg-[#121726]/95 text-slate-100 font-normal rounded-tl-sm border border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.15)]'
                      }`}
                    >
                      {/* Message Content with Markdown Parsing */}
                      <div className="whitespace-pre-line text-[11px] sm:text-xs">
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i} className="block">
                            {line.split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} className="text-cyan-300 font-extrabold">{part}</strong> : part
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Character Spotlight Card */}
                      {msg.highlightCharacter && !msg.comparisonCharacters && (
                        <div className="mt-2.5 p-2 sm:p-2.5 rounded-xl bg-black/80 border border-indigo-500/50 flex items-center gap-2.5 sm:gap-3 shadow-inner">
                          <CharacterPortrait character={msg.highlightCharacter} size="sm" showBadge={true} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-black text-xs text-white truncate">{msg.highlightCharacter.name}</span>
                              <span className="text-[9px] sm:text-[10px] font-black text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/40">
                                ⚡ {msg.highlightCharacter.overallPower} PWR
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                              {msg.highlightCharacter.grade} Tier • Base ${msg.highlightCharacter.startingPrice}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Head-to-Head Comparison Card */}
                      {msg.comparisonCharacters && (
                        <div className="mt-2.5 p-2.5 sm:p-3 rounded-2xl bg-black/80 border border-indigo-400/60 space-y-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1">
                              <Swords className="w-3 h-3 text-amber-400" />
                              <span>TACTICAL MATCHUP ANALYSIS</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center bg-slate-900/80 p-2 rounded-xl border border-white/10 text-center">
                              <CharacterPortrait character={msg.comparisonCharacters[0]} size="sm" showBadge={true} />
                              <span className="font-extrabold text-xs text-white mt-1">{msg.comparisonCharacters[0].name}</span>
                              <span className="text-[9px] text-amber-400 font-bold">{msg.comparisonCharacters[0].overallPower} PWR</span>
                            </div>
                            <div className="flex flex-col items-center bg-slate-900/80 p-2 rounded-xl border border-white/10 text-center">
                              <CharacterPortrait character={msg.comparisonCharacters[1]} size="sm" showBadge={true} />
                              <span className="font-extrabold text-xs text-white mt-1">{msg.comparisonCharacters[1].name}</span>
                              <span className="text-[9px] text-amber-400 font-bold">{msg.comparisonCharacters[1].overallPower} PWR</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Suggestion Chips */}
                    {msg.quickChips && msg.quickChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[96%]">
                        {msg.quickChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(chip)}
                            className="px-2.5 sm:px-3 py-1 rounded-full bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-500/40 text-[9px] sm:text-[10px] font-bold transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 text-xs w-44 shadow-lg animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-medium text-[11px]">Gemini is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="p-2.5 sm:p-3 bg-[#080C14] border-t border-indigo-500/40 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Gemini anything (e.g. 'Thor vs Thanos', 'Scan card', 'Science')..."
                  className="flex-1 bg-black/80 border border-indigo-500/40 focus:border-cyan-400 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="p-2 sm:p-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 text-white rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-all transform hover:scale-105 active:scale-95 shrink-0"
                  title="Send to Gemini AI"
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
