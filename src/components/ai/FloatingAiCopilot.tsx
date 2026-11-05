'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Copy,
  Check,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const STRATEGIC_PROMPT_PILLS = [
  'Why did my views drop last week?',
  'Give me 5 viral titles for my niche',
  'How do I lift my CTR from 7% to 10%?',
  'What is my optimal video duration?',
  'Audit my thumbnail contrast formula',
];

export const FloatingAiCopilot: React.FC = () => {
  const { selectedChannel, addIdea, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello. I'm your channel copilot for ${selectedChannel.name} (${selectedChannel.subscribers.toLocaleString()} subscribers). Ask me about retention curves, CTR levers, or keyword strategy.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          channelContext: {
            name: selectedChannel.name,
            handle: selectedChannel.handle,
            subscribers: selectedChannel.subscribers,
            category: selectedChannel.category,
            totalViews: selectedChannel.totalViews,
          },
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          const assistantMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('AI chat error, using fallback:', err);
    }

    const assistantMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: `💡 Strategic Advice for ${selectedChannel.name}:\n\n1. Double down on high-CTR contrast thumbnails.\n2. Cut verbal intros to keep retention >70% in the first 30 seconds.\n3. Create playlist binge-loops on end-screens.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied', 'Response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToVault = (text: string) => {
    addIdea({
      title: 'Strategy from Copilot',
      category: 'AI Recommendation',
      targetKeywords: ['optimization', 'algorithm'],
      predictedPotential: 'High',
      status: 'idea',
      notes: text.slice(0, 300),
      tags: ['Copilot', 'Strategy'],
    });
    showToast('Saved to Vault', 'Copilot recommendation added to your Idea Vault', 'success');
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg bg-[#11131a] hover:bg-[#161822] text-white border border-white/[0.12] px-3 py-2 text-xs font-medium shadow-2xl transition-all select-none group"
          title="Open Channel AI Copilot"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ff0033]" />
          <span>Ask Copilot</span>
          <span className="font-mono text-[10px] text-slate-400 bg-white/[0.08] px-1 py-0.5 rounded border border-white/[0.06]">
            ⌘J
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[94vw] sm:w-[420px] h-[540px] max-h-[85vh] rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#11131a] text-slate-900 dark:text-white shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0c0e14] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#ff0033] text-white text-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-white">Channel Copilot</h3>
                  <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">{selectedChannel.handle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Prompt suggestions */}
          <div className="border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] p-2 overflow-x-auto flex gap-1.5 scrollbar-thin">
            {STRATEGIC_PROMPT_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                className="shrink-0 rounded border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/20 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg p-3 text-xs ${
                      isAssistant
                        ? 'border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200'
                        : 'bg-slate-900 dark:bg-white/[0.12] text-white border border-slate-800 dark:border-white/[0.1]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                    {isAssistant && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-slate-600 dark:hover:text-white flex items-center gap-0.5 transition-colors"
                          >
                            {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            Copy
                          </button>
                          <button
                            onClick={() => handleSaveToVault(msg.text)}
                            className="hover:text-slate-600 dark:hover:text-white flex items-center gap-0.5 transition-colors"
                          >
                            <PlusCircle className="h-3 w-3" /> Save to Vault
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Bot className="h-3.5 w-3.5 animate-spin" /> Copilot is calculating...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0c0e14] p-2.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your metrics..."
              className="flex-1 rounded-md border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-white/20"
            />
            <Button type="submit" size="sm" disabled={!input.trim() || isTyping}>
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
