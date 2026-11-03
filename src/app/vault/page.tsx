'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  FolderKanban,
  Plus,
  Star,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { VideoIdea } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

const COLUMNS: { id: VideoIdea['status']; label: string; color: string }[] = [
  { id: 'idea', label: 'Idea Backlog', color: 'border-slate-500' },
  { id: 'scripting', label: 'Scripting', color: 'border-blue-500' },
  { id: 'recording', label: 'Recording', color: 'border-amber-500' },
  { id: 'editing', label: 'Editing', color: 'border-purple-500' },
  { id: 'published', label: 'Published', color: 'border-emerald-500' },
];

export default function VideoIdeaVaultPage() {
  const { ideas, addIdea, updateIdeaStatus, toggleFavoriteIdea, deleteIdea, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New Idea Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering & Code');
  const [potential, setPotential] = useState<VideoIdea['predictedPotential']>('Very High');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addIdea({
      title,
      category,
      targetKeywords: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
      predictedPotential: potential,
      status: 'idea',
      notes,
      tags: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
      favorite: false,
    });

    showToast('Idea Saved', `"${title}" added to your Kanban pipeline`, 'success');
    setTitle('');
    setNotes('');
    setTagsInput('');
    setModalOpen(false);
  };

  const handleDelete = (id: string, ideaTitle: string) => {
    deleteIdea(id);
    showToast('Idea Removed', `"${ideaTitle}" deleted from Vault`, 'info');
  };

  const handleStatusChange = (id: string, newStatus: VideoIdea['status'], ideaTitle: string) => {
    updateIdeaStatus(id, newStatus);
    showToast('Status Updated', `Moved to ${newStatus.toUpperCase()}`, 'info');
  };

  const getNextStatus = (curr: VideoIdea['status']): VideoIdea['status'] | null => {
    const order: VideoIdea['status'][] = ['idea', 'scripting', 'recording', 'editing', 'published'];
    const idx = order.indexOf(curr);
    if (idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (curr: VideoIdea['status']): VideoIdea['status'] | null => {
    const order: VideoIdea['status'][] = ['idea', 'scripting', 'recording', 'editing', 'published'];
    const idx = order.indexOf(curr);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  const filteredIdeas = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Video Idea Vault & Production Kanban
              </h1>
              <Badge variant="purple" size="sm">
                {ideas.length} Concepts
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage your video pipeline from brainstorm to filming, editing, and publishing.
            </p>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New Idea
          </Button>
        </div>

        {/* Filter bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas or tags..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-navy-750 dark:bg-navy-850 dark:text-white"
          />
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-start">
          {COLUMNS.map((col) => {
            const colIdeas = filteredIdeas.filter((i) => i.status === col.id);
            return (
              <div
                key={col.id}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 dark:border-navy-750 dark:bg-navy-900/80 min-h-[500px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-750">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full border-2 ${col.color}`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {col.label}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-navy-750 dark:text-slate-300">
                    {colIdeas.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colIdeas.map((idea) => {
                    const nextSt = getNextStatus(idea.status);
                    const prevSt = getPrevStatus(idea.status);

                    return (
                      <div
                        key={idea.id}
                        className="group relative rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm hover:border-slate-300 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-navy-600 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <Badge
                            variant={
                              idea.predictedPotential === 'Very High'
                                ? 'success'
                                : idea.predictedPotential === 'High'
                                ? 'cyan'
                                : 'default'
                            }
                            size="sm"
                          >
                            {idea.predictedPotential}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleFavoriteIdea(idea.id)}
                              className="text-slate-400 hover:text-amber-400"
                              title="Favorite"
                            >
                              <Star
                                className={`h-3.5 w-3.5 ${
                                  idea.favorite ? 'fill-amber-400 text-amber-400' : ''
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(idea.id, idea.title)}
                              className="text-slate-400 hover:text-rose-500"
                              title="Delete idea"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {idea.title}
                        </h4>

                        {idea.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {idea.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {idea.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-navy-750 dark:text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Movement Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-750/70 text-[10px]">
                          {prevSt ? (
                            <button
                              onClick={() => handleStatusChange(idea.id, prevSt, idea.title)}
                              className="flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              <ChevronLeft className="h-3 w-3 mr-0.5" /> Back
                            </button>
                          ) : (
                            <span />
                          )}

                          {nextSt ? (
                            <button
                              onClick={() => handleStatusChange(idea.id, nextSt, idea.title)}
                              className="flex items-center font-bold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                              Advance <ChevronRight className="h-3 w-3 ml-0.5" />
                            </button>
                          ) : (
                            <span className="text-emerald-500 font-bold">Done ✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Idea Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Video Concept"
          description="Capture a new idea for your creation backlog."
        >
          <form onSubmit={handleCreateIdea} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Working Video Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Build an Autonomous Agent in Python"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Predicted Potential
                </label>
                <select
                  value={potential}
                  onChange={(e: any) => setPotential(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                >
                  <option value="Very High">Very High Potential</option>
                  <option value="High">High Potential</option>
                  <option value="Medium">Medium Potential</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ai, python, tutorial"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Notes & Outline
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key talking points or references..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-navy-750">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save to Vault
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}

