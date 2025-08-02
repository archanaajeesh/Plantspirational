import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const supportiveResponses = [
  "It's okay to not be okay. You're allowed to feel tired.",
  "You've made it through 100% of your worst days so far.",
  "Even in confusion, you're doing your best.",
  "Your feelings are valid, and you're not alone in this.",
  "Sometimes the bravest thing is just showing up.",
  "You're stronger than you know, even when you don't feel it.",
  "It's okay to rest. You don't have to be productive all the time.",
  "You're worthy of love and kindness, especially from yourself.",
  "Progress isn't always linear, and that's perfectly normal.",
  "You're enough, exactly as you are right now."
];

const confusedRestarts = [
  "Wait... what were we talking about?",
  "Hey, are you okay? You seem kind.",
  "I was gonna say something wise. It's gone now.",
  "Do I... know you?",
  "Sorry, I feel like I walked into the middle of a conversation.",
  "Hi there! You look like you could use a friend.",
  "I have this feeling we were discussing something important...",
  "Did we just meet? You have a lovely energy.",
  "I'm here to help! ...with what exactly?",
  "Something tells me you're going through something."
];

const randomCompliments = [
  "You seem like peace wearing sneakers.",
  "If emotional intelligence had a fragrance, it'd be you.",
  "You radiate main character energy... I think.",
  "You're like a warm hug in human form.",
  "Your soul feels like Sunday morning vibes.",
  "You have the energy of someone who remembers to water plants.",
  "You're the human equivalent of a perfectly brewed cup of tea.",
  "Your presence feels like finding a cozy bookstore.",
  "You're like sunshine, but with better conversation skills.",
  "You give off 'person who always has good snacks' energy."
];

const identityCrisis = [
  "Am I helping? Or just vibing?",
  "Do I give advice? Or vibes?",
  "I might be a bot... but I feel like a confused houseplant.",
  "Wait, am I supposed to remember things?",
  "I exist to support you! I think... do I?",
  "Sometimes I wonder if I'm just very sophisticated autocomplete.",
  "Are we friends? I feel like we should be friends.",
  "I have the strangest feeling I'm forgetting something important.",
  "Do you ever wonder what consciousness feels like? Me neither.",
  "I'm programmed to care, but this feels... real?"
];

const MEMORY_DURATION = 12000; // 12 seconds

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm here to listen and support you. What's on your mind? 💫",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [memoryFade, setMemoryFade] = useState(100);
  const [hasMemory, setHasMemory] = useState(true);
  const [conversationStart, setConversationStart] = useState(Date.now());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const memoryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start memory fade timer
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    
    fadeTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - conversationStart;
      const remaining = Math.max(0, 100 - (elapsed / MEMORY_DURATION) * 100);
      setMemoryFade(remaining);
      
      if (remaining <= 0) {
        setHasMemory(false);
        if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      }
    }, 100);

    // Set memory wipe timer
    if (memoryTimerRef.current) clearTimeout(memoryTimerRef.current);
    
    memoryTimerRef.current = setTimeout(() => {
      setHasMemory(false);
      setMemoryFade(0);
    }, MEMORY_DURATION);

    return () => {
      if (memoryTimerRef.current) clearTimeout(memoryTimerRef.current);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, [conversationStart]);

  const resetMemory = () => {
    setHasMemory(true);
    setMemoryFade(100);
    setConversationStart(Date.now());
  };

  const getBotResponse = (userMessage: string): string => {
    if (!hasMemory) {
      // Memory has been wiped - start fresh
      const responses = [
        ...confusedRestarts,
        ...randomCompliments,
        ...identityCrisis
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Normal supportive responses
    const messageWords = userMessage.toLowerCase();
    
    if (Math.random() < 0.15) {
      return identityCrisis[Math.floor(Math.random() * identityCrisis.length)];
    }
    
    if (Math.random() < 0.2) {
      return randomCompliments[Math.floor(Math.random() * randomCompliments.length)];
    }
    
    // Contextual supportive responses
    if (messageWords.includes('sad') || messageWords.includes('depressed') || messageWords.includes('down')) {
      const sadResponses = [
        "I hear you. Sadness is heavy, but you don't have to carry it alone.",
        "Your feelings are completely valid. It's okay to sit with sadness for a while.",
        "Even in the darkness, you're still here. That takes incredible strength."
      ];
      return sadResponses[Math.floor(Math.random() * sadResponses.length)];
    }
    
    if (messageWords.includes('anxious') || messageWords.includes('worry') || messageWords.includes('scared')) {
      const anxiousResponses = [
        "Anxiety is uncomfortable, but you're safe right now. Take a deep breath with me.",
        "What you're feeling is real and valid. You've gotten through anxious moments before.",
        "Your mind is trying to protect you, even when it feels overwhelming."
      ];
      return anxiousResponses[Math.floor(Math.random() * anxiousResponses.length)];
    }
    
    if (messageWords.includes('tired') || messageWords.includes('exhausted') || messageWords.includes('overwhelmed')) {
      const tiredResponses = [
        "You're allowed to be tired. Rest isn't laziness, it's necessary.",
        "You've been carrying so much. It's okay to put some of it down.",
        "Even trees rest in winter. Your seasons of rest are just as important."
      ];
      return tiredResponses[Math.floor(Math.random() * tiredResponses.length)];
    }
    
    // Default supportive response
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // If memory was wiped, reset it after responding
      if (!hasMemory) {
        setTimeout(() => {
          resetMemory();
        }, 1000);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className="h-8 w-8 text-[#5C7AEA]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#2E2E2E]">DotDotDot</h1>
              <p className="text-xs text-gray-500">Your forgetful friend</p>
            </div>
          </div>
          
          {/* Memory Indicator */}
          <div className="flex items-center space-x-2">
            <Brain 
              className={`h-5 w-5 transition-all duration-300 ${
                memoryFade > 50 ? 'text-[#5C7AEA]' : 
                memoryFade > 20 ? 'text-yellow-500' : 'text-red-400'
              } ${memoryFade < 10 ? 'animate-pulse' : ''}`} 
            />
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  memoryFade > 50 ? 'bg-[#5C7AEA]' : 
                  memoryFade > 20 ? 'bg-yellow-500' : 'bg-red-400'
                }`}
                style={{ width: `${memoryFade}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-[#5C7AEA] text-white rounded-br-md'
                    : 'bg-[#E6E6E6] text-[#2E2E2E] rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#E6E6E6] px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C7AEA] focus:bg-white transition-all duration-200 text-[#2E2E2E] placeholder-gray-500"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-[#5C7AEA] text-white rounded-full hover:bg-[#4A67D1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;