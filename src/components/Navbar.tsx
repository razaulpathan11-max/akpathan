import { useState } from 'react';
import { Sparkles, Menu, X, ChevronDown, User, ShieldAlert, Coins, HelpCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType;
  onNavigate: (view: string, params?: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentView: string;
  simulatedRevenue: number;
}

export default function Navbar({ user, onNavigate, onOpenAuth, onLogout, currentView, simulatedRevenue }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const handleNavClick = (view: string, params?: string) => {
    onNavigate(view, params);
    setIsOpen(false);
    setToolsDropdownOpen(false);
  };

  const activeClass = (viewName: string) => 
    currentView === viewName 
      ? 'text-gray-900 font-bold bg-gray-50' 
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50';

  const tools = [
    { id: 'text-gen', name: 'AI Text Generator' },
    { id: 'image-gen', name: 'AI Image Generator' },
    { id: 'paraphraser', name: 'AI Paraphraser / Rewriter' },
    { id: 'summarizer', name: 'AI Summarizer' },
    { id: 'chatbot', name: 'AI Chatbot Q&A' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="bg-gray-900 text-white p-2 rounded-xl flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="font-sans font-black tracking-tight text-lg text-gray-900">Aether<span className="text-gray-500 font-normal">AI</span></span>
            <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold tracking-wider">Free</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeClass('home')}`}
            >
              Home
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 text-gray-500 hover:text-gray-900 ${
                  currentView.startsWith('tool-') ? 'text-gray-900 font-bold' : ''
                }`}
              >
                AI Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleNavClick(`tool-${t.id}`)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('blog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeClass('blog')}`}
            >
              Blog
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeClass('about')}`}
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeClass('contact')}`}
            >
              Contact
            </button>
          </nav>

          {/* User Limits & Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Ad Revenue Tracker */}
            <div 
              title="Total simulated earnings from ad impressions and clicks in this session" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-xs font-medium cursor-help"
            >
              <Coins className="w-4 h-4 text-yellow-600 animate-spin-slow" />
              <span>Simulated Ad Rev: <span className="font-mono font-bold">${simulatedRevenue.toFixed(3)}</span></span>
            </div>

            {/* Daily limit counter */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 font-medium font-sans">DAILY GENERATIONS</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-gray-800">{user.usedToday}</span>
                <span className="text-xs text-gray-300">/</span>
                <span className="font-mono text-sm font-medium text-gray-500">{user.dailyLimit}</span>
                <span className="text-xs text-gray-400">used</span>
              </div>
            </div>

            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-px h-6 bg-gray-100" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs" title={user.email}>
                    {user.email[0].toUpperCase()}
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Boost Limit
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <div 
              title="Simulated Ad Revenue"
              className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-[10px] font-bold"
            >
              <Coins className="w-3.5 h-3.5 text-yellow-600" />
              <span>${simulatedRevenue.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-inner">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Home
            </button>
            
            <div className="py-2.5 px-3">
              <span className="text-xs font-mono tracking-wider text-gray-400 font-bold uppercase block mb-2">
                AI Tools
              </span>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleNavClick(`tool-${t.id}`)}
                    className="text-left py-1.5 text-xs text-gray-500 hover:text-gray-900"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNavClick('blog')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Blog
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Contact
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center px-3">
              <span className="text-xs text-gray-500 font-medium">Daily AI Limit:</span>
              <span className="font-mono text-sm font-bold text-gray-800">
                {user.usedToday} / {user.dailyLimit} Generations
              </span>
            </div>

            {user.isLoggedIn ? (
              <div className="flex items-center justify-between px-3">
                <span className="text-xs text-gray-700 truncate font-semibold">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold text-center"
              >
                Boost Limit (25/day)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
