export type ToolId = 'text-gen' | 'image-gen' | 'paraphraser' | 'summarizer' | 'chatbot';

export type Category = 'all' | 'text' | 'image' | 'utility';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: Category;
  icon: string; // lucide icon name
  popularity: 'High' | 'Medium' | 'New';
  searchVolume: string; // e.g., "120K/mo"
  slug: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface User {
  email: string;
  isLoggedIn: boolean;
  dailyLimit: number;
  usedToday: number;
}

export interface HistoryItem {
  id: string;
  toolId: ToolId;
  input: string;
  output: string;
  timestamp: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  sponsor: string;
  size: 'leaderboard' | 'medium-rectangle' | 'half-page' | 'mobile-banner';
}
