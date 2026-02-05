
import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { getAIShopperResponse } from '../services/geminiService';

interface AIShopperProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const AIShopper: React.FC<AIShopperProps> = ({ isOpen, onClose, products }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your ShopHub AI Stylist. Looking for something specific or need a gift idea? ✨",
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIShopperResponse(input, products);
      const assistantMsg: ChatMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-[80vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Personal Shopper</h2>
              <div className="flex items-center gap-1.5 opacity-80 text-xs font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                <span>Powered by Gemini 3</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
                m.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
              }`}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                m.role === 'assistant' 
                ? 'bg-white text-slate-800 border border-gray-100 rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center shadow-md">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={16} />
                <span className="text-sm text-slate-500 italic">Thinking of recommendations...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="E.g., 'Find me a minimalist coffee maker under 20000 DZD'..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-24 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
            Gemini AI can provide style tips and gift ideas
          </p>
        </div>
      </div>
    </div>
  );
};
