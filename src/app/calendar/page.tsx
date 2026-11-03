'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Calendar as CalendarIcon, Plus, Video, Zap, Radio, MessageSquare, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CalendarEvent } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function ContentCalendarPage() {
  const { calendarEvents, addCalendarEvent, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-11-12');
  const [newType, setNewType] = useState<CalendarEvent['type']>('upload');
  const [newTime, setNewTime] = useState('14:00 EST');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle,
      date: newDate,
      type: newType,
      status: 'scheduled',
      timeSlot: newTime,
    });

    showToast('Event Scheduled', `"${newTitle}" added to publishing calendar`, 'success');
    setNewTitle('');
    setModalOpen(false);
  };

  const typeIcons = {
    upload: <Video className="h-3.5 w-3.5 text-blue-500" />,
    short: <Zap className="h-3.5 w-3.5 text-cyan-500" />,
    livestream: <Radio className="h-3.5 w-3.5 text-rose-500" />,
    community: <MessageSquare className="h-3.5 w-3.5 text-amber-500" />,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Content Publishing Calendar
              </h1>
              <Badge variant="purple" size="sm">
                November 2026
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Plan, schedule, and organize your long-form videos, Shorts, livestreams, and community posts.
            </p>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Schedule Content
          </Button>
        </div>

        {/* Calendar Grid Representation */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-brand-500" /> November 2026 Schedule
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Video</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Short</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Live</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Post</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calendarEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-navy-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-slate-500 dark:text-slate-400">
                    {typeIcons[event.type]}
                    <span>{event.type}</span>
                  </div>
                  <Badge
                    variant={event.status === 'scheduled' ? 'success' : event.status === 'published' ? 'purple' : 'default'}
                    size="sm"
                  >
                    {event.status}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {event.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-navy-700/60">
                  <span>📅 {event.date}</span>
                  <span>⏰ {event.timeSlot || '14:00 EST'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule Content Publishing"
          description="Plan your next upload date and time slot."
        >
          <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Title / Working Headline
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Next.js 15 Full Tutorial"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Content Format
                </label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                >
                  <option value="upload">Long-form Video</option>
                  <option value="short">YouTube Short</option>
                  <option value="livestream">Livestream Q&A</option>
                  <option value="community">Community Poll/Post</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Optimal Publish Time
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="14:00 EST"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-navy-750">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add to Calendar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}

