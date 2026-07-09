import { useState } from 'react';
import { ArrowLeft, Calendar, User, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';
import AdPlacement from '../components/AdPlacement';

interface BlogViewProps {
  posts: BlogPost[];
  selectedSlug: string | null;
  onNavigate: (view: string, params?: string) => void;
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

export default function BlogView({ posts, selectedSlug, onNavigate, adBlockEnabled, onAdClick }: BlogViewProps) {
  // If a specific blog post is selected, render the reading layout
  const activePost = selectedSlug ? posts.find(p => p.slug === selectedSlug) : null;

  if (activePost) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* Back button */}
        <button
          onClick={() => onNavigate('blog')}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>

        {/* Article Meta */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-sans uppercase">
            {activePost.category}
          </span>
          <h1 className="font-sans font-black tracking-tight text-3xl sm:text-4xl text-gray-900 leading-tight">
            {activePost.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {activePost.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activePost.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activePost.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={activePost.image}
            alt={activePost.title}
            referrerPolicy="no-referrer"
            className="w-full h-[350px] object-cover"
          />
        </div>

        {/* Leaderboard ad placement inside the article layout */}
        <AdPlacement 
          id={`blog-${activePost.slug}-top`} 
          size="leaderboard" 
          adBlockEnabled={adBlockEnabled}
          onAdClick={onAdClick}
          className="my-6"
        />

        {/* Article content */}
        <article className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-serif whitespace-pre-wrap text-sm border-t border-gray-100 pt-8">
          {activePost.content}
        </article>

        {/* Footer Ad banner */}
        <AdPlacement 
          id={`blog-${activePost.slug}-bottom`} 
          size="medium-rectangle" 
          adBlockEnabled={adBlockEnabled}
          onAdClick={onAdClick}
          className="my-10"
        />
      </div>
    );
  }

  // Otherwise, render the list view of all blog articles
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      {/* Blog Directory Header */}
      <section className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex p-1 bg-gray-50 border border-gray-100 rounded-full text-gray-400">
          <BookOpen className="w-5 h-5 text-gray-600" />
        </div>
        <h1 className="font-sans font-black tracking-tight text-3xl text-gray-900">
          Organic SEO Traffic Blog
        </h1>
        <p className="text-xs text-gray-500 leading-normal">
          Learn prompt engineering, optimization tips, and content writing strategies. These highly specific articles drive substantial Google Search traffic back to our AI generators.
        </p>
      </section>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.slug}
            onClick={() => onNavigate('blog', post.slug)}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 bg-white/95 text-gray-900 rounded-full shadow-xs">
                  {post.category}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex gap-4 text-[10px] text-gray-400 font-mono">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-sans font-bold text-gray-900 group-hover:text-gray-900 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-normal">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 mt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-900">
              <span>Read Article</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop sidebar ad or middle banner */}
      <AdPlacement 
        id="blog-list-banner" 
        size="leaderboard" 
        adBlockEnabled={adBlockEnabled}
        onAdClick={onAdClick}
      />
    </div>
  );
}
