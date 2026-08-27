import React, { useState, useRef, useEffect } from 'react';
import { GameState, Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { CharacterPortrait } from './CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import { resolveGeneralKnowledge, ResolvedAIResponse } from '../../data/aiKnowledgeEngine';
import { 
  Sparkles, X, Send, ChevronDown, ChevronUp, Zap, Shield, Swords, 
  Trash2, Volume2, VolumeX, Key, ExternalLink, RefreshCw, Bot, Globe,
  HelpCircle, Lightbulb, User, Heart, MessageCircle, AlertCircle
} from 'lucide-react';

interface Props {
  state?: GameState;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  characterCard?: Character;
  quickChips?: string[];
  isError?: boolean;
}

export function GeminiChatbot({ state }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Chatbot Modes: 'gemini' (General AI & Comics) vs 'strategist' (Website Only)
  const [chatMode, setChatMode] = useState<'gemini' | 'strategist'>('gemini');

  // API Key State
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_ai_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [keySaveStatus, setKeySaveStatus] = useState<string | null>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [geminiMessages, setGeminiMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-gemini',
      role: 'model',
      text: "Hello! I'm Gemini, your general-purpose AI assistant. Feel free to ask me anything—whether it's math, physics, programming, biology, history, writing, philosophy, or everyday questions.\n\nWhat would you like to explore today?",
      timestamp: 'Now',
      quickChips: [
        '🚀 Difference between velocity & acceleration',
        '💻 Write a JS function to reverse a string',
        '🧠 Who was Albert Einstein?',
        '🎉 Give me ideas for a birthday party',
        '🌿 Explain photosynthesis simply'
      ]
    }
  ]);

  const [strategistMessages, setStrategistMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-strategist',
      role: 'model',
      text: "Greetings, Commander! I'm the **Marvel Strategist** ⚡\n\nI'm your dedicated tactical expert for **Marvel Auction Wars**. I analyze 350 card stats, 5 unique signature skills, auction bidding valuations, Ancient Ruins Dungeons, and 1v1 tournament battle counter-picks.\n\nHow can I help power up your squad?",
      timestamp: 'Now',
      quickChips: [
        '🏆 Who are the top Grade A heroes?',
        '💰 What is the best bidding strategy?',
        '⚡ Explain faction synergy bonuses',
        '🛡️ Best counters against Cosmic bosses',
        '🕸️ How much should I bid on Spider-Man?'
      ]
    }
  ]);

  const messages = chatMode === 'gemini' ? geminiMessages : strategistMessages;
  const setMessages = (updater: React.SetStateAction<ChatMessage[]>) => {
    if (chatMode === 'gemini') {
      setGeminiMessages(updater);
    } else {
      setStrategistMessages(updater);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Clean up voice synthesis on unmount
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
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/[`_]/g, '')
      .replace(/[✨⚔️🛡️💡🚀🌍🔥🔮👋🌌]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
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

  const handleModeToggle = (mode: 'gemini' | 'strategist') => {
    soundManager.playClick();
    setChatMode(mode);
  };

  const handleSaveApiKey = () => {
    soundManager.playClick();
    const cleanKey = keyInput.trim();
    if (cleanKey) {
      localStorage.setItem('gemini_ai_api_key', cleanKey);
      setGeminiApiKey(cleanKey);
      setKeySaveStatus('API Key saved successfully! 🚀');
      setTimeout(() => {
        setKeySaveStatus(null);
        setShowSettings(false);
      }, 1200);
    } else {
      localStorage.removeItem('gemini_ai_api_key');
      setGeminiApiKey('');
      setKeySaveStatus('API Key removed. Using server engine.');
      setTimeout(() => {
        setKeySaveStatus(null);
        setShowSettings(false);
      }, 1200);
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
    if (chatMode === 'gemini') {
      setGeminiMessages([
        {
          id: 'reset-gemini',
          role: 'model',
          text: "Chat cleared! I'm Gemini, ready for any question on science, coding, history, writing, or everyday curiosity.",
          timestamp: 'Now',
          quickChips: [
            '✨ Explain quantum computing simply',
            '🐍 How do I start learning Python?',
            '💡 Help me brainstorm creative ideas'
          ]
        }
      ]);
    } else {
      setStrategistMessages([
        {
          id: 'reset-strategist',
          role: 'model',
          text: "Tactical log cleared! Marvel Strategist standing by for character evaluations and combat calculations.",
          timestamp: 'Now',
          quickChips: [
            '🏆 Who are the top Grade A heroes?',
            '💰 What is the best bidding strategy?',
            '⚡ Explain faction synergy bonuses'
          ]
        }
      ]);
    }
  };

  // Build System Prompt based on Mode (Strict Separation)
  const getSystemInstruction = () => {
    if (chatMode === 'strategist') {
      const activeLot = state?.auction?.currentCharacter;
      let liveGameState = '';
      if (activeLot) {
        liveGameState = `\nActive Game Context: Currently in Auction phase. Active card on auction block is "${activeLot.name}" (Grade ${activeLot.grade}, Overall Power: ${activeLot.overallPower}, Base Price: $${activeLot.startingPrice}M).`;
      }

      return `You are the specialized MARVEL STRATEGIST AI for the game "MARVEL: AUCTION WARS" (Tagline: "BID. BUILD. BATTLE.").
Your purpose is providing expert tactical analysis, pro tips, auction bidding guides, hero tier lists, skill vault combos, and combat coaching for the player.
When the user asks for tips, tricks, secrets, or strategy advice:
- Always deliver comprehensive, actionable game tips formatted with clear headings, bullet points, and pro-tips covering:
  1. 💰 Auction Bidding Mastery (sniper bidding, budget allocation, bluffing bots/rivals, Chaos Auction events).
  2. 🏆 Hero Tier Lists & Value Picks (Grade C budget bargains, Grade B versatile anchors, Grade A juggernauts, and Grade MYTHIC game-changers).
  3. ⚡ Skill Vault & Artifacts (synergizing 5 unique signature abilities, equipping and timing Healing Potions during battles).
  4. ⚔️ 1v1 Tournament Battle Tactics (Strike vs Innate Special vs 50% Guard timing, faction counters, LAST STAND overdrive).
  5. 🔮 Ancient Ruins Dungeons (Waves 1-300 scaling strategies, potion pacing, milestone boss counters).
- Provide detailed, full-length advice with no artificial text restrictions.
${liveGameState}`;
    }

    return `You are a helpful, general-purpose AI assistant. Answer the user's questions accurately, clearly, thoroughly, and naturally. You can discuss any subject the user asks about. Follow the user's current request and do not assume the conversation is about any particular topic unless the user establishes that context. There is NO text, character, or word limit on your responses; provide comprehensive, complete, and unconstrained answers whenever helpful.`;
  };

  // Call Google Gemini API via Secure Server Proxy or Direct API
  const sendToGemini2Flash = async (userPrompt: string, history: ChatMessage[]): Promise<{ text: string; quickChips?: string[] }> => {
    const systemPrompt = getSystemInstruction();

    // Prepare multi-turn messages
    const contents = history
      .filter(m => !m.id.startsWith('welcome') && !m.id.startsWith('reset'))
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const apiKeyToUse = geminiApiKey.trim();

    // 1. Primary: Call Secure Server Proxy (/api/gemini/chat) which has process.env.GEMINI_API_KEY
    try {
      const serverRes = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: chatMode,
          apiKey: apiKeyToUse || undefined,
          messages: contents.map(c => ({ role: c.role, content: c.parts[0].text }))
        })
      });

      if (serverRes.ok) {
        const sData = await serverRes.json();
        if (sData.text) {
          return {
            text: sData.text,
            quickChips: chatMode === 'gemini' 
              ? ['✨ Tell me more', '💡 Give me an example', '❓ Explore related concepts']
              : ['🏆 Who are the top Grade A heroes?', '💰 Best bidding strategy?', '⚡ Faction synergy bonuses']
          };
        }
      }
    } catch (serverErr) {
      console.warn('[Gemini Server Proxy Error]', serverErr);
    }

    // 2. Secondary: Direct client call if user provided a custom key
    if (apiKeyToUse) {
      const clientModels = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-pro'];
      for (const mName of clientModels) {
        try {
          const urlFlash = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${apiKeyToUse}`;
          const response = await fetch(urlFlash, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: contents,
              generationConfig: { maxOutputTokens: 8192, temperature: chatMode === 'gemini' ? 0.7 : 0.85 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              return {
                text: candidateText,
                quickChips: chatMode === 'gemini' 
                  ? ['✨ Tell me more', '💡 Give me an example', '❓ Explore related concepts']
                  : ['🏆 Who are the top Grade A heroes?', '💰 Best bidding strategy?', '⚡ Faction synergy bonuses']
              };
            }
          }
        } catch (clientErr) {
          console.warn(`[Gemini Client Error on ${mName}]`, clientErr);
        }
      }
    }

    // 3. Built-in Conversational & Encyclopedic General Knowledge Engine (Instant zero-fail fallback)
    return await generateSmartConversationalReply(userPrompt, history);
  };

  // Built-in Natural Conversational AI with Encyclopedic Knowledge Lookup
  const generateSmartConversationalReply = async (prompt: string, _history: ChatMessage[]): Promise<{ text: string; quickChips?: string[] }> => {
    const q = prompt.toLowerCase().trim();

    // ==========================================
    // A. MARVEL STRATEGIST MODE (Game Tactics Only)
    // ==========================================
    if (chatMode === 'strategist') {
      // General Pro Tips / How to Win Guide
      if (q.includes('tip') || q.includes('advice') || q.includes('how to win') || q.includes('strategy') || q.includes('guide') || q.includes('how to play')) {
        return {
          text: `🎯 **Marvel Strategist Master Pro-Tips & Winning Guide:** ⚡\n\n` +
            `### 1. 💰 **Auction Phase Mastery (The 40/60 Rule)**\n` +
            `- **Don't Blow Your Budget Early**: Keep at least **40% of your starting cash** for late-round Grade A and Mythic cards ($20M-$35M).\n` +
            `- **Value Hunting**: Grade C and B heroes ($2M-$6M) offer massive power-per-dollar. Pair them with faction synergizers for +10% bonuses.\n` +
            `- **Chaos Auctions**: Watch for special modifiers like *Free Relic* or *Double Power* to steal high-leverage cards.\n\n` +
            `### 2. ⚡ **Equipment & Skill Vault Optimization**\n` +
            `- **Equip Healing Potions**: Always buy at least 1 **Super Soldier Healing Serum** ($3M) or **Heart-Shaped Herb Elixir** ($6M) for clutch +40 to +60 HP recovery in tournaments.\n` +
            `- **5 Signature Skills**: Each hero has 5 unique unlocked abilities. Balance 1 Heavy Nuke, 1 Defensive Guard, and 1 Status Inflictor.\n\n` +
            `### 3. ⚔️ **1v1 Tournament Battle Tactics**\n` +
            `- **Predict Enemy Moves**: If your opponent has high Power, anticipate their **Special Strike** and use **🛡️ Defensive Guard (50% Damage Reduction)**.\n` +
            `- **⚡ LAST STAND Overdrive**: When reduced to **≤ 25% HP**, your hero triggers Last Stand (+3 Power & +15% DEF). Use your biggest signature ability here for a comeback reversal!\n\n` +
            `### 4. 🔮 **Ancient Ruins Dungeons (Waves 1-300)**\n` +
            `- **Pacing**: Conserve Healing Potions for Boss Milestone Waves (Waves 50, 100, 150, 200, 250, 300).`,
          quickChips: [
            '💰 Top auction bidding tips',
            '⚔️ 1v1 battle counter tips',
            '🔮 Dungeon Wave 1-300 tips',
            '🏆 Best Grade A budget heroes'
          ]
        };
      }

      // Specific Bidding Tips
      if (q.includes('bid') || q.includes('auction') || q.includes('money') || q.includes('cash')) {
        return {
          text: `💰 **Marvel Strategist: Auction Bidding Tactics & Economy:**\n\n` +
            `1. **The Sniper Bid**: Wait until the timer drops below 3 seconds before raising to force rivals into rushed overbids.\n` +
            `2. **Bluff Bidding**: Incrementally bid on cards you don't need to bleed rival treasuries, but stop before the base price doubles.\n` +
            `3. **Tier Price Ceilings**:\n` +
            `   - **Grade C ($1-$5M)**: Never exceed **$7M**.\n` +
            `   - **Grade B ($6-$12M)**: Fair value up to **$15M**.\n` +
            `   - **Grade A ($13-$22M)**: Worth contesting up to **$28M**.\n` +
            `   - **Grade MYTHIC ($23-$35M+)**: Game-deciding anchors. Worth pushing up to **$45M** if you have synergy partners!`,
          quickChips: ['🏆 Top Mythic heroes list', '⚡ Faction synergy bonus breakdown', '🧪 Best items in Equipment Shop']
        };
      }

      // Battle & Combat Tips
      if (q.includes('battle') || q.includes('combat') || q.includes('fight') || q.includes('duel') || q.includes('tournament')) {
        return {
          text: `⚔️ **Marvel Strategist: 1v1 Tournament Battle Guide:**\n\n` +
            `1. **Turn 1 Strategy**: Open with **⚔️ Strike Attack** to test opponent defenses and gauge their speed roll.\n` +
            `2. **Guarding Big Specials**: When an enemy charges their Special or signature skill, activate **🛡️ Defensive Guard** to absorb 50% of incoming damage.\n` +
            `3. **Healing Timing**: Deploy your **🧪 Healing Potion** when your HP is between 30%–50% to ensure you don't overflow max HP while staying safe from lethal burst combos.\n` +
            `4. **Exploiting Factions**: Cosmic beats Mystic, Tech counters Mutants, and Street-Level excels at agility counter-strikes!`,
          quickChips: ['⚡ LAST STAND mechanic tips', '🧪 How to use healing potions in battle', '🏆 Roster counter-picks']
        };
      }

      if (q.includes('spider-man') || q.includes('spiderman')) {
        return {
          text: `**Marvel Strategist Auction Dossier: Spider-Man** 🕸️\n\n- **Grade Tier**: Grade A / Grade S\n- **Power Rating**: ~85 Power\n- **Signature Mechanics**: *Spider-Sense Counter* provides top-tier evasion against heavy strikes, plus web-snare control.\n- **Recommended Max Bid**: **$12M – $16M**.\n- **Tactical Synergy**: Pairs exceptionally well with **Avengers** (Iron Man, Cap) or **Street Level / Defenders** for +10% power bonuses.\n- **Dungeon Utility**: High agility makes Peter Parker a staple dodge-tank for Ancient Ruins Waves 40–120.`,
          quickChips: ['💰 Spider-Man bidding range', '🛡️ Best counters against Spider-Man', '⚡ Web-Slinger duo combos']
        };
      }

      if (q.includes('doom') || q.includes('dr doom') || q.includes('doctor doom')) {
        return {
          text: `**God Emperor Doom / Doctor Doom (Tactical Analysis):** 👑\n\n- **Tier & Grade**: Grade MYTHIC (Power: 97/100)\n- **Starting Price**: $28M Base\n- **Key Skills**: *Reality Rewrite Mastery*, *Molecular Reversal*, *Doombot Swarm*, *Crimson Bands of Cyttorak*, *Cosmic Siphon*\n- **Best Synergies**: Pair with **Scarlet Witch** or **Namor** (Cabal Synergy) for +12% Team Strike bonus!\n- **Auction Advice**: Doom is a top-tier anchor card. Secure him if bids stay under $45M.`,
          quickChips: ['👑 God Emperor Doom stats', '⚔️ Counters for Doctor Doom', '🔮 Best Mystic faction combos']
        };
      }

      if (q.includes('dungeon') || q.includes('ancient ruin') || q.includes('wave')) {
        return {
          text: `**Ancient Ruins Dungeons Mode (Waves 1-300):** 🔮\n\n- **Wave Progression**: Battle 1 to 300 scaling waves across 10 rotating ancient environments.\n- **Milestone Customizer**: Pre-set which waves introduce Grade C, B, A, S, and Cosmic Mythic enemies.\n- **Stone Altar Summoner**: Summon randomized heroes with full 5-skill integrity to build your team.\n- **Healing Belt**: Restore HP using tactical potions between wave battles!`,
          quickChips: ['🔮 Best Dungeon starting team', '🧪 How to get more healing potions', '👑 Wave 100 boss strategy']
        };
      }

      return {
        text: `**Marvel Strategist Tactical Assessment:** ⚡\n\nAnalyzing **"${prompt}"** across the 350-character roster and combat engine:\n1. **Roster Synergy**: Focus on assembling multi-tier faction combos for up to +15% power bonuses.\n2. **Auction Economy**: Manage your treasury to ensure you can compete for late-game Grade S and Mythic anchor cards.\n3. **Signature Skills**: Unleash your hero's 5 unique skills during critical tournament playoff matches!`,
        quickChips: ['🎯 Give me winning pro-tips', '💰 Best bidding strategy', '⚔️ 1v1 combat guide']
      };
    }

    // ==========================================
    // B. GENERAL GEMINI AI MODE (Clean General AI)
    // ==========================================
    // Greetings & Casual check-in
    if (/^(hi|hello|hey|greetings|howdy|sup|yo|what's up|good morning|good evening|good afternoon)\b/.test(q)) {
      const greetings = [
        "Hello! How can I help you today? Feel free to ask about any topic—from coding and physics to history, math, or creative writing.",
        "Hey there! I'm here and ready to help. What would you like to explore today?",
        "Hello! Great to connect with you. What can I assist you with today?"
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        quickChips: ['🚀 Difference between velocity & acceleration', '💻 Write a JS function to reverse a string', '🧠 Who was Albert Einstein?']
      };
    }

    // Master Factual & Live Knowledge Engine (Zero Marvel bias)
    const generalResult: ResolvedAIResponse = await resolveGeneralKnowledge(prompt);
    return {
      text: generalResult.text,
      quickChips: generalResult.quickChips
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputQuery).trim();
    if (!text || isTyping) return;

    soundManager.playClick();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: text,
      timestamp: 'Now'
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      const geminiResult = await sendToGemini2Flash(text, newHistory);
      
      // Highlight card ONLY in strategist mode when discussing specific characters
      let matchedHero: Character | undefined = undefined;
      if (chatMode === 'strategist') {
        matchedHero = ALL_CHARACTERS.find(c => text.toLowerCase().includes(c.name.toLowerCase()));
      }

      const modelMsg: ChatMessage = {
        id: `${Date.now()}-gemini`,
        role: 'model',
        text: geminiResult.text,
        timestamp: 'Now',
        characterCard: matchedHero,
        quickChips: geminiResult.quickChips || (chatMode === 'gemini' 
          ? ['✨ Tell me more', '💡 Give me an example', '❓ Explore related concepts']
          : ['🏆 Top Grade A heroes', '💰 Bidding strategy', '⚡ Synergy bonuses'])
      };

      setMessages(prev => [...prev, modelMsg]);
      setIsTyping(false);
      playSound('clash');
      if (isVoiceEnabled) speakVoice(geminiResult.text);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: 'model',
          text: "Sorry, I had trouble generating a response. Please try again or check your API key!",
          timestamp: 'Now',
          isError: true
        }
      ]);
    }
  };

  // Helper to format basic markdown (bold, lists, code, line breaks)
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, lIdx) => {
          if (!line.trim()) return <div key={lIdx} className="h-1" />;

          // Bullet points
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1">
                <span className="text-cyan-400 mt-1 shrink-0">•</span>
                <span>{renderInlineMarkdown(line.slice(2))}</span>
              </div>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+\.)\s(.*)/);
            if (match) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1">
                  <span className="text-amber-400 font-bold shrink-0">{match[1]}</span>
                  <span>{renderInlineMarkdown(match[2])}</span>
                </div>
              );
            }
          }

          // Heading
          if (line.startsWith('### ')) {
            return (
              <h4 key={lIdx} className="font-heading font-black text-xs text-amber-300 uppercase tracking-wide pt-1">
                {renderInlineMarkdown(line.slice(4))}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={lIdx} className="font-heading font-black text-sm text-cyan-300 uppercase tracking-wider pt-1">
                {renderInlineMarkdown(line.slice(3))}
              </h3>
            );
          }

          return <p key={lIdx}>{renderInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineMarkdown = (content: string) => {
    // Split by bold (**text**)
    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-black text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={pIdx} className="bg-black/60 text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 rounded border border-cyan-500/30">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Gemini AI Launcher Button (Pinned to Bottom-Right Corner - Image 4) */}
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2">
        <button
          onClick={handleOpenToggle}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-indigo-200 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.9)] ring-2 ring-indigo-400'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white border-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.7)] hover:brightness-110'
          }`}
          title="Open Gemini 2.0 Flash AI Assistant"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60" />
            <Sparkles className="w-4 h-4 text-cyan-200 relative z-10 animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-xs tracking-wide">GEMINI 2.0 FLASH</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
        </button>
      </div>

      {/* Gemini Chat Window Overlay */}
      {isOpen && (
        <div 
          className={`fixed transition-all duration-300 ease-out flex flex-col z-50 ${
            isMinimized
              ? 'bottom-3 right-3 sm:bottom-16 sm:right-6 w-[92vw] sm:w-96 h-14 bg-[#0B0F19]/95 border-2 border-indigo-500/70 rounded-2xl shadow-2xl backdrop-blur-2xl'
              : 'inset-x-2 bottom-2 sm:inset-x-auto sm:right-6 sm:bottom-16 w-auto sm:w-[460px] md:w-[500px] h-[85vh] sm:h-[620px] max-h-[90vh] bg-[#080C16]/98 border-2 border-indigo-500/80 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.5)] backdrop-blur-2xl ring-1 ring-indigo-400/40'
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
                  <h3 className="font-heading font-black text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-1">
                    <span>{chatMode === 'gemini' ? 'GEMINI' : 'MARVEL STRATEGIST'}</span>
                  </h3>
                  <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded border bg-purple-950/90 text-purple-200 border-purple-400/70 shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    {chatMode === 'gemini' ? 'FLASH AI' : 'TACTICAL AI'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate max-w-[180px] sm:max-w-none">
                  {isSpeaking 
                    ? 'Speaking response...' 
                    : chatMode === 'gemini' 
                    ? 'General-Purpose AI & World Knowledge' 
                    : 'Tournament Combat & Auction Specialist'}
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
                title={isVoiceEnabled ? 'Voice output enabled' : 'Voice output disabled'}
                className={`p-1.5 rounded-lg transition-colors ${isVoiceEnabled ? 'text-cyan-300 bg-cyan-950/80' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleMinimizeToggle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleOpenToggle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chatbot Mode Switcher: Normal Gemini vs Marvel Strategist */}
          {!isMinimized && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#060912] border-b border-indigo-500/30 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { soundManager.playClick(); setChatMode('gemini'); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border ${
                    chatMode === 'gemini'
                      ? 'bg-gradient-to-r from-indigo-900 to-cyan-950 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.35)]'
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Normal Gemini</span>
                </button>

                <button
                  onClick={() => { soundManager.playClick(); setChatMode('strategist'); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border ${
                    chatMode === 'strategist'
                      ? 'bg-gradient-to-r from-red-950 to-amber-950 text-amber-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Swords className="w-3 h-3 text-red-400" />
                  <span>Marvel Strategist</span>
                </button>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                {chatMode === 'gemini' ? '🌐 World & Comics AI' : '⚡ Website Only'}
              </span>
            </div>
          )}

          {/* Settings Panel (Gemini API Key input) */}
          {showSettings && !isMinimized && (
            <div className="p-3 bg-[#0E1424] border-b border-indigo-500/40 text-xs space-y-2 animate-fadeIn shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-heading font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>GOOGLE GEMINI 2.0 FLASH API KEY</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold underline"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[10px] text-slate-300">
                Paste your free Gemini API key to enable unrestricted, ultra-fast Gemini 2.0 Flash reasoning for general knowledge and chat:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={geminiApiKey ? '••••••••••••••••••••' : 'AIzaSy...'}
                  className="flex-1 bg-black/80 border border-purple-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-heading font-black text-[10px] uppercase shadow"
                >
                  Save Key
                </button>
              </div>
              {keySaveStatus && (
                <span className="text-[10px] text-emerald-400 font-bold block animate-fadeIn">
                  {keySaveStatus}
                </span>
              )}
            </div>
          )}

          {/* Main Chat Scroll Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 custom-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[84%] rounded-2xl p-3 sm:p-3.5 transition-all shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-br-none shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                          : msg.isError
                          ? 'bg-red-950/90 text-red-200 border border-red-500/50 rounded-bl-none'
                          : 'bg-[#10172A]/90 text-slate-100 border border-indigo-500/30 rounded-bl-none shadow-glow-cosmic'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[9px] sm:text-[10px] font-bold">
                        <span className="flex items-center gap-1">
                          {msg.role === 'user' ? <User className="w-3 h-3 text-indigo-200" /> : <Sparkles className="w-3 h-3 text-cyan-400" />}
                          <span>{msg.role === 'user' ? 'You' : (chatMode === 'gemini' ? 'Gemini AI' : 'Marvel Strategist')}</span>
                        </span>
                        <span className="font-mono text-[9px]">{msg.timestamp}</span>
                      </div>

                      {/* Message Text with Markdown formatting */}
                      {renderFormattedMarkdown(msg.text)}

                      {/* Character Card Badge if matched */}
                      {msg.characterCard && (
                        <div className="mt-2.5 p-2 rounded-xl bg-black/70 border border-cyan-500/40 flex items-center gap-2.5">
                          <CharacterPortrait character={msg.characterCard} size="sm" showBadge={true} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-black text-xs text-white truncate">{msg.characterCard.name}</span>
                              <span className="text-[9px] bg-red-950 text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                                {msg.characterCard.grade}
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-bold block">
                              ⚡ Power: {msg.characterCard.overallPower} • ${msg.characterCard.startingPrice}M
                            </span>
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
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 text-xs w-48 shadow-lg animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-medium text-[11px]">{chatMode === 'gemini' ? 'Gemini is thinking...' : 'Strategist is analyzing...'}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="p-2.5 sm:p-3 bg-[#060911] border-t border-indigo-500/40 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Gemini anything (General knowledge, feelings, science, tactics)..."
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
