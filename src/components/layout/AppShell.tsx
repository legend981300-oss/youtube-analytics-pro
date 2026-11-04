'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DemoNotice } from '@/components/ui/DemoNotice';
import { CommandPalette } from './CommandPalette';
import { ChannelExplorerModal } from '@/components/channels/ChannelExplorerModal';
import { MilestoneCardModal } from '@/components/social/MilestoneCardModal';
import { FloatingAiCopilot } from '@/components/ai/FloatingAiCopilot';
import { AmbientBackdrop } from '@/components/ui/AmbientBackdrop';
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
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#090a0f] dark:text-slate-100 flex font-sans transition-colors duration-200 relative select-text">
      {/* Dynamic Ambient Gradient Backdrop */}
      <AmbientBackdrop />

      {/* Desktop Sidebar: 100% Pinned Fixed Left Navigation */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-full z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
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

      {/* Right Area: Pinned Top Controls + Independently Scrollable Main Content */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative z-10">
        {/* Top Notice Banner */}
        <div className="shrink-0">
          <DemoNotice />
        </div>

        {/* Pinned Navbar */}
        <div className="shrink-0">
          <Navbar
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenChannelExplorer={() => setChannelExplorerOpen(true)}
            onOpenMilestoneCard={() => setMilestoneModalOpen(true)}
          />
        </div>

        {/* Main Content Viewport: Scrolls independently with GPU acceleration */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in scrollbar-thin gpu-scroll">
          {children}
        </main>
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
