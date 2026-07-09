import React, { useState } from 'react';
import { Search, Flame, Shield, Award, HelpCircle, Coins, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';
import { Tool, Category } from '../types';
import ToolCard from '../components/ToolCard';

interface HomeViewProps {
  tools: Tool[];
  onSelectTool: (id: string) => void;
  onNavigate: (view: string, params?: string) => void;
  simulatedRevenue: number;
}

export default function HomeView({ tools, onSelectTool, onNavigate, simulatedRevenue }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: '⚡ All AI Tools' },
    { value: 'text', label: '✍️ Text & Writing' },
    { value: 'image', label: '🎨 Image Creators' },
    { value: 'utility', label: '⚙️ Utilities & Q&A' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto py-12 px-4 space-y-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-gray-500 font-bold uppercase">
            Sustainably Funded by Displays Ads
          </span>
        </div>
        
        <h1 className="font-sans font-black tracking-tight text-4xl sm:text-5xl text-gray-900 leading-tight">
          Democratizing AI. <br />
          <span className="text-gray-400">Completely Free.</span> No Paywalls.
        </h1>
        
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Access high-performance artificial intelligence tools for writing, image creation, rewriting, and summarization. No expensive monthly packages, no login loops. Just open and generate.
        </p>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto shadow-md rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through free AI tools (e.g. image, summarizer)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all font-sans"
          />
        </div>
      </section>

      {/* Featured Banner (Sponsor) */}
      <div className="max-w-7xl mx-auto bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex p-1 px-2.5 bg-yellow-100 text-yellow-800 text-[9px] font-bold rounded uppercase tracking-wider">
            Sponsored Highlight
          </div>
          <h2 className="text-lg font-black text-gray-900 leading-tight font-sans">
            Need Dedicated Cloud Storage? Meet Google Firebase
          </h2>
          <p className="text-xs text-gray-500 max-w-xl leading-normal">
            Store documents, user logs, and histories securely on the cloud. AetherAI utilizes Firebase Firestore to power our high-performance persistence, providing zero-cold-start queries worldwide.
          </p>
        </div>
        <a
          href="https://firebase.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
        >
          Check out Firebase
        </a>
      </div>

      {/* Categories Tabs */}
      <div className="max-w-7xl mx-auto border-b border-gray-100 pb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
              selectedCategory === cat.value
                ? 'border-gray-900 bg-gray-950 text-white shadow-xs'
                : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onSelectTool(tool.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 space-y-2 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Search className="w-12 h-12 stroke-1 mx-auto text-gray-300" />
            <h3 className="font-sans font-bold text-gray-500">No matching tools found</h3>
            <p className="text-xs max-w-xs mx-auto leading-normal">
              Try adjusting your spelling or browsing with different category filters.
            </p>
          </div>
        )}
      </div>

      {/* Monetization Economic Engine Dashboard - A creative, highly polished showcase */}
      <section className="max-w-7xl mx-auto border border-gray-100 bg-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-gray-950 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-600 animate-spin-slow" />
              Simulated Platform Economic Dashboard
            </h2>
            <p className="text-xs text-gray-400">
              Interactive sandbox demonstrating the ad-supported monetization engine behind AetherAI.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 text-emerald-800 text-[10px] font-bold tracking-wider font-mono uppercase">
            Active Campaign Mode
          </div>
        </div>

        {/* Platform stats widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-100/50 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase tracking-widest">Platform Traffic</span>
            <span className="text-xl font-sans font-black text-gray-900 block leading-none">12,482 <span className="text-[10px] text-gray-400 font-normal">Hits</span></span>
            <span className="text-[9px] text-gray-400 block leading-normal">Simulated visitor hits today</span>
          </div>

          <div className="bg-gray-50 border border-gray-100/50 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase tracking-widest">Ad Impressions</span>
            <span className="text-xl font-sans font-black text-gray-900 block leading-none">42,912 <span className="text-[10px] text-gray-400 font-normal">Imps</span></span>
            <span className="text-[9px] text-gray-400 block leading-normal">Simulated banner loads today</span>
          </div>

          <div className="bg-gray-50 border border-gray-100/50 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase tracking-widest">Est. CPM Revenue</span>
            <span className="text-xl font-sans font-black text-gray-900 block leading-none">$193.10</span>
            <span className="text-[9px] text-gray-400 block leading-normal">Simulated earnings at $4.50 CPM</span>
          </div>

          <div className="bg-yellow-50/50 border border-yellow-100/50 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-yellow-600 block uppercase tracking-widest">Session Ad Clicks</span>
            <span className="text-xl font-sans font-black text-yellow-900 block leading-none">${simulatedRevenue.toFixed(3)}</span>
            <span className="text-[9px] text-yellow-600 block leading-normal">Earnings from your test clicks!</span>
          </div>
        </div>

        {/* Explanatory blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          <div className="space-y-2 leading-relaxed">
            <h4 className="font-semibold text-gray-950 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gray-400" /> Balancing AI Budgets with AdSense
            </h4>
            <p className="text-gray-500">
              Generative AI APIs (like Gemini) cost tiny fractions of a cent per prompt. By introducing display ads in content corridors and limit buffers (interstitials), we recover our computational costs. Display campaigns easily offset normal, organic usage.
            </p>
          </div>
          <div className="space-y-2 leading-relaxed">
            <h4 className="font-semibold text-gray-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gray-400" /> Strategic SEO Writing Strategy
            </h4>
            <p className="text-gray-500">
              Free web pages rank much higher on Google search results due to low click friction and high engagement. Adding customized tools targeting keywords like "free fast AI image generator" with custom landing pages secures sustainable organic traffic indefinitely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
