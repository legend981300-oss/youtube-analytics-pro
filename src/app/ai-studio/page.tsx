'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Sparkles,
  Type,
  FileText,
  Lightbulb,
  FileCode,
  Copy,
  Check,
  Plus,
  Play,
  RotateCw,
  Zap,
  Bookmark,
  Info,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { delay } from '@/lib/utils';

type ToneType = 'educational' | 'hype' | 'story' | 'controversial';
type TabType = 'titles' | 'descriptions' | 'ideas' | 'scripts';

interface GeneratedTitle {
  id: string;
  category: string;
  title: string;
  patternStyle: string;
}

interface GeneratedIdea {
  id: string;
  title: string;
  format: string;
  potential: 'High' | 'Very High';
  reason: string;
}

const PRESET_TOPICS = [
  'Next.js 15 Full Stack SaaS',
  'Autonomous AI Coding Agents',
  'PostgreSQL & Supabase Architecture',
  'Solo Developer Productivity & Habits',
  'Stripe Billing & Micro-SaaS Pricing',
];

export default function AiStudioPage() {
  const { addIdea, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('titles');
  const [topic, setTopic] = useState('Full Stack SaaS with Next.js 15 & AI');
  const [tone, setTone] = useState<ToneType>('educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Titles State
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([
    {
      id: 't-1',
      category: 'Curiosity Hook',
      title: 'Why 99% of Developers Build SaaS Completely Backwards in 2026',
      patternStyle: 'Pattern: Contrarian Curiosity',
    },
    {
      id: 't-2',
      category: 'Data & Numbers',
      title: 'How I Built a $12k/Month AI Micro-SaaS in Exactly 11 Days',
      patternStyle: 'Pattern: Specific Proof Metric',
    },
    {
      id: 't-3',
      category: 'Beginner Friendly',
      title: 'Next.js 15 Full Stack Roadmap: Zero to Production MVP',
      patternStyle: 'Pattern: Comprehensive Roadmap',
    },
    {
      id: 't-4',
      category: 'Urgency & Warning',
      title: 'Stop Using Traditional APIs Before It Destroys Your Server Bill',
      patternStyle: 'Pattern: Urgent Problem / Warning',
    },
  ]);

  // Description State
  const [generatedDesc, setGeneratedDesc] = useState<string>(
    `In this complete deep-dive video, we break down how to design, build, and deploy an enterprise-ready SaaS application using Next.js 15, Supabase, and autonomous AI coding agents.\n\n` +
      `🔥 Full Source Code & Architecture Diagram:\nhttps://github.com/demo/nextjs-saas-starter\n\n` +
      `⏱️ TIMESTAMPS & CHAPTERS:\n` +
      `00:00 - The Modern SaaS Tech Stack\n` +
      `02:15 - System Architecture & Database Schema\n` +
      `06:40 - Implementing Supabase Authentication\n` +
      `11:20 - Next.js 15 Server Actions & Safe Mutations\n` +
      `18:45 - Deploying to Production with Zero Downtime\n` +
      `23:10 - How to get your first 100 paying customers\n\n` +
      `💬 Leave a comment with your project idea and I will review the architecture!`
  );

  // Ideas State
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([
    {
      id: 'i-1',
      title: 'I Automated My Entire YouTube Workflow with 4 AI Agents',
      format: 'Experiment / Case Study (12-15 min)',
      potential: 'Very High',
      reason: 'Combines viral AI agent interest with relatable creator productivity.',
    },
    {
      id: 'i-2',
      title: 'The Modern Full Stack Developer Toolkit for 2027',
      format: 'Curated Resource List (10 min)',
      potential: 'High',
      reason: 'High evergreen search intent for junior and mid-level engineers.',
    },
    {
      id: 'i-3',
      title: 'Is Postgres Obsolete for AI Apps? Vector DBs Tested',
      format: 'Technical Benchmark & Debate (14 min)',
      potential: 'Very High',
      reason: 'Controversial thumbnail hook with rigorous technical benchmarks.',
    },
  ]);

  // Script State
  const [generatedScript, setGeneratedScript] = useState<string>(
    `[00:00 - 00:08] THE 3-SECOND HOOK:\n` +
      `(Visual: Split screen showing 500 lines of messy boilerplate vs 10 lines of clean architecture)\n` +
      `Host (Direct to camera): "If you're still building apps the old way, you're spending 80% of your time on plumbing instead of product. Today, we're building a production system in under 20 minutes."\n\n` +
      `[00:08 - 01:00] THE VALUE PROMISE:\n` +
      `Host: "By the end of this video, you'll have a running application deployed to production with auth, database models, and billing integration ready."\n\n` +
      `[01:00 - 05:30] STEP 1: FOUNDATIONS & SYSTEM DESIGN:\n` +
      `(Visual: Architecture whiteboard diagram highlighting the data flow)\n` +
      `Host: "Let's inspect the database relations first..."\n\n` +
      `[05:30 - 12:00] STEP 2: LIVE IMPLEMENTATION:\n` +
      `(Visual: Screen capture of code editor with highlighted syntax)\n\n` +
      `[12:00 - 13:30] OUTRO & CALL TO ACTION:\n` +
      `Host: "The starter repository is linked in the description below. If this saved you time, hit subscribe and check out the companion deep-dive video right here!"`
  );

  // Functional Generator Engine based on topic and tone
  const handleGenerate = async () => {
    const cleanTopic = topic.trim() || 'Modern Full Stack Web Apps';
    setIsGenerating(true);
    await delay(800); // UI feel

    // 1. Generate Titles based on tone
    if (activeTab === 'titles') {
      let titlesForTone: GeneratedTitle[] = [];
      if (tone === 'educational') {
        titlesForTone = [
          {
            id: `t-${Date.now()}-1`,
            category: 'Complete Guide',
            title: `The Complete ${cleanTopic} Roadmap: Beginner to Pro (2026)`,
            patternStyle: 'Pattern: Structured Masterclass',
          },
          {
            id: `t-${Date.now()}-2`,
            category: 'System Architecture',
            title: `How ${cleanTopic} Works Under the Hood (Architecture Deep Dive)`,
            patternStyle: 'Pattern: Engineering Authority',
          },
          {
            id: `t-${Date.now()}-3`,
            category: 'Core Principles',
            title: `5 Core Principles of ${cleanTopic} Every Senior Developer Knows`,
            patternStyle: 'Pattern: Curated Numbered Framework',
          },
          {
            id: `t-${Date.now()}-4`,
            category: 'Zero to Production',
            title: `Build and Deploy ${cleanTopic} from Scratch in 45 Minutes`,
            patternStyle: 'Pattern: Time-Bound Project Build',
          },
        ];
      } else if (tone === 'hype') {
        titlesForTone = [
          {
            id: `t-${Date.now()}-1`,
            category: 'Extreme Curiosity',
            title: `I Tested ${cleanTopic} for 30 Days and It Broke My Expectations!`,
            patternStyle: 'Pattern: Personal Radical Test',
          },
          {
            id: `t-${Date.now()}-2`,
            category: 'Game Changer',
            title: `Stop Ignoring ${cleanTopic}! (This Changes Everything)`,
            patternStyle: 'Pattern: Urgency Hook',
          },
          {
            id: `t-${Date.now()}-3`,
            category: 'Speed / Multiplier',
            title: `How ${cleanTopic} Made Me 10x Faster in One Weekend`,
            patternStyle: 'Pattern: Multiplier Proof',
          },
          {
            id: `t-${Date.now()}-4`,
            category: 'Secret Revealed',
            title: `The Secret ${cleanTopic} Strategy Nobody Is Talking About`,
            patternStyle: 'Pattern: Insider Knowledge',
          },
        ];
      } else if (tone === 'story') {
        titlesForTone = [
          {
            id: `t-${Date.now()}-1`,
            category: 'Honest Review',
            title: `I Built My Entire Project with ${cleanTopic}: Honest Retrospective`,
            patternStyle: 'Pattern: Transparent Case Study',
          },
          {
            id: `t-${Date.now()}-2`,
            category: 'Mistakes Learned',
            title: `My Biggest Mistake with ${cleanTopic} (And What It Cost Me)`,
            patternStyle: 'Pattern: Vulnerable Lesson',
          },
          {
            id: `t-${Date.now()}-3`,
            category: 'Solo Journey',
            title: `How a Solo Creator Uses ${cleanTopic} to Compete with Big Teams`,
            patternStyle: 'Pattern: Underdog Solo Story',
          },
          {
            id: `t-${Date.now()}-4`,
            category: 'Tech Stack Shift',
            title: `Why I Finally Switched My Entire Stack to ${cleanTopic}`,
            patternStyle: 'Pattern: Decision Rationale',
          },
        ];
      } else {
        // Controversial
        titlesForTone = [
          {
            id: `t-${Date.now()}-1`,
            category: 'Debunking Myths',
            title: `Why 90% of Advice About ${cleanTopic} Is Completely Wrong`,
            patternStyle: 'Pattern: Contrarian Stance',
          },
          {
            id: `t-${Date.now()}-2`,
            category: 'Unpopular Opinion',
            title: `Is ${cleanTopic} Actually Overrated? Unpopular Tech Opinions`,
            patternStyle: 'Pattern: Skeptic Critique',
          },
          {
            id: `t-${Date.now()}-3`,
            category: 'Brutal Truth',
            title: `The Brutal Truth About ${cleanTopic} Nobody Wants to Admit`,
            patternStyle: 'Pattern: Direct Unvarnished Reality',
          },
          {
            id: `t-${Date.now()}-4`,
            category: 'Costly Mistakes',
            title: `Stop Using ${cleanTopic} Like This: It's Ruining Your Architecture`,
            patternStyle: 'Pattern: Anti-Pattern Warning',
          },
        ];
      }
      setGeneratedTitles(titlesForTone);
    }

    // 2. Generate Description based on tone
    else if (activeTab === 'descriptions') {
      let desc = '';
      if (tone === 'educational') {
        desc =
          `Master ${cleanTopic} in this comprehensive, end-to-end tutorial designed for modern software engineers.\n\n` +
          `We cover foundational concepts, best practices, real-world edge cases, and automated testing.\n\n` +
          `📦 REPOSITORY & CODE RECURRING STARTER:\n` +
          `https://github.com/demo/${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-starter\n\n` +
          `⏱️ CHAPTERS & TIMESTAMPS:\n` +
          `00:00 - Introduction & Prerequisites\n` +
          `01:45 - High-Level Architecture Overview\n` +
          `05:10 - Core Setup for ${cleanTopic}\n` +
          `12:30 - Implementing Production Patterns\n` +
          `20:15 - Handling Errors & Security Hardening\n` +
          `27:40 - Deployment & CI/CD Pipelines\n` +
          `32:00 - Summary & Next Recommended Video\n\n` +
          `🔔 Subscribe to stay ahead with high-leverage developer breakdowns.`;
      } else if (tone === 'hype') {
        desc =
          `⚡ THIS CHANGES EVERYTHING: Why ${cleanTopic} is taking over the industry right now!\n\n` +
          `In this high-energy walkthrough, we push ${cleanTopic} to its limits and see if it lives up to the viral hype.\n\n` +
          `🚀 FREE TEMPLATE & ACCELERATOR PACK:\n` +
          `https://demo.example.com/starter-kit\n\n` +
          `⏱️ WHAT YOU WILL SEE:\n` +
          `00:00 - The Mind-Blowing Hook\n` +
          `02:10 - Speed Benchmark Test\n` +
          `06:40 - The Secret Feature Nobody Uses\n` +
          `11:20 - Real-World Results Revealed\n\n` +
          `Drop a comment with your thoughts: Is ${cleanTopic} the future or just hype?`;
      } else if (tone === 'story') {
        desc =
          `Here is the honest, unfiltered story of what happened when I adopted ${cleanTopic} for my real-world projects.\n\n` +
          `No sponsored fluff — just the exact metrics, painful bugs, breakthrough moments, and lessons learned along the way.\n\n` +
          `🔗 LINKS & REFERENCES:\n` +
          `• Architecture Diagram: https://demo.example.com/diagram\n` +
          `• Project Retrospective: https://demo.example.com/blog\n\n` +
          `⏱️ TIMELINE:\n` +
          `00:00 - Why I Was Skeptical at First\n` +
          `03:20 - The Turning Point\n` +
          `08:45 - The Major Bug That Almost Derailed Everything\n` +
          `14:10 - What I Would Do Differently Today\n\n` +
          `If you've also worked with ${cleanTopic}, tell me your experience in the comments!`;
      } else {
        // Controversial
        desc =
          `⚠️ An honest, critical examination of ${cleanTopic} — debunking the viral hype and looking at cold, hard benchmarks.\n\n` +
          `Before you rewrite your stack or listen to marketing claims, here are the real trade-offs you must know.\n\n` +
          `📊 BENCHMARK DATA & ARCHITECTURE AUDIT:\n` +
          `https://demo.example.com/benchmarks\n\n` +
          `⏱️ BREAKDOWN:\n` +
          `00:00 - The Hype vs The Reality\n` +
          `02:30 - The 3 Biggest Flaws in ${cleanTopic}\n` +
          `07:50 - Independent Performance Benchmarks\n` +
          `13:15 - When You SHOULD (and SHOULD NOT) Use It\n\n` +
          `Agree or disagree? Let's have a respectful debate in the comments below.`;
      }
      setGeneratedDesc(desc);
    }

    // 3. Generate Ideas based on tone
    else if (activeTab === 'ideas') {
      let ideas: GeneratedIdea[] = [];
      if (tone === 'educational') {
        ideas = [
          {
            id: `i-${Date.now()}-1`,
            title: `Building a Production System with ${cleanTopic} in 60 Minutes`,
            format: 'Code Along / Workshop (45-60 min)',
            potential: 'Very High',
            reason: 'High search volume from builders wanting comprehensive end-to-end guidance.',
          },
          {
            id: `i-${Date.now()}-2`,
            title: `Top 5 Design Patterns for ${cleanTopic} Explained Visually`,
            format: 'Visual Diagram Breakdown (12-15 min)',
            potential: 'High',
            reason: 'High retention format that appeals to mid-level and senior engineers.',
          },
          {
            id: `i-${Date.now()}-3`,
            title: `${cleanTopic} Cheat Sheet: 10 Things to Know Before You Ship`,
            format: 'Checklist / Quick Guide (10 min)',
            potential: 'High',
            reason: 'Excellent bookmark rate and community re-sharing potential.',
          },
        ];
      } else if (tone === 'hype') {
        ideas = [
          {
            id: `i-${Date.now()}-1`,
            title: `Can I Build a Full App with ${cleanTopic} in 24 Hours?`,
            format: 'Timed Challenge (15-20 min)',
            potential: 'Very High',
            reason: 'Time-constraint storytelling drives massive click-through rates and binge viewing.',
          },
          {
            id: `i-${Date.now()}-2`,
            title: `I Replaced 10 Paid Tools with ${cleanTopic} (Crazy Results)`,
            format: 'Tool Teardown / Experiment (12 min)',
            potential: 'Very High',
            reason: 'Cost-saving and tool consolidation hooks perform exceptionally well.',
          },
          {
            id: `i-${Date.now()}-3`,
            title: `${cleanTopic} Just Blew My Mind (Live Reaction & Build)`,
            format: 'First Look / Live Build (14 min)',
            potential: 'High',
            reason: 'Capitalizes on early adoption curiosity and trending keyword surges.',
          },
        ];
      } else if (tone === 'story') {
        ideas = [
          {
            id: `i-${Date.now()}-1`,
            title: `My Honest 1-Year Experience Using ${cleanTopic}`,
            format: 'Retrospective Case Study (14-18 min)',
            potential: 'High',
            reason: 'Builds long-term creator trust and attracts high-intent, loyal subscribers.',
          },
          {
            id: `i-${Date.now()}-2`,
            title: `How ${cleanTopic} Saved My Client Project from Failing`,
            format: 'Behind-the-Scenes Story (12 min)',
            potential: 'High',
            reason: 'Real-world stakes keep viewers watching all the way through.',
          },
          {
            id: `i-${Date.now()}-3`,
            title: `From Complete Beginner to Shipping with ${cleanTopic}`,
            format: 'Learning Journey (15 min)',
            potential: 'High',
            reason: 'Inspires aspiring creators and developers facing the same learning curve.',
          },
        ];
      } else {
        // Controversial
        ideas = [
          {
            id: `i-${Date.now()}-1`,
            title: `Why I Regret Choosing ${cleanTopic} for My Startup`,
            format: 'Post-Mortem Analysis (14 min)',
            potential: 'Very High',
            reason: 'Anti-hype contrarian videos generate intense debate and algorithmic comment activity.',
          },
          {
            id: `i-${Date.now()}-2`,
            title: `${cleanTopic} vs The Traditional Stack: Unvarnished Benchmark`,
            format: 'Rigorous Head-to-Head (16 min)',
            potential: 'Very High',
            reason: 'Comparison queries have the highest purchase intent and CPM in tech.',
          },
          {
            id: `i-${Date.now()}-3`,
            title: `The Dark Side of ${cleanTopic} Everyone Ignores`,
            format: 'Investigative Essay (12 min)',
            potential: 'High',
            reason: 'Curiosity gap thumbnail with bold typography drives immediate clicks.',
          },
        ];
      }
      setGeneratedIdeas(ideas);
    }

    // 4. Generate Scripts based on tone
    else if (activeTab === 'scripts') {
      let script = '';
      if (tone === 'educational') {
        script =
          `[00:00 - 00:10] THE HOOK & SYSTEM PREMISE:\n` +
          `(Visual: Clean diagram illustrating ${cleanTopic} architecture)\n` +
          `Host: "If you want to understand how ${cleanTopic} actually works in production, this is the complete architectural guide you've been looking for. No shortcuts — just proven patterns."\n\n` +
          `[00:10 - 01:00] THE VALUE ROADMAP:\n` +
          `Host: "In the next 20 minutes, we're covering the core fundamentals, setting up a clean project structure, implementing key functions, and deploying with zero downtime."\n\n` +
          `[01:00 - 06:00] MODULE 1: ARCHITECTURAL FOUNDATIONS:\n` +
          `(Visual: Screen share showing file tree and module separation)\n` +
          `Host: "Let's begin by separating our business logic from our UI components..."\n\n` +
          `[06:00 - 15:00] MODULE 2: DEEP DIVE IMPLEMENTATION:\n` +
          `(Visual: Live coding walkthrough highlighting error boundaries and typing)\n\n` +
          `[15:00 - 18:00] MODULE 3: PRODUCTION DEPLOYMENT & TESTING:\n` +
          `(Visual: Automated CI checks running green)\n\n` +
          `[18:00 - 19:30] SUMMARY & OUTRO:\n` +
          `Host: "All code from this session is in the GitHub repo below. Bookmark this video for reference, and hit subscribe for weekly deep dives!"`;
      } else if (tone === 'hype') {
        script =
          `[00:00 - 00:06] EXPLOSIVE HOOK:\n` +
          `(Visual: Rapid montage of benchmarks with high-energy music swell)\n` +
          `Host (Leaning in close): "What if I told you that everything you know about ${cleanTopic} is about to change? Today, we are putting it through an extreme test!"\n\n` +
          `[00:06 - 00:45] THE HIGH-STAKES PREMISE:\n` +
          `Host: "I set a timer for 60 minutes. If this works, it replaces half my development stack. If it fails, I show you every single roadblock on camera."\n\n` +
          `[00:45 - 04:30] PHASE 1: THE INITIAL SHOCK:\n` +
          `(Visual: Fast-paced typing, on-screen timer ticking down)\n` +
          `Host: "Look at this speed. Look at how little boilerplate this requires..."\n\n` +
          `[04:30 - 09:00] PHASE 2: THE BREAKTHROUGH:\n` +
          `(Visual: Live preview showing instant response)\n\n` +
          `[09:00 - 10:30] FINAL VERDICT & CTA:\n` +
          `Host: "This completely shattered my expectations. Drop a like right now if you want a part two, and click the video on screen to see my full workflow!"`;
      } else if (tone === 'story') {
        script =
          `[00:00 - 00:12] REFLECTIVE NARRATIVE HOOK:\n` +
          `(Visual: Host looking back at previous commit history on an old monitor)\n` +
          `Host: "Six months ago, our team hit a massive wall trying to scale our application. That's when we took a risky gamble and rebuilt our core engine around ${cleanTopic}."\n\n` +
          `[00:12 - 01:15] THE DILEMMA:\n` +
          `Host: "In today's video, I'm sharing the completely transparent story: the bugs that kept us awake at 2 AM, the performance gains, and whether I'd do it again."\n\n` +
          `[01:15 - 05:00] ACT 1: THE HONEYMOON PHASE:\n` +
          `Host: "The initial prototype took just two days. But then we hit our first real obstacle..."\n\n` +
          `[05:00 - 11:00] ACT 2: THE UNEXPECTED CRASH & THE FIX:\n` +
          `(Visual: Screen showing memory usage graphs and the exact line of code that fixed it)\n\n` +
          `[11:00 - 13:00] THE CONCLUSION & ADVICE:\n` +
          `Host: "If you are on the fence about ${cleanTopic}, here is my honest recommendation for your specific situation..."`;
      } else {
        // Controversial
        script =
          `[00:00 - 00:08] CONTRARIAN OPENING HOOK:\n` +
          `(Visual: Text graphic overlay: "THE HARD TRUTH ABOUT ${cleanTopic.toUpperCase()}")\n` +
          `Host: "Everyone on Twitter and YouTube is telling you that ${cleanTopic} is the future. But today, we need to talk about what they're leaving out."\n\n` +
          `[00:08 - 01:00] UNPACKING THE ILLUSION:\n` +
          `Host: "Don't get me wrong — it has merits. But there are three critical architectural flaws that nobody seems to mention until you're already locked into production."\n\n` +
          `[01:00 - 04:30] FLAW 1: HIDDEN COMPLEXITY:\n` +
          `(Visual: Side-by-side dependency tree comparison)\n` +
          `Host: "Let's measure what this actually does to your maintenance overhead..."\n\n` +
          `[04:30 - 09:30] FLAW 2 & 3: THE PERFORMANCE PARADOX:\n` +
          `(Visual: Raw benchmark graphs showing tail latencies under high concurrency)\n\n` +
          `[09:30 - 11:30] THE BALANCED VERDICT:\n` +
          `Host: "Here is when you should actually use it — and when you're much better off staying simple. What's your take? Let me know below."`;
      }
      setGeneratedScript(script);
    }

    setIsGenerating(false);
    showToast('Generated Assets Ready', `${activeTab.toUpperCase()} generated for "${cleanTopic}"`, 'success');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to Clipboard', 'Text copied successfully', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveTitleToVault = (titleObj: GeneratedTitle) => {
    addIdea({
      title: titleObj.title,
      category: titleObj.category,
      targetKeywords: [topic.toLowerCase()],
      predictedPotential: 'Very High',
      status: 'idea',
      notes: `Tone: ${tone}. ${titleObj.patternStyle}. Generated for topic "${topic}".`,
      tags: ['AIGenerated', 'StudioHook'],
    });
    showToast('Saved to Idea Vault', `"${titleObj.title.slice(0, 30)}..." added to vault`, 'success');
  };

  const handleSaveIdeaToVault = (idea: GeneratedIdea) => {
    addIdea({
      title: idea.title,
      category: idea.format,
      targetKeywords: [topic],
      predictedPotential: idea.potential,
      status: 'idea',
      notes: idea.reason,
      tags: ['AiConcept', tone],
    });
    showToast('Added to Vault', `"${idea.title.slice(0, 30)}..." saved to Idea Vault`, 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              AI Creative Studio
            </h1>
            <Badge variant="purple" size="sm">
              <Sparkles className="h-3 w-3 mr-1" /> Ready for Gemini / OpenAI
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Generate high-performing titles, SEO descriptions, video concepts, and structured scripts using algorithmic creative patterns.
          </p>
        </div>

        {/* Studio Disclaimer Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-[11px] text-zinc-600 dark:text-zinc-300">
          <Info className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Local Pattern Engine (Demo Mode):</strong> Content below is dynamically generated using algorithmic SaaS creator heuristics. In production, configure your Gemini 1.5 Pro or OpenAI API key in Settings for real LLM reasoning.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-navy-750 pb-3">
          <button
            onClick={() => setActiveTab('titles')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'titles'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <Type className="h-4 w-4" /> 1. Video Title Generator
          </button>
          <button
            onClick={() => setActiveTab('descriptions')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'descriptions'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" /> 2. Description Generator
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'ideas'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <Lightbulb className="h-4 w-4" /> 3. Video Ideas Generator
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'scripts'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <FileCode className="h-4 w-4" /> 4. Script Generator
          </button>
        </div>

        {/* Input Parameters Box */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Core Topic / Video Focus
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Next.js 15 full course, AI coding agents, SaaS pricing..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white transition-colors"
              />
              {/* Preset suggestion pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Try quick topic:</span>
                {PRESET_TOPICS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTopic(preset)}
                    className="rounded-lg bg-slate-100 dark:bg-navy-750 hover:bg-slate-200 dark:hover:bg-navy-700 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Tone & Framing Style
              </label>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white transition-colors"
              >
                <option value="educational">Educational & Authoritative</option>
                <option value="hype">High Energy & Viral</option>
                <option value="story">Personal Story & Case Study</option>
                <option value="controversial">Controversial & Contrarian</option>
              </select>
              <p className="text-[10px] text-slate-400">
                Changes phrasing, hooks, chapters, and storytelling structure.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={isGenerating}
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 select-none active:scale-[0.98]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isGenerating ? 'Generating...' : `Generate ${activeTab.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          {/* TAB 1: TITLES */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Generated Title Formats
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated for tone: <span className="font-semibold text-brand-500 capitalize">{tone}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-400">Click to copy or save</span>
              </div>

              <div className="space-y-3">
                {generatedTitles.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-navy-750 dark:bg-navy-800 sm:flex-row sm:items-center sm:justify-between hover:border-slate-200 dark:hover:border-navy-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan" size="sm">
                          {t.category}
                        </Badge>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {t.patternStyle}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(t.id, t.title)}
                      >
                        {copiedId === t.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500 mr-1" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </>
                        )}
                      </Button>
                      <button
                        onClick={() => handleSaveTitleToVault(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                      >
                        <Bookmark className="h-3 w-3 text-zinc-400" /> Save to Vault
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTIONS */}
          {activeTab === 'descriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    SEO-Structured Video Description
                  </h3>
                  <p className="text-xs text-slate-400">
                    Includes formatted key chapters, resource links, and engagement calls to action.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy('desc', generatedDesc)}
                >
                  {copiedId === 'desc' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy Description
                    </>
                  )}
                </Button>
              </div>

              <textarea
                rows={11}
                value={generatedDesc}
                onChange={(e) => setGeneratedDesc(e.target.value)}
                className="w-full font-mono rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-slate-200 leading-relaxed transition-colors"
              />
            </div>
          )}

          {/* TAB 3: IDEAS */}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    High-Potential Video Concepts
                  </h3>
                  <p className="text-xs text-slate-400">
                    Structured concepts with estimated format duration and audience resonance factors.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {generatedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="purple" size="sm">
                          {idea.format}
                        </Badge>
                        <Badge variant="success" size="sm">
                          {idea.potential} Potential
                        </Badge>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {idea.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {idea.reason}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end border-t border-slate-200/50 dark:border-navy-750">
                      <button
                        onClick={() => handleSaveIdeaToVault(idea)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                      >
                        <Plus className="h-3 w-3 text-zinc-400" /> Add to Vault
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCRIPTS */}
          {activeTab === 'scripts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Full Video Script Outline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Features 3-second hook, visual B-roll cues, value blocks, and outro call to action.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy('script', generatedScript)}
                >
                  {copiedId === 'script' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy Script
                    </>
                  )}
                </Button>
              </div>

              <textarea
                rows={15}
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
                className="w-full font-mono leading-relaxed rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-slate-200 transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
