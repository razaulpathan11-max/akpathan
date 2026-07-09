import { useState, useEffect } from 'react';
import { Tool, User, BlogPost } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import InterstitialAd from './components/InterstitialAd';
import AdPlacement from './components/AdPlacement';
import HomeView from './views/HomeView';
import BlogView from './views/BlogView';
import LegalViews from './views/LegalViews';
import ToolTextGen from './components/ToolTextGen';
import ToolImageGen from './components/ToolImageGen';
import ToolParaphraser from './components/ToolParaphraser';
import ToolSummarizer from './components/ToolSummarizer';
import ToolChatbot from './components/ToolChatbot';
import { BLOG_POSTS } from './data/blog';
import { Sparkles, Terminal, Info, ShieldAlert } from 'lucide-react';

const TOOLS: Tool[] = [
  {
    id: 'text-gen',
    name: 'AI Text Generator',
    description: 'Create long-form articles, emails, or social captions with custom length, tone, and formatting instructions.',
    category: 'text',
    icon: 'text-gen',
    popularity: 'High',
    searchVolume: '85K/mo',
    slug: 'ai-text-generator'
  },
  {
    id: 'image-gen',
    name: 'AI Image Generator',
    description: 'Turn descriptive textual ideas into high-fidelity custom graphical illustrations or realistic photographs.',
    category: 'image',
    icon: 'image-gen',
    popularity: 'High',
    searchVolume: '140K/mo',
    slug: 'ai-image-generator'
  },
  {
    id: 'paraphraser',
    name: 'AI Paraphraser / Rewriter',
    description: 'Rewrite sentences, paragraphs, or copy in diverse tonal signatures while fixing wordy phrasing.',
    category: 'text',
    icon: 'paraphraser',
    popularity: 'Medium',
    searchVolume: '50K/mo',
    slug: 'ai-paraphraser-rewriter'
  },
  {
    id: 'summarizer',
    name: 'AI Summarizer',
    description: 'Paste long research documents, essays, or posts and receive brief takeaways or formatted bullet lists.',
    category: 'utility',
    icon: 'summarizer',
    popularity: 'Medium',
    searchVolume: '35K/mo',
    slug: 'ai-summarizer'
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot Q&A',
    description: 'An open interactive helper bot for open brainstorming, code auditing, answering trivia, or drafting notes.',
    category: 'utility',
    icon: 'chatbot',
    popularity: 'New',
    searchVolume: '15K/mo',
    slug: 'ai-chatbot-assistant'
  }
];

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // Authentication & Limits
  const [user, setUser] = useState<User>({
    email: '',
    isLoggedIn: false,
    dailyLimit: 5,
    usedToday: 0
  });

  // Ads & Interactive Sandbox States
  const [adBlockEnabled, setAdBlockEnabled] = useState<boolean>(false);
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(0.0);
  const [generationCountForInterstitial, setGenerationCountForInterstitial] = useState<number>(0);
  const [interstitialOpen, setInterstitialOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Persistent Session and Count Reset Logic
  useEffect(() => {
    // 1. Recover auth state
    const savedEmail = localStorage.getItem('aetherai_user_email');
    const isLoggedIn = savedEmail !== null;
    
    // 2. Recover usage count and handle Daily Reset
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastUsageDate = localStorage.getItem('aetherai_last_usage_date');
    let usedToday = 0;

    if (lastUsageDate === todayStr) {
      const savedCount = localStorage.getItem('aetherai_used_today');
      usedToday = savedCount ? parseInt(savedCount, 10) : 0;
    } else {
      // Different day or no date recorded, reset local count
      localStorage.setItem('aetherai_last_usage_date', todayStr);
      localStorage.setItem('aetherai_used_today', '0');
    }

    // 3. Set limit based on auth status
    const dailyLimit = isLoggedIn ? 25 : 5;

    setUser({
      email: savedEmail || '',
      isLoggedIn,
      dailyLimit,
      usedToday
    });

    // Recover previous simulated revenue if any
    const savedRev = localStorage.getItem('aetherai_sim_rev');
    if (savedRev) {
      setSimulatedRevenue(parseFloat(savedRev));
    }
  }, []);

  // Update localStorage when revenue changes
  const updateRevenue = (amount: number) => {
    setSimulatedRevenue((prev) => {
      const next = prev + amount;
      localStorage.setItem('aetherai_sim_rev', next.toFixed(3));
      return next;
    });
  };

  // Check limits and log usage
  const handleUsageCheck = (): boolean => {
    if (user.usedToday >= user.dailyLimit) {
      alert(`Daily limit reached (${user.usedToday}/${user.dailyLimit} generations). Please sign up or log in for a free account to boost your limit to 25 daily generations!`);
      setAuthModalOpen(true);
      return false;
    }

    // Log usage
    const nextUsed = user.usedToday + 1;
    setUser(prev => ({ ...prev, usedToday: nextUsed }));
    localStorage.setItem('aetherai_used_today', nextUsed.toString());

    // Passive ad impression revenue
    if (!adBlockEnabled) {
      updateRevenue(0.005); // Half a cent per generation load
    }

    // Interstitial tracking
    const nextGenCount = generationCountForInterstitial + 1;
    if (nextGenCount >= 3) {
      setGenerationCountForInterstitial(0);
      if (!adBlockEnabled) {
        setInterstitialOpen(true);
      }
    } else {
      setGenerationCountForInterstitial(nextGenCount);
    }

    return true;
  };

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('aetherai_user_email', email);
    setUser(prev => ({
      ...prev,
      email,
      isLoggedIn: true,
      dailyLimit: 25
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('aetherai_user_email');
    setUser(prev => ({
      ...prev,
      email: '',
      isLoggedIn: false,
      dailyLimit: 5
    }));
  };

  const handleAdClick = () => {
    if (!adBlockEnabled) {
      updateRevenue(0.45); // StandardCPC mock click worth 45 cents
    }
  };

  // Router dispatcher
  const handleNavigate = (view: string, params?: string) => {
    setCurrentView(view);
    if (view === 'blog') {
      setSelectedBlogSlug(params || null);
    }
    // Increment ad impression value slightly on page transitions
    if (!adBlockEnabled) {
      updateRevenue(0.002);
    }
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render proper view based on route state
  const renderView = () => {
    if (currentView === 'home') {
      return (
        <HomeView
          tools={TOOLS}
          onSelectTool={(id) => handleNavigate(`tool-${id}`)}
          onNavigate={handleNavigate}
          simulatedRevenue={simulatedRevenue}
        />
      );
    }

    if (currentView === 'blog') {
      return (
        <BlogView
          posts={BLOG_POSTS}
          selectedSlug={selectedBlogSlug}
          onNavigate={handleNavigate}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (['about', 'privacy', 'terms', 'contact'].includes(currentView)) {
      return (
        <LegalViews
          viewMode={currentView as any}
          onNavigate={handleNavigate}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (currentView === 'tool-text-gen') {
      return (
        <ToolTextGen
          onUsage={handleUsageCheck}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (currentView === 'tool-image-gen') {
      return (
        <ToolImageGen
          onUsage={handleUsageCheck}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (currentView === 'tool-paraphraser') {
      return (
        <ToolParaphraser
          onUsage={handleUsageCheck}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (currentView === 'tool-summarizer') {
      return (
        <ToolSummarizer
          onUsage={handleUsageCheck}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    if (currentView === 'tool-chatbot') {
      return (
        <ToolChatbot
          onUsage={handleUsageCheck}
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      );
    }

    return (
      <div className="py-20 text-center text-gray-500">
        404 - View not found
      </div>
    );
  };

  return (
    <div id="aetherai-root" className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 leading-normal antialiased">
      {/* ⚠️ PRD Core requirement: Banner ad (top of page, below header / above navigation or content) */}
      <div className="bg-white border-b border-gray-100 py-3.5 px-4 hidden sm:block">
        <AdPlacement 
          id="global-top-leaderboard" 
          size="leaderboard" 
          adBlockEnabled={adBlockEnabled}
          onAdClick={handleAdClick}
        />
      </div>

      {/* Navigation */}
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        simulatedRevenue={simulatedRevenue}
      />

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        adBlockEnabled={adBlockEnabled}
        onToggleAdBlock={() => setAdBlockEnabled(!adBlockEnabled)}
      />

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Interstitial Ad Portal */}
      <InterstitialAd
        isOpen={interstitialOpen}
        onClose={() => setInterstitialOpen(false)}
        onAdClick={handleAdClick}
      />
    </div>
  );
}
