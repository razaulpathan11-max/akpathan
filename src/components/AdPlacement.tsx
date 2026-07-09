import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, ShieldAlert } from 'lucide-react';

interface AdPlacementProps {
  id: string;
  size: 'leaderboard' | 'medium-rectangle' | 'sidebar' | 'footer' | 'mobile-banner';
  className?: string;
  onAdClick?: () => void;
  adBlockEnabled?: boolean;
}

interface MockAd {
  sponsor: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  bgColor: string;
  textColor: string;
}

const MOCK_ADS: MockAd[] = [
  {
    sponsor: 'Neon.tech',
    title: 'Serverless Postgres for Developers',
    description: 'Instantly provision databases with autoscaling, branching, and a generous free tier.',
    cta: 'Start Free',
    url: 'https://neon.tech',
    bgColor: 'bg-[#00e599]/10 border-[#00e599]/30 text-white',
    textColor: 'text-gray-900',
  },
  {
    sponsor: 'Vercel',
    title: 'Deploy Your React Apps Instantly',
    description: 'The frontend platform for developers. Push to git and deploy in seconds.',
    cta: 'Deploy Now',
    url: 'https://vercel.com',
    bgColor: 'bg-black/5 border-black/10',
    textColor: 'text-gray-900',
  },
  {
    sponsor: 'Shopify',
    title: 'Start Your E-commerce Journey Today',
    description: 'Build your online store with Shopify. Safe, scalable, and easy to set up.',
    cta: 'Start Trial',
    url: 'https://shopify.com',
    bgColor: 'bg-[#95bf47]/10 border-[#95bf47]/30',
    textColor: 'text-gray-900',
  },
  {
    sponsor: 'Notion',
    title: 'Your Connected Workspace',
    description: 'Write, plan, and organize in one place. Perfect for individuals and teams.',
    cta: 'Get Notion Free',
    url: 'https://notion.so',
    bgColor: 'bg-amber-50 border-amber-200',
    textColor: 'text-gray-900',
  },
  {
    sponsor: 'Figma',
    title: 'Design and Build Together',
    description: 'The leading collaborative design tool. From brainstorming to production assets.',
    cta: 'Try Figma',
    url: 'https://figma.com',
    bgColor: 'bg-rose-50 border-rose-200',
    textColor: 'text-gray-900',
  }
];

export default function AdPlacement({ id, size, className = '', onAdClick, adBlockEnabled = false }: AdPlacementProps) {
  const [ad, setAd] = useState<MockAd | null>(null);

  useEffect(() => {
    // Select an ad randomly based on id or static index so it remains consistent
    const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % MOCK_ADS.length;
    setAd(MOCK_ADS[index]);
  }, [id]);

  if (adBlockEnabled) {
    return (
      <div 
        id={`ad-placeholder-${id}`}
        className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg p-4 text-center ${
          size === 'leaderboard' ? 'h-[90px] w-full max-w-[728px] mx-auto text-xs' :
          size === 'mobile-banner' ? 'h-[50px] w-full text-xs' :
          size === 'sidebar' ? 'w-[300px] h-[600px] text-xs' :
          size === 'medium-rectangle' ? 'w-[300px] h-[250px] mx-auto text-xs' :
          'w-full py-4 text-xs'
        } ${className}`}
      >
        <ShieldAlert className="w-5 h-5 text-gray-400 mb-1" />
        <span className="font-mono text-gray-400 font-medium">Ad Blocked</span>
        <span className="text-[10px] text-gray-400 max-w-[200px]">AdSense placement hidden by AdBlocker</span>
      </div>
    );
  }

  if (!ad) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAdClick) {
      onAdClick();
    }
    // Open in new tab
    window.open(ad.url, '_blank', 'noopener,noreferrer');
  };

  // Render different designs based on standard Google AdSense sizes
  if (size === 'leaderboard') {
    return (
      <div 
        id={`ad-${id}`}
        className={`w-full max-w-[728px] h-[90px] mx-auto bg-white border border-gray-100 shadow-xs rounded-lg overflow-hidden flex items-center justify-between p-3 relative hover:border-gray-300 transition-colors ${className}`}
      >
        <span className="absolute top-1 left-1.5 text-[8px] font-mono tracking-wider text-gray-400 font-bold uppercase pointer-events-none">
          Sponsored
        </span>
        <div className="flex items-center space-x-4 pl-12 pr-4 overflow-hidden">
          <div className="flex-shrink-0 bg-gray-50 border border-gray-100 p-1.5 rounded text-xs font-bold text-gray-700 font-mono">
            {ad.sponsor.substring(0, 3).toUpperCase()}
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="font-sans font-semibold text-sm text-gray-900 truncate">{ad.title}</h4>
            <p className="text-xs text-gray-500 truncate max-w-[450px]">{ad.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 pr-2">
          <a
            href={ad.url}
            onClick={handleClick}
            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-semibold tracking-wide transition-colors whitespace-nowrap flex items-center gap-1"
          >
            {ad.cta}
            <ExternalLink className="w-3 h-3" />
          </a>
          <button 
            type="button"
            title="Google AdChoice Compliance"
            className="text-gray-300 hover:text-gray-400"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (size === 'mobile-banner') {
    return (
      <div 
        id={`ad-${id}`}
        className={`w-full max-w-[320px] h-[50px] mx-auto bg-white border border-gray-100 shadow-xs rounded overflow-hidden flex items-center justify-between p-2 relative hover:border-gray-200 transition-colors ${className}`}
      >
        <span className="absolute top-0.5 left-1 text-[7px] font-mono text-gray-400 font-bold uppercase">
          Ad
        </span>
        <div className="pl-4 text-left overflow-hidden flex-1 mr-2">
          <h4 className="font-sans font-bold text-[11px] text-gray-900 truncate leading-tight">{ad.title}</h4>
          <p className="text-[9px] text-gray-500 truncate leading-tight">{ad.sponsor} • {ad.description}</p>
        </div>
        <a
          href={ad.url}
          onClick={handleClick}
          className="px-2 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-[10px] font-bold transition-colors whitespace-nowrap"
        >
          {ad.cta}
        </a>
      </div>
    );
  }

  if (size === 'sidebar') {
    return (
      <div 
        id={`ad-${id}`}
        className={`w-[300px] h-[600px] bg-white border border-gray-100 shadow-xs rounded-lg overflow-hidden flex flex-col justify-between p-5 relative hover:border-gray-300 transition-all ${className}`}
      >
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[8px] font-mono tracking-wider text-gray-400 font-bold uppercase">
              Advertisement
            </span>
            <button 
              type="button"
              title="AdInfo"
              className="text-gray-300 hover:text-gray-400"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="text-center my-6">
            <div className="w-16 h-16 mx-auto bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-black text-gray-800 font-mono mb-4 shadow-xs">
              {ad.sponsor.substring(0, 1).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ad.sponsor}</span>
          </div>

          <div className="text-center space-y-3">
            <h4 className="font-sans font-bold text-lg text-gray-900 leading-snug">{ad.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed px-1">{ad.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100/50 text-center text-xs text-gray-400 font-mono">
            CPC Sponsor Campaign
          </div>
          <a
            href={ad.url}
            onClick={handleClick}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {ad.cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (size === 'medium-rectangle') {
    return (
      <div 
        id={`ad-${id}`}
        className={`w-[300px] h-[250px] bg-white border border-gray-100 shadow-xs rounded-lg overflow-hidden flex flex-col justify-between p-4 relative hover:border-gray-300 transition-colors ${className}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-mono tracking-wider text-gray-400 font-bold uppercase">
            Sponsored Ad
          </span>
          <button 
            type="button"
            title="AdInfo"
            className="text-gray-300 hover:text-gray-400"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center my-2 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{ad.sponsor}</span>
          <h4 className="font-sans font-bold text-base text-gray-900 leading-tight">{ad.title}</h4>
          <p className="text-xs text-gray-500 leading-tight line-clamp-3 px-2">{ad.description}</p>
        </div>

        <a
          href={ad.url}
          onClick={handleClick}
          className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5"
        >
          {ad.cta}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Footer / default standard wide text ad
  return (
    <div 
      id={`ad-${id}`}
      className={`w-full bg-gray-50 border-t border-b border-gray-100 py-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs relative ${className}`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-[8px] font-mono tracking-wider text-gray-400 font-bold uppercase border border-gray-200 px-1 rounded">
          Ad
        </span>
        <p className="text-gray-600">
          <strong className="text-gray-900 font-semibold">{ad.sponsor}</strong>: {ad.title} — {ad.description}
        </p>
      </div>
      <a
        href={ad.url}
        onClick={handleClick}
        className="text-gray-950 font-bold hover:underline inline-flex items-center gap-1"
      >
        {ad.cta}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
