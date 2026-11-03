'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MessageSquare, ThumbsUp, Sparkles, HelpCircle, Check, Copy, Filter, Search } from 'lucide-react';
import { DEMO_COMMENTS } from '@/lib/demo-data';
import { CommentSentimentItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';

import { useApp } from '@/context/AppContext';

export default function CommentsPage() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative' | 'questions'>('all');
  const [search, setSearch] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredComments = DEMO_COMMENTS.filter((c) => {
    const matchesSearch =
      c.comment.toLowerCase().includes(search.toLowerCase()) ||
      c.author.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'questions') return c.isQuestion;
    if (filter !== 'all') return c.sentiment === filter;
    return true;
  });

  const handleGenerateReply = (comment: CommentSentimentItem) => {
    let reply = '';
    if (comment.isQuestion) {
      reply = `Hey @${comment.author}, great question! I covered this specific edge case in the repo README and will do a quick Short to demonstrate. Appreciate you watching!`;
    } else if (comment.sentiment === 'positive') {
      reply = `Thank you so much @${comment.author}! Really glad this breakdown was helpful for your MVP. More deep-dives coming next week!`;
    } else {
      reply = `Thanks for the feedback @${comment.author}! Good catch on that segment, will definitely improve that in the next upload.`;
    }

    setReplyTextMap((prev) => ({ ...prev, [comment.id]: reply }));
    showToast('Reply Generated', `Draft reply prepared for @${comment.author}`, 'info');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied', 'Reply copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Comment Sentiment & Question Extraction
            </h1>
            <Badge variant="purple" size="sm">
              Simulated NLP (Demo)
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Automatically detect viewer sentiment, extract audience questions, and generate quick context replies.
          </p>
        </div>

        {/* 4 Sentiment Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Positive Sentiment"
            value="78.4%"
            change={5.2}
            icon={ThumbsUp}
            iconColor="text-emerald-500"
            subtitle="Strong community appreciation"
          />
          <StatCard
            title="Viewer Questions"
            value="34 Unanswered"
            change={12.0}
            icon={HelpCircle}
            iconColor="text-blue-500"
            subtitle="Prime content ideas in comments"
          />
          <StatCard
            title="Neutral / Feedback"
            value="17.6%"
            change={-2.1}
            icon={MessageSquare}
            iconColor="text-amber-500"
            subtitle="Constructive observations"
          />
          <StatCard
            title="Negative Sentiment"
            value="4.0%"
            change={-1.5}
            icon={MessageSquare}
            iconColor="text-rose-500"
            subtitle="Well below platform threshold"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comments or author..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-750 dark:text-slate-300'
              }`}
            >
              All ({DEMO_COMMENTS.length})
            </button>
            <button
              onClick={() => setFilter('questions')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === 'questions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-750 dark:text-slate-300'
              }`}
            >
              Questions Only ❓
            </button>
            <button
              onClick={() => setFilter('positive')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === 'positive'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-750 dark:text-slate-300'
              }`}
            >
              Positive 👍
            </button>
            <button
              onClick={() => setFilter('negative')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === 'negative'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-750 dark:text-slate-300'
              }`}
            >
              Criticism / Negative
            </button>
          </div>
        </div>

        {/* Comments Feed */}
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-slate-400">{comment.publishedAt}</span>
                      {comment.isQuestion && (
                        <Badge variant="cyan" size="sm">
                          Question
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      On: <strong className="text-slate-700 dark:text-slate-300">{comment.videoTitle}</strong>
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    comment.sentiment === 'positive'
                      ? 'success'
                      : comment.sentiment === 'negative'
                      ? 'danger'
                      : 'default'
                  }
                  size="sm"
                >
                  {comment.sentiment.toUpperCase()} ({comment.sentimentScore}%)
                </Badge>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-navy-800/50 p-3 rounded-xl border border-slate-100 dark:border-navy-750">
                &quot;{comment.comment}&quot;
              </p>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px]">
                  👍 {comment.likes} likes
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateReply(comment)}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1 text-brand-500" />
                    AI Reply Draft
                  </Button>
                </div>
              </div>

              {replyTextMap[comment.id] && (
                <div className="mt-3 rounded-xl border border-brand-500/30 bg-brand-500/5 p-3 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                      Generated AI Reply:
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(comment.id, replyTextMap[comment.id])}
                    >
                      {copiedId === comment.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" /> Copy Reply
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {replyTextMap[comment.id]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

