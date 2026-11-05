'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { ChannelExplorerModal } from '@/components/channels/ChannelExplorerModal';
import { MilestoneCardModal } from '@/components/social/MilestoneCardModal';
import { FloatingAiCopilot } from '@/components/ai/FloatingAiCopilot';
import { AmbientBackdrop } from '@/components/ui/AmbientBackdrop';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [channelExplorerOpen, setChannelExplorerOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Authentication Guard: strictly verify session before rendering protected app shell
  useEffect(() => {
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('yt_pro_is_authenticated') : null;
    if (storedAuth !== 'true') {
      router.push('/auth/login?required=true');
    } else {
      setIsVerifyingAuth(false);
    }
  }, [router, isAuthenticated]);

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

  if (isVerifyingAuth) {
    return (
      <div className="h-screen w-screen bg-[#090a0f] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Verifying creator access...</p>
        </div>
      </div>
    );
  }

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


        {/* Pinned Navbar */}
        <div className="shrink-0">
          <Navbar
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenChannelExplorer={() => setChannelExplorerOpen(true)}
            onOpenMilestoneCard={() => setMilestoneModalOpen(true)}
          />
        </div>

        {/* Main Content Viewport: Scrolls independently */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto scrollbar-thin">
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
