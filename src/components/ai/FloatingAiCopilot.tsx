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

  const handleSendMessage = (customPrompt?: string) => {
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

    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('views drop') || lower.includes('drop')) {
        reply = `📉 Root-Cause Analysis for View Drop:\n\n1. Browse Feed Impression Burn: Your impressions remained flat while initial 2-hour CTR dipped by 1.8%, causing the recommendation engine to stop wide testing.\n2. Day of Week Seasonal Dip: Historical analytics show Thursday releases in ${selectedChannel.category} experience 22% lower day-one velocity than Sunday uploads.\n3. Action Plan: Pin an engaging curiosity comment on your recent video and test thumbnail Variant B to trigger a second recommendation surge.`;
      } else if (lower.includes('5 viral titles') || lower.includes('titles')) {
        reply = `🔥 5 High-CTR Title Concepts for ${selectedChannel.name}:\n\n1. "Stop Building Next.js Apps Wrong! (2026 Production Architecture)"\n2. "Why 90% of Developers Will Be Replaced by AI Agents This Year"\n3. "I Built a Full Stack SaaS in 48 Hours with AI (Here's What Happened)"\n4. "The Uncomfortable Truth About Software Engineering Careers"\n5. "Don't Learn To Code in 2026 Until You Watch This"\n\n(Tip: Titles with power words like "Stop", "Truth", and "Why" deliver 2.3x higher CTR)`;
      } else if (lower.includes('ctr') || lower.includes('lift')) {
        reply = `🎯 Formulas to Lift CTR from 7% to 10%+:\n\n• Rule of 3 Elements: Ensure your thumbnail has max 3 focal points: 1 Face with high emotion, 1 Focal Object, and max 3 words of bold text.\n• Curiosity Gap Over Summary: Don't repeat the video title on the thumbnail image. Complement it. (e.g., Title: "I Tested 50 Keyboards", Thumbnail: "This Broke My Hands").\n• Visual Contrast: High specular contrast between text and background boosts mobile glance-rate by 34%.`;
      } else if (lower.includes('duration') || lower.includes('length')) {
        reply = `⏱️ Optimal Duration Recommendation:\n\n• For ${selectedChannel.category}, your highest-earning videos average 14 to 18 minutes.\n• This duration unlocks mid-roll ad placement eligibility while maintaining average view duration above 45% (6m30s+), maximizing algorithmic promotion.`;
      } else {
        reply = `💡 Strategic Advice for ${selectedChannel.name}:\n\nBased on your ${selectedChannel.subscribers.toLocaleString()} subscribers and recent upload velocity, your most effective lever is audience binge-sessions.\n\n1. Structure end-screen cards linking to an episodic series.\n2. Fulfill your thumbnail promise within the first 6 seconds to eliminate hook drop-off.\n3. Publish on your primary audience peak window (Sunday 18:00 UTC).`;
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 500);
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
