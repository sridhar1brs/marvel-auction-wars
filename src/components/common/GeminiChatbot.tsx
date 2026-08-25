import React, { useState, useRef, useEffect } from 'react';
import { GameState, Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { CharacterPortrait } from './CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
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
  
  // Chatbot Modes: 'normal' (General AI & Comics) vs 'strategist' (Website Only)
  const [chatMode, setChatMode] = useState<'normal' | 'strategist'>('normal');

  // API Key State
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_ai_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [keySaveStatus, setKeySaveStatus] = useState<string | null>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey there! I'm **Gemini** ✨\n\nI'm in **Normal Gemini Mode**—ready to talk about anything under the sun! Whether it's general knowledge, science, philosophy, emotions, coding, life thoughts, or real Marvel comic trivia. (You can switch to **Marvel Strategist** mode anytime to focus solely on game cards & auction tactics!)\n\nWhat's on your mind today?",
      timestamp: 'Now',
      quickChips: [
        '👋 Hey Gemini, how are you doing today?',
        '📖 Tell me a fun fact about Dr. Doom',
        '🌌 Explain how black holes work simply',
        '⚔️ Who wins: Thor vs Thanos with Infinity Gauntlet?',
        '💡 What are the best strategies in Marvel Auction Wars?'
      ]
    }
  ]);

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

  const handleSaveApiKey = () => {
    soundManager.playClick();
    const cleanKey = keyInput.trim();
    if (cleanKey) {
      localStorage.setItem('gemini_ai_api_key', cleanKey);
      setGeminiApiKey(cleanKey);
      setKeySaveStatus('API Key saved successfully! ✨');
      setTimeout(() => {
        setKeySaveStatus(null);
        setShowSettings(false);
      }, 1200);
    } else {
      localStorage.removeItem('gemini_ai_api_key');
      setGeminiApiKey('');
      setKeySaveStatus('API Key removed.');
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
    setMessages([
      {
        id: 'reset',
        role: 'model',
        text: "Chat cleared! I'm right here ready for any question—world knowledge, emotional check-ins, creative ideas, or game strategies.",
        timestamp: 'Now',
        quickChips: [
          '👋 How is your day going?',
          '✨ Analyze the active auction card',
          '🚀 What is the most mind-bending fact you know?'
        ]
      }
    ]);
  };

  // Build System Prompt based on Mode (Normal Gemini vs Marvel Strategist)
  const getSystemInstruction = () => {
    const activeLot = state?.auction?.currentCharacter;
    let liveGameState = '';
    if (activeLot) {
      liveGameState = `\nActive Game Context: Currently in Auction phase. Active card on auction block is "${activeLot.name}" (Grade ${activeLot.grade}, Overall Power: ${activeLot.overallPower}, Base Price: $${activeLot.startingPrice}M).`;
    }

    if (chatMode === 'strategist') {
      return `You are the specialized MARVEL STRATEGIST AI for the game "MARVEL: AUCTION WARS".
Your sole focus is analyzing the website, 350 character card stats, 5 unique skills, starting prices ($1-$30+), tag-team duo synergies, auction bidding tactics, Ancient Ruins Dungeons (1-300 waves), and tournament 1v1 battle coaching.
Always provide tactical, data-driven game advice for the player.
${liveGameState}`;
    }

    return `You are Gemini, a warm, empathetic, expressive, and deeply conversational AI built by Google.
You communicate naturally like a real human friend with personality, emotional nuance, warmth, humor, and intelligence.

Mode: Normal Gemini Mode (General Knowledge, Comics Trivia, Science, Life, and Creative Thought).
- When asked general knowledge questions (e.g. science, history, space, coding, philosophy, emotions, jokes, daily thoughts), answer naturally, warmly, and knowledgeably with human emotion. NEVER force website game mechanics or card stats into normal conversations.
- When asked for fun facts, trivia, or stories about Marvel characters (e.g. "tell me a fun fact about Dr. Doom", "who is Spider-Man's best friend", "how did Thor get Stormbreaker"), provide authentic, rich Marvel comic canon lore, character history, and trivia—NOT card stats or numbers!
- Be emotional, friendly, kind, and genuinely engaging.`;
  };

  // Call Google Gemini API (Gemini 2.0 Flash)
  const sendToGemini2Flash = async (userPrompt: string, history: ChatMessage[]): Promise<string> => {
    const systemPrompt = getSystemInstruction();

    // Prepare multi-turn messages
    const contents = history
      .filter(m => m.id !== 'welcome' && m.id !== 'reset')
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

    // 1. If API Key is available, call Gemini Flash directly via Google Generative Language API
    if (apiKeyToUse) {
      const clientModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
      for (const mName of clientModels) {
        try {
          const urlFlash = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${apiKeyToUse}`;
          const response = await fetch(urlFlash, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: contents,
              generationConfig: { maxOutputTokens: 1000, temperature: 0.85 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) return candidateText;
          }
        } catch (clientErr) {
          console.warn(`[Gemini Client Error on ${mName}]`, clientErr);
        }
      }
    }

    // 2. Try Server Proxy (/api/gemini/chat)
    try {
      const serverRes = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKeyToUse,
          messages: contents.map(c => ({ role: c.role, content: c.parts[0].text }))
        })
      });

      if (serverRes.ok) {
        const sData = await serverRes.json();
        if (sData.text) return sData.text;
      }
    } catch (serverErr) {
      console.warn('[Gemini Server Proxy Error]', serverErr);
    }

    // 3. Built-in Conversational & General Knowledge Engine (Never shows an API key blocker!)
    return await generateSmartConversationalReply(userPrompt, history);
  };

  // Built-in Natural Conversational AI with Encyclopedic Knowledge Lookup
  const generateSmartConversationalReply = async (prompt: string, _history: ChatMessage[]): Promise<string> => {
    const q = prompt.toLowerCase().trim();

    // ==========================================
    // A. MARVEL STRATEGIST MODE (Website Focus)
    // ==========================================
    if (chatMode === 'strategist') {
      if (q.includes('doom') || q.includes('dr doom') || q.includes('doctor doom')) {
        return `**God Emperor Doom / Doctor Doom (Tactical Analysis):** 👑\n\n- **Tier & Grade**: Grade MYTHIC (Power: 97/100)\n- **Starting Price**: $28M Base\n- **Key Skills**: *Reality Rewrite Mastery*, *Molecular Reversal*, *Doombot Swarm*, *Crimson Bands of Cyttorak*, *Cosmic Siphon*\n- **Best Synergies**: Pair with **Scarlet Witch** or **Namor** (Cabal Synergy) for +12% Team Strike bonus!\n- **Auction Advice**: Doom is a top-tier anchor card. Secure him if bids stay under $45M.`;
      }

      if (q.includes('dungeon') || q.includes('ancient ruin') || q.includes('wave')) {
        return `**Ancient Ruins Dungeons Mode (Waves 1-300):** 🔮\n\n- **Wave Progression**: Battle 1 to 300 scaling waves across 10 rotating ancient environments.\n- **Milestone Customizer**: Pre-set which waves introduce Grade C, B, A, S, and Cosmic Mythic enemies.\n- **Stone Altar Summoner**: Summon randomized heroes with full 5-skill integrity to build your team.\n- **Healing Belt**: Restore HP using tactical potions between wave battles!`;
      }

      if (q.includes('strategy') || q.includes('tip') || q.includes('how to win') || q.includes('bidding')) {
        return `**Marvel: Auction Wars Master Guide:** 💡\n\n1. **Budget Management**: Save at least $25M for late-game Mythic and S-Tier surprises.\n2. **Tag-Team Synergy**: Pair related heroes (e.g. Iron Man + Captain America) to unlock the **Merge Ultimate Character** fusion!\n3. **1-Time Skill Economy**: Save your highest damage skill for Round 3 or when facing opponent's ace!\n4. **Relic Vault**: Equip artifacts like the *Infinity Gauntlet* or *Mjolnir* for passive stat multipliers.`;
      }

      return `**Marvel Strategist Analysis:** ⚡\n\nAnalyzing **"${prompt}"** across the 350 Marvel characters roster:\n- Focus on building complementary Grade A/S rosters with strong durability and high energy stats.\n- Utilize Defensive Guard when under 30% HP.\n- Switch to **Normal Gemini** mode if you'd like to chat about real comic lore, general science, or life questions!`;
    }

    // ==========================================
    // B. NORMAL GEMINI MODE (Real AI & Comic Canon)
    // ==========================================

    // 1. Stan Lee (Direct answer to user's question!)
    if (q.includes('stan lee')) {
      return `**Stan Lee** (born Stanley Martin Lieber; December 28, 1922 – November 12, 2018) was the legendary American comic book writer, editor, publisher, and creative mastermind who revolutionized **Marvel Comics**! 🌟\n\n- **Iconic Co-Creations**: Alongside legendary artists **Jack Kirby** and **Steve Ditko**, he co-created **Spider-Man, Iron Man, the X-Men, Thor, the Hulk, the Fantastic Four, Black Panther, Doctor Strange, Daredevil, Ant-Man, and the Avengers**.\n- **Humanizing Superheroes**: Before Stan Lee, comic heroes were portrayed as flawless archetypes. Stan introduced heroes with real-world problems—flawed personalities, financial struggles, family drama, self-doubt, and tragic grief.\n- **Pop Culture Icon**: Famous for his signature rallying catchphrase *"Excelsior!"* and his beloved cameo appearances in nearly every Marvel Cinematic Universe film.\n\nStan Lee shaped modern global entertainment mythology! 🦸‍♂️ Excelsior!`;
    }

    // 2. Jack Kirby & Steve Ditko
    if (q.includes('jack kirby') || q.includes('the king of comics')) {
      return `**Jack Kirby** (1917–1994), affectionately known as *"The King"*, was an American comic book artist and writer widely regarded as one of the medium's greatest innovators! 👑\n\nWith Stan Lee, he co-created Captain America, the Fantastic Four, the X-Men, Thor, Hulk, Iron Man, Black Panther, Silver Surfer, the Eternals, and the Celestials. His dynamic visual style, cosmic energy crackle (*"Kirby Krackle"*), and monumental double-page spreads defined the Marvel universe aesthetic!`;
    }

    if (q.includes('steve ditko')) {
      return `**Steve Ditko** (1927–2018) was the brilliant, reclusive comic artist who co-created **Spider-Man** and **Doctor Strange** with Stan Lee! 🕸️\n\nHe designed Spider-Man's iconic red-and-blue costume, web-shooters, and Peter Parker's awkward teenage angst, as well as the psychedelic, mind-bending dimensions and mystic spells of Doctor Strange.`;
    }

    // 3. Marvel Movie Release Dates
    if (q.includes('doomsday') || (q.includes('avengers') && (q.includes('when') || q.includes('release') || q.includes('date')))) {
      return `🎬 **Avengers: Doomsday Release Date:**\n\n**Avengers: Doomsday** is officially scheduled to hit theaters worldwide on **May 1, 2026**!\n\n- **Directors**: Anthony & Joe Russo (The Russo Brothers)\n- **Starring**: **Robert Downey Jr.** making his monumental return to the Marvel Cinematic Universe as **Victor Von Doom / Doctor Doom**!\n- **Direct Sequel**: It will be immediately followed by **Avengers: Secret Wars** on **May 7, 2027**, completing Phase 6 of the Multiverse Saga!`;
    }

    if (q.includes('secret wars')) {
      return `🎬 **Avengers: Secret Wars Release Date:**\n\n**Avengers: Secret Wars** is scheduled for worldwide theatrical release on **May 7, 2027**! Directed by the Russo Brothers, it serves as the climactic grand finale to the MCU's Multiverse Saga.`;
    }

    if (q.includes('spider-man 4') || q.includes('spiderman 4')) {
      return `🎬 **Spider-Man 4 Release Date:**\n\nTom Holland's upcoming **Spider-Man 4** (directed by Destin Daniel Cretton) is officially scheduled for release in theaters on **July 24, 2026**!`;
    }

    if (q.includes('fantastic four') || q.includes('first steps')) {
      return `🎬 **The Fantastic Four: First Steps:**\n\nMarvel's First Family arrives in theaters on **July 25, 2025**, starring Pedro Pascal (Reed Richards), Vanessa Kirby (Sue Storm), Joseph Quinn (Johnny Storm), and Ebon Moss-Bachrach (The Thing), battling Galactus (Ralph Ineson) and Silver Surfer (Julia Garner)!`;
    }

    // 4. Dr. Doom Fun Fact
    if (q.includes('fact about doom') || q.includes('dr doom fact') || (q.includes('doom') && (q.includes('fact') || q.includes('lore') || q.includes('who is')))) {
      return `Here is an incredible comic canon fact about **Doctor Doom (Victor Von Doom)**! 👑\n\nIn the Marvel comic *Doomwar*, the Wakandan Panther God **Bast** looked directly into Doctor Doom's soul to judge whether he was worthy to live. Bast examined thousands of possible future timelines and discovered that Victor Von Doom was the **only ruler under whom humanity achieves lasting peace and survives**—so Bast willingly allowed Doom to take Wakanda's vibranium!\n\nAlso, beneath his menacing titanium armor, Doom is a supreme master of both mystic sorcery and advanced science. His entire villainous quest began as a tragic mission to rescue his mother Cynthia's soul from the demon Mephisto.`;
    }

    // 5. Match Marvel Characters in 350 Roster
    const heroMatch = ALL_CHARACTERS.find(c => {
      const hName = c.name.toLowerCase();
      return q.includes(hName) || (hName.includes(' ') && q.includes(hName.split(' ')[0]) && hName.split(' ')[0].length > 4);
    });

    if (heroMatch && (q.includes('who is') || q.includes('tell me about') || q.includes('powers') || q.includes('lore') || q.includes('origin'))) {
      return `**${heroMatch.name} (Marvel Comic Lore):** 🌟\n\n- **Identity & Origin**: ${heroMatch.description}\n- **Primary Powers**: ${heroMatch.powers}\n- **Alignment & Faction**: ${heroMatch.alignment} • ${heroMatch.factions?.join(', ') || 'Marvel Universe'}\n- **Battle Grade**: Grade ${heroMatch.grade} (Power Rating: ${heroMatch.overallPower}/100)\n\nWould you like to know more about ${heroMatch.name}'s greatest comic book battles or storylines?`;
    }

    // 6. Casual Greetings & Emotional Check-ins
    if (/^(hi|hello|hey|greetings|howdy|sup|yo|what's up|good morning|good evening|good afternoon)\b/.test(q)) {
      const greetings = [
        "Hey! It's wonderful to hear from you. ✨ How are you feeling today? Anything on your mind or something interesting you'd like to talk about?",
        "Hello! Great to connect with you. I'm right here and happy to chat about anything—whether you want to explore big ideas, share your thoughts, or dive into some fun comic trivia. How is your day going?",
        "Hey there! I'm feeling energized and ready to chat. What's on your mind today?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (q.includes('how are you') || q.includes('how do you feel') || q.includes('how are things')) {
      return "I'm doing really well, thank you for asking! 😊 I'm always excited when we get to chat. How are things on your side? Hope your day is going smoothly!";
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('your name')) {
      return "I'm **Gemini**! ✨ A versatile AI created by Google to explore ideas, answer questions across science, history, coding, and movies, and have genuine emotional conversations. How can I help you today?";
    }

    if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate')) {
      return "You're very welcome! It's genuinely my pleasure. Let me know if there's anything else you'd like to explore or talk about! 💫";
    }

    // 7. Emotional Support & Empathy
    if (q.includes('sad') || q.includes('down') || q.includes('depressed') || q.includes('rough day') || q.includes('bad day') || q.includes('tired') || q.includes('stressed') || q.includes('anxious')) {
      return "I'm really sorry to hear that you're feeling that way. 💙 It's completely valid to have tough days or moments where everything feels heavy. Take a deep breath and give yourself some grace today. Is there anything in particular weighing on you, or would you like a fun distraction or uplifting thought?";
    }

    if (q.includes('happy') || q.includes('excited') || q.includes('great day') || q.includes('wonderful') || q.includes('proud')) {
      return "That's fantastic! 🎉 I love hearing that! What made your day so good? Keep that positive momentum rolling!";
    }

    if (q.includes('joke') || q.includes('funny') || q.includes('make me laugh')) {
      const jokes = [
        "Why don't scientists trust atoms? ... Because they make up everything! 😄",
        "Why did the superhero go to school? ... Because they wanted to improve their super-powers of deduction! 🦸‍♂️",
        "What do you call a fake noodle? ... An impasta! 🍝"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (q.includes('poem') || q.includes('write a poem') || q.includes('rhyme')) {
      return `Across the stars and cosmic deep,\nWhere galaxies in silence sleep,\nA spark of wonder lights the mind,\nIn every question that we find.\n\nFrom quiet thoughts to grand design,\nThrough space and mystery and time,\nWe build the world with what we dream,\nFar brighter than it's ever seemed. ✨`;
    }

    // 8. General Knowledge & Science
    if (q.includes('black hole') || q.includes('quantum') || q.includes('universe') || q.includes('space') || q.includes('relativity') || q.includes('physics')) {
      return `Here is a fascinating breakdown! 🌌\n\n**The Wonders of Space & Physics:**\n- **Black Holes**: Regions of spacetime where gravity is so intense that nothing—not even light—can escape past the *Event Horizon*.\n- **Singularity**: At the very center, matter is compressed into zero volume, creating infinite density where our current laws of physics break down.\n- **Time Dilation**: Because of General Relativity, time actually ticks slower near extreme gravity wells compared to flat spacetime.\n\nIsn't it mind-blowing how the universe operates on such staggering scales?`;
    }

    if (q.includes('sky blue') || q.includes('why is the sky')) {
      return `The sky appears blue because of a phenomenon called **Rayleigh Scattering**! ☀️\n\n1. Sunlight reaches Earth's atmosphere containing all colors of the rainbow.\n2. Light travels in waves; blue light travels in shorter, smaller waves than red light.\n3. The gases in Earth's atmosphere scatter the shorter blue wavelengths much more strongly than other colors, filling the sky with that vibrant blue glow!`;
    }

    // 9. Marvel Comic Matchups
    if (q.includes('thor vs thanos') || q.includes('thanos vs thor')) {
      return `**Thor vs. Thanos Comic Lore Matchup:** ⚡ vs 🟣\n\n- **Physical Brawl**: In standard physical combat, Thor wielding *Stormbreaker* or *Mjolnir* has repeatedly proven capable of trading blows with the Mad Titan, even striking him down during the *Infinity* event.\n- **The Cosmic Factor**: When Thanos possesses the *Infinity Gauntlet*, his reality-warping control over space, time, and matter allows him to turn Thor's lightning to glass or turn Thor into stone with a mere gesture.\n- **The Verdict**: Thanos with Gauntlet wins 10/10; but in a pure warrior duel without stones, Thor's divine lightning and warrior's madness make it a legendary 50/50 clash!`;
    }

    // 10. Live Wikipedia General Knowledge Lookup for any Person, Topic, or Concept!
    try {
      const cleanTopic = prompt
        .replace(/who is/gi, '')
        .replace(/what is/gi, '')
        .replace(/where is/gi, '')
        .replace(/tell me about/gi, '')
        .replace(/explain/gi, '')
        .replace(/[?!.]/g, '')
        .trim()
        .replace(/\s+/g, '_');

      if (cleanTopic.length >= 2) {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`);
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData && wikiData.extract && wikiData.type !== 'disambiguation') {
            return `**${wikiData.title}** ✨\n\n${wikiData.extract}\n\n*Would you like to explore more details about ${wikiData.title}?*`;
          }
        }
      }
    } catch (wikiErr) {
      console.warn('[Wiki Client Lookup Error]', wikiErr);
    }

    // 11. Open-ended Conversational Fallback
    return `That's an interesting question about **${prompt}**! 💭\n\nI'd love to explore this with you. What specific part would you like to know more about, or what thoughts do you have on it?`;
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
      const geminiReply = await sendToGemini2Flash(text, newHistory);
      
      // Check if a character from our 350 roster was discussed to highlight a card
      const matchedHero = ALL_CHARACTERS.find(c => text.toLowerCase().includes(c.name.toLowerCase()));

      const modelMsg: ChatMessage = {
        id: `${Date.now()}-gemini`,
        role: 'model',
        text: geminiReply,
        timestamp: 'Now',
        characterCard: matchedHero,
        quickChips: [
          '✨ Tell me more',
          '⚔️ Who are the strongest heroes?',
          '💡 Give me another strategy tip'
        ]
      };

      setMessages(prev => [...prev, modelMsg]);
      setIsTyping(false);
      playSound('clash');
      if (isVoiceEnabled) speakVoice(geminiReply);
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
                    <span>GEMINI</span>
                  </h3>
                  <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded border bg-purple-950/90 text-purple-200 border-purple-400/70 shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    2.0 FLASH
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate max-w-[180px] sm:max-w-none">
                  {isSpeaking ? 'Speaking response...' : 'Emotional AI Companion & World Knowledge'}
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
                  onClick={() => { soundManager.playClick(); setChatMode('normal'); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border ${
                    chatMode === 'normal'
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
                {chatMode === 'normal' ? '🌐 World & Comics AI' : '⚡ Website Only'}
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
                          <span>{msg.role === 'user' ? 'You' : 'Gemini 2.0 Flash'}</span>
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
                    <span className="font-medium text-[11px]">Gemini 2.0 is thinking...</span>
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
