'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Channel,
  DateRange,
  VideoIdea,
  Goal,
  CalendarEvent,
  NotificationItem,
  UserProfile,
} from '@/types';
import {
  DEMO_CHANNELS,
  CURRENT_USER,
  DEMO_IDEAS,
  DEMO_GOALS,
  DEMO_CALENDAR_EVENTS,
  DEMO_NOTIFICATIONS,
} from '@/lib/demo-data';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedChannel: Channel;
  setSelectedChannel: (channel: Channel) => void;
  channels: Channel[];
  addNewChannel: (name: string, handle: string, category: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  ideas: VideoIdea[];
  addIdea: (idea: Omit<VideoIdea, 'id' | 'createdAt'>) => void;
  updateIdeaStatus: (id: string, status: VideoIdea['status']) => void;
  toggleFavoriteIdea: (id: string) => void;
  deleteIdea: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  updateGoalProgress: (id: string, currentValue: number) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  demoNoticeDismissed: boolean;
  setDemoNoticeDismissed: (d: boolean) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [channels, setChannels] = useState<Channel[]>(DEMO_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(DEMO_CHANNELS[0]);
  const [dateRange, setDateRange] = useState<DateRange>('28d');
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [ideas, setIdeas] = useState<VideoIdea[]>(DEMO_IDEAS);
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(DEMO_CALENDAR_EVENTS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [demoNoticeDismissed, setDemoNoticeDismissed] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize theme and hydrate local state from storage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('yt_pro_theme') as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Hydrate channels
      const savedChannels = localStorage.getItem('yt_pro_channels');
      if (savedChannels) {
        const parsed = JSON.parse(savedChannels);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChannels(parsed);
          const savedChId = localStorage.getItem('yt_pro_selected_channel_id');
          const matched = parsed.find((c: Channel) => c.id === savedChId);
          if (matched) setSelectedChannel(matched);
        }
      }

      // Hydrate ideas
      const savedIdeas = localStorage.getItem('yt_pro_ideas');
      if (savedIdeas) {
        const parsed = JSON.parse(savedIdeas);
        if (Array.isArray(parsed)) setIdeas(parsed);
      }

      // Hydrate goals
      const savedGoals = localStorage.getItem('yt_pro_goals');
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (Array.isArray(parsed)) setGoals(parsed);
      }

      // Hydrate calendar
      const savedCalendar = localStorage.getItem('yt_pro_calendar');
      if (savedCalendar) {
        const parsed = JSON.parse(savedCalendar);
        if (Array.isArray(parsed)) setCalendarEvents(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    try {
      localStorage.setItem('yt_pro_channels', JSON.stringify(channels));
    } catch {}
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('yt_pro_selected_channel_id', selectedChannel.id);
    } catch {}
  }, [selectedChannel]);

  useEffect(() => {
    try {
      localStorage.setItem('yt_pro_ideas', JSON.stringify(ideas));
    } catch {}
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem('yt_pro_goals', JSON.stringify(goals));
    } catch {}
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('yt_pro_calendar', JSON.stringify(calendarEvents));
    } catch {}
  }, [calendarEvents]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('yt_pro_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = useCallback(
    (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Updated', 'All notifications marked as read.', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNewChannel = (name: string, handle: string, category: string) => {
    const newChan: Channel = {
      id: `ch-${Date.now()}`,
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatar: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80`,
      subscribers: 0,
      totalViews: 0,
      totalVideos: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      category,
      verified: false,
      status: 'active',
    };
    setChannels((prev) => [newChan, ...prev]);
    setSelectedChannel(newChan);
    showToast('Channel Linked (Demo)', `Switched active channel to ${newChan.name}.`, 'success');
  };

  const addIdea = (idea: Omit<VideoIdea, 'id' | 'createdAt'>) => {
    const newIdea: VideoIdea = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setIdeas((prev) => [newIdea, ...prev]);
    showToast('Saved to Idea Vault', `"${idea.title}" added to your production pipeline.`, 'success');
  };

  const updateIdeaStatus = (id: string, status: VideoIdea['status']) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, status } : idea))
    );
    showToast('Vault Updated', `Idea status changed to ${status.toUpperCase()}.`, 'info');
  };

  const toggleFavoriteIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, favorite: !idea.favorite } : idea
      )
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    showToast('Idea Removed', 'Video concept removed from Vault.', 'warning');
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
      completed: goal.currentValue >= goal.targetValue,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast('Goal Created', `Tracking ${goal.title}.`, 'success');
  };

  const updateGoalProgress = (id: string, currentValue: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const isComplete = currentValue >= g.targetValue;
        if (isComplete && !g.completed) {
          showToast('Goal Achieved! 🎉', `Congratulations on reaching ${g.title}!`, 'success');
        }
        return {
          ...g,
          currentValue,
          completed: isComplete,
        };
      })
    );
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    showToast('Upload Scheduled', `"${event.title}" planned for ${event.date}.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedChannel,
        setSelectedChannel,
        channels,
        addNewChannel,
        dateRange,
        setDateRange,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        ideas,
        addIdea,
        updateIdeaStatus,
        toggleFavoriteIdea,
        deleteIdea,
        goals,
        addGoal,
        updateGoalProgress,
        calendarEvents,
        addCalendarEvent,
        currentUser,
        setCurrentUser,
        searchQuery,
        setSearchQuery,
        demoNoticeDismissed,
        setDemoNoticeDismissed,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
