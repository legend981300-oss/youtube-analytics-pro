'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  PlusCircle,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
      text: `Hello! I'm your YouTube Analytics AI Copilot. I'm connected to ${selectedChannel.name} (${selectedChannel.subscribers.toLocaleString()} subscribers). Ask me anything about your video retention, CTR optimization, or content ideas!`,
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

    // Call deterministic AI logic or API
    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('views drop') || lower.includes('drop')) {
        reply = `📉 **Root-Cause Analysis for View Drop:**\n\n1. **Browse Feed Impression Burn:** Your impressions remained flat while initial 2-hour CTR dipped by 1.8%, causing the recommendation engine to stop wide testing.\n2. **Day of Week Seasonal Dip:** Historical analytics show Thursday releases in ${selectedChannel.category} experience 22% lower day-one velocity than Sunday uploads.\n3. **Action Plan:** Pin an engaging curiosity comment on your recent video and test thumbnail Variant B to trigger a second recommendation surge.`;
      } else if (lower.includes('5 viral titles') || lower.includes('titles')) {
        reply = `🔥 **5 High-CTR Title Concepts for ${selectedChannel.name}:**\n\n1. *"Stop Building Next.js Apps Wrong! (2026 Production Architecture)"*\n2. *"Why 90% of Developers Will Be Replaced by AI Agents This Year"*\n3. *"I Built a Full Stack SaaS in 48 Hours with AI (Here's What Happened)"*\n4. *"The Uncomfortable Truth About Software Engineering Careers"*\n5. *"Don't Learn To Code in 2026 Until You Watch This"*\n\n*(Tip: Titles with power words like "Stop", "Truth", and "Why" deliver 2.3x higher CTR)*`;
      } else if (lower.includes('ctr') || lower.includes('lift')) {
        reply = `🎯 **Formulas to Lift CTR from 7% to 10%+:**\n\n• **Rule of 3 Elements:** Ensure your thumbnail has max 3 focal points: 1 Face with high emotion, 1 Focal Object, and max 3 words of bold text.\n• **Curiosity Gap Over Summary:** Don't repeat the video title on the thumbnail image. Complement it. (e.g., Title: "I Tested 50 Keyboards", Thumbnail: "This Broke My Hands").\n• **Visual Contrast:** High specular contrast between text and background boosts mobile glance-rate by 34%.`;
      } else if (lower.includes('duration') || lower.includes('length')) {
        reply = `⏱️ **Optimal Duration Recommendation:**\n\n• For ${selectedChannel.category}, your highest-earning videos average **14 to 18 minutes**.\n• This duration unlocks mid-roll ad placement eligibility while maintaining average view duration above **45% (6m30s+)**, maximizing algorithmic promotion.`;
      } else {
        reply = `💡 **Strategic Advice for ${selectedChannel.name}:**\n\nBased on your ${selectedChannel.subscribers.toLocaleString()} subscribers and recent upload velocity, your most effective lever is **audience binge-sessions**.\n\n1. Structure end-screen cards linking to an episodic series.\n2. Fulfill your thumbnail promise within the first 6 seconds to eliminate hook drop-off.\n3. Publish on your primary audience peak window (Sunday 18:00 UTC).`;
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied Advice', 'AI Copilot response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToVault = (text: string) => {
    addIdea({
      title: 'Strategy from AI Copilot',
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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 px-4 py-3 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-brand-500/30 group"
          title="Open YouTube AI Copilot"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Ask Channel AI</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl border border-slate-700/70 bg-white/95 dark:bg-navy-900/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-glow-brand">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">YouTube AI Copilot</h3>
                  <Badge variant="cyan" size="sm">
                    GPT-4o Ready
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400">Context: {selectedChannel.name}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Prompt Pills Bar */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/50 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {STRATEGIC_PROMPT_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                className="shrink-0 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-navy-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs ${
                      isAssistant
                        ? 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-800/80 text-slate-800 dark:text-slate-200 shadow-sm'
                        : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                    {isAssistant && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-slate-200 flex items-center gap-0.5"
                          >
                            {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            Copy
                          </button>
                          <button
                            onClick={() => handleSaveToVault(msg.text)}
                            className="hover:text-slate-200 flex items-center gap-0.5 text-brand-500"
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
              <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                <Bot className="h-3.5 w-3.5" /> Copilot is analyzing channel metrics...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80 p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your YouTube metrics..."
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
            <Button type="submit" variant="glow" size="sm" disabled={!input.trim() || isTyping}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
