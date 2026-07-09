import React from 'react';
import { ArrowRight, MessageSquare, Image, FileText, Settings, HelpCircle, Flame, Star, Sparkles } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  key?: string | number;
  tool: Tool;
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  // Map icon strings to Lucide components
  const getIcon = (name: string) => {
    switch (name) {
      case 'text-gen':
        return <FileText className="w-5 h-5" />;
      case 'image-gen':
        return <Image className="w-5 h-5" />;
      case 'paraphraser':
        return <Settings className="w-5 h-5" />;
      case 'summarizer':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'chatbot':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getBadgeColor = (popularity: string) => {
    switch (popularity) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Header containing icon and status badge */}
        <div className="flex justify-between items-start">
          <div className="p-3 bg-gray-50 group-hover:bg-gray-950 group-hover:text-white rounded-xl transition-colors text-gray-800 border border-gray-100">
            {getIcon(tool.id)}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(tool.popularity)}`}>
              {tool.popularity === 'High' && <Flame className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />}
              {tool.popularity} Demand
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="font-sans font-bold text-gray-950 text-base group-hover:text-gray-900 transition-colors flex items-center gap-1.5">
            {tool.name}
          </h3>
          <p className="text-xs text-gray-500 leading-normal line-clamp-3">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer containing SEO and launch CTA */}
      <div className="mt-6 pt-4 border-t border-gray-100/60 flex justify-between items-center text-[11px] font-mono">
        <div className="text-left">
          <span className="text-gray-400 block uppercase text-[8px] tracking-widest">Search Volume</span>
          <span className="font-bold text-gray-700">{tool.searchVolume}</span>
        </div>
        <div className="text-right flex items-center gap-1 font-semibold text-gray-900 group-hover:translate-x-1 transition-transform">
          Open Tool
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
