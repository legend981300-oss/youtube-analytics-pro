'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DemoNotice } from '@/components/ui/DemoNotice';
import { CommandPalette } from './CommandPalette';
import { ChannelExplorerModal } from '@/components/channels/ChannelExplorerModal';
import { MilestoneCardModal } from '@/components/social/MilestoneCardModal';
import { FloatingAiCopilot } from '@/components/ai/FloatingAiCopilot';
import { X } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [channelExplorerOpen, setChannelExplorerOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Demo Notice Banner */}
      <DemoNotice />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Backdrop & Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col shadow-2xl animate-fade-in">
              <div className="absolute right-2 top-3 z-10">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-white/20 p-1.5 text-white hover:bg-white/30 backdrop-blur-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <Navbar
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenChannelExplorer={() => setChannelExplorerOpen(true)}
            onOpenMilestoneCard={() => setMilestoneModalOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </main>
        </div>
      </div>

      {/* Global Interactive Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenChannelExplorer={() => setChannelExplorerOpen(true)}
        onOpenMilestoneCard={() => setMilestoneModalOpen(true)}
      />

      {/* Public YouTube Channel Explorer Modal */}
      <ChannelExplorerModal
        isOpen={channelExplorerOpen}
        onClose={() => setChannelExplorerOpen(false)}
      />

      {/* Social Milestone Celebration Card Generator Modal */}
      <MilestoneCardModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
      />

      {/* Floating Ask Channel AI Copilot Assistant */}
      <FloatingAiCopilot />
    </div>
  );
};
