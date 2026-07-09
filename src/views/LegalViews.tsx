import React, { useState } from 'react';
import { ShieldCheck, FileText, Send, HelpCircle, Loader2, CheckCircle2, Award, Sparkles, UserCheck } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

interface LegalViewProps {
  viewMode: 'about' | 'privacy' | 'terms' | 'contact';
  onNavigate: (view: string, params?: string) => void;
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

export default function LegalViews({ viewMode, onNavigate, adBlockEnabled, onAdClick }: LegalViewProps) {
  // Contact Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  if (viewMode === 'about') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <section className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="font-sans font-black tracking-tight text-3xl text-gray-900">About AetherAI</h1>
          <p className="text-xs text-gray-500 leading-normal">
            Our mission is simple: to democratize advanced language and graphics AI systems for everyone on the planet, completely free of charge.
          </p>
        </section>

        {/* Narrative layout */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 leading-relaxed text-sm text-gray-600">
          <h2 className="text-lg font-black text-gray-950 font-sans border-b border-gray-50 pb-3">
            Why We Started
          </h2>
          <p>
            In the early days of generative artificial intelligence, platforms were simple, open, and free to explore. Over time, however, a wave of paywalls swept the internet. Tools that once sparked student curiosity and assisted content creators started asking for costly monthly commitments.
          </p>
          <p>
            We created **AetherAI** to counter subscription fatigue. By leveraging standard programmatic display advertising (Google AdSense), we generate enough passive revenue from ad views and clicks to cover our server and Google Gemini API computational expenses.
          </p>

          <h2 className="text-lg font-black text-gray-950 font-sans border-b border-gray-50 pb-3 pt-4">
            Our Sustainable Framework
          </h2>
          <p>
            Many ad-supported utility websites ruin the user experience by spamming popups and locking content behind aggressive layouts. AetherAI enforces a strict **AdSense Policy Compliance** standard:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li><strong>Clear boundaries:</strong> Display ad blocks are nested within standard page gutters and inline corridors, and they are always explicitly marked as "Sponsored" or "Advertisement."</li>
            <li><strong>No overlay traps:</strong> Ads are non-intrusive and never overlap with text fields, action buttons, or output result windows.</li>
            <li><strong>Fair rate limiting:</strong> We offer a generous daily allocation of 5 generations for anonymous visitors, which can be easily expanded to 25 daily runs by registering a free email profile. This keeps the backend cost predictable and prevents bot abuse.</li>
          </ul>

          <h2 className="text-lg font-black text-gray-950 font-sans border-b border-gray-50 pb-3 pt-4">
            Technological Stack
          </h2>
          <p>
            AetherAI runs entirely on a modern full-stack runtime, powered by **Express.js**, **React**, **Vite**, and **Tailwind CSS**. AI text generation features (writing, paraphrasing, summaries) are powered by the state-of-the-art **Gemini 3.5 Flash** model on our secure servers, ensuring high speed and perfect output quality.
          </p>
        </div>

        {/* Mid banner */}
        <AdPlacement 
          id="about-bottom-banner" 
          size="leaderboard" 
          adBlockEnabled={adBlockEnabled}
          onAdClick={onAdClick}
        />
      </div>
    );
  }

  if (viewMode === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <section className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="font-sans font-black tracking-tight text-3xl text-gray-900">GDPR Privacy Policy</h1>
          <p className="text-xs text-gray-500 leading-normal">
            Last Updated: July 9, 2026. This page details our strict cookie notice, compliance protocols, and Google AdSense program policy disclosures.
          </p>
        </section>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 leading-relaxed text-sm text-gray-600">
          <h2 className="text-base font-black text-gray-950 font-sans">
            1. Data We Collect
          </h2>
          <p>
            We believe in high-privacy utility software. We do not require account registration to use AetherAI. 
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Usage Limits:</strong> To enforce daily generation limits, we use standard client-side `localStorage` keys and log transient, anonymized IP addresses on our secure servers.</li>
            <li><strong>Email Profiles:</strong> If you voluntarily register a free account to boost your daily limits to 25, we securely store your email address and password hash in our database. We never share or sell this information.</li>
          </ul>

          <h2 className="text-base font-black text-gray-950 font-sans">
            2. Google AdSense Cookie Disclosures
          </h2>
          <p>
            This website utilizes Google AdSense and third-party advertising networks to serve relevant visual banners.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>Google, as a third-party vendor, uses cookies to serve ads on this site.</li>
            <li>Google's use of the **Double-Click DART cookie** enables it and its partners to serve ads to users based on their visits to our platform and other websites on the Internet.</li>
            <li>Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy page.</li>
          </ul>

          <h2 className="text-base font-black text-gray-950 font-sans">
            3. GDPR & CCPA Compliance
          </h2>
          <p>
            For citizens residing within the European Economic Area (EEA) and California: we serve personalized ads only with your explicit cookie consent. If consent is withheld, Google AdSense is instructed to serve non-personalized contextual ads instead. No behavioral profiles are saved without consent.
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'terms') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <section className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <h1 className="font-sans font-black tracking-tight text-3xl text-gray-900">Terms of Service</h1>
          <p className="text-xs text-gray-500 leading-normal">
            Last Updated: July 9, 2026. General terms governing access to AetherAI.
          </p>
        </section>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 leading-relaxed text-sm text-gray-600">
          <h2 className="text-base font-black text-gray-950 font-sans">
            1. Agreement of Use
          </h2>
          <p>
            By accessing AetherAI, you agree to comply with all applicable local and international laws. These tools are provided "as-is" for personal and commercial content writing, design prototyping, and general Q&A support.
          </p>

          <h2 className="text-base font-black text-gray-950 font-sans">
            2. Prohibited Content
          </h2>
          <p>
            You are strictly forbidden from utilizing our language or image generators to create:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Harassing, threatening, or explicit adult content.</li>
            <li>Misinformation, deceptive political campaigns, or fraudulent letters.</li>
            <li>Automated scraping bots designed to bypass our daily limits or abuse our APIs.</li>
          </ul>

          <h2 className="text-base font-black text-gray-950 font-sans">
            3. Disclaimer of Accuracy
          </h2>
          <p>
            Generative AI models are subject to occasional "hallucinations." AetherAI cannot guarantee the factual accuracy, historical validity, or mathematical correctness of generated text outputs. Users must proofread and verify all critical professional materials.
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, render Contact Form
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <section className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex p-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800">
          <Send className="w-5 h-5 text-gray-600" />
        </div>
        <h1 className="font-sans font-black tracking-tight text-3xl text-gray-900">Contact & Support</h1>
        <p className="text-xs text-gray-500 leading-normal">
          Have feedback, found a bug, or interested in a direct ad sponsorship? Fill out our form and our team will get back to you within 24 hours.
        </p>
      </section>

      {/* Grid: Contact form on left, ad/info on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {isSubmitted && (
            <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Message Delivered!</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-normal">
                Your message has been safely logged. Thank you for helping us improve our free AI tools directory.
              </p>
            </div>
          )}

          <h2 className="text-base font-black text-gray-950 font-sans">
            Send Us a Message
          </h2>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600" htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600" htmlFor="contact-subject">Topic / Enquiry</label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
              >
                <option value="Feedback">💡 General Feedback / Suggestions</option>
                <option value="Bug Report">🐛 Technical Issue / Bug Report</option>
                <option value="Sponsorship">💎 Direct Advertising & Sponsorships</option>
                <option value="Limits">🔑 Help with User Limits / Accounts</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600" htmlFor="contact-message">Detailed Message</label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback or sponsorship proposal here..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !message}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending secure payload...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AdPlacement 
            id="contact-sidebar" 
            size="medium-rectangle" 
            adBlockEnabled={adBlockEnabled}
            onAdClick={onAdClick}
          />

          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">
              Direct Partnerships
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We offer direct sponsorship placements for high-performance SaaS platforms, hosting providers, or database systems. Standard packages include custom top leaderboards, embedded sidebar blocks, or featured "tool spotlights."
            </p>
            <div className="text-[10px] font-mono text-gray-400">
              Avg Monthly Traffic: ~120K Pageviews <br />
              Primary Audience: Developers, Marketers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
