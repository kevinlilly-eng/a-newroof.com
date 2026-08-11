import React, { useState } from 'react';
import { MessageSquareCode, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
}

export const AiChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'gemini',
      text: "Hello! I am A-NewRoof's 24/7 Master Roofer & Claims Advisor powered by Gemini. Ask me about building codes (IRC/IBC), Xactimate supplement strategies, emergency tarping protocols, or roof square estimates!",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            app: 'A-NewRoof Emergency Response Platform',
            hotline: '(706) 740-0529',
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...newMessages, { sender: 'gemini', text: data.text }]);
      } else {
        setMessages([
          ...newMessages,
          { sender: 'gemini', text: 'I encountered an issue processing your query. Please try again.' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">24/7 AI Master Roofer & Claims Advisor</h1>
            <p className="text-xs text-slate-400">
              Get instant answers on IRC building codes, Xactimate line items, tarping tactics, and insurance negotiations
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-[550px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'gemini' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-amber-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask about IRC codes, Xactimate supplement tips, or roof square math..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
