import { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import AdPlacement from './AdPlacement';

interface ToolTextGenProps {
  onUsage: () => boolean; // Returns true if permitted, false if rate limited
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

const TONES = [
  { value: 'Professional', label: '💼 Professional' },
  { value: 'Friendly', label: '😊 Friendly / Warm' },
  { value: 'Creative', label: '🎨 Creative' },
  { value: 'Academic', label: '🎓 Scholarly' },
  { value: 'Exciting', label: '🔥 High-Energy' },
  { value: 'Casual', label: '☕ Casual' }
];

const FORMATS = [
  { value: 'blog-post', label: '✍️ Full Blog Article' },
  { value: 'email', label: '✉️ Professional Email' },
  { value: 'caption', label: '📱 Social Media Caption' },
  { value: 'story', label: '📖 Creative Short Story' },
  { value: 'bullet-points', label: '📋 Outline / Bullet Points' }
];

const PROMPT_HELPERS = [
  'A product description for a local honey brand',
  'A friendly email explaining a project delay to a client',
  'An engaging Instagram caption about starting a remote business',
  'A sci-fi short story about an AI running an organic coffee shop'
];

export default function ToolTextGen({ onUsage, adBlockEnabled, onAdClick }: ToolTextGenProps) {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [format, setFormat] = useState('blog-post');
  const [wordCount, setWordCount] = useState(250);
  
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or prompt to start generating.');
      return;
    }

    setError('');
    
    // Check usage limits first
    const allowed = onUsage();
    if (!allowed) return;

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/tools/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone, format, length: wordCount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error generating text');
      }

      setOutput(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tool Introduction Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-800" />
            AI Text Generator
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl leading-normal">
            Generate customized articles, captions, letters, and creative content with our high-performance language engine. Select your preferred tone and format, and watch the AI write in real-time.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-100">
            High Demand
          </span>
        </div>
      </div>

      {/* Grid: Inputs and Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="text-prompt">What should the AI write about?</label>
            <textarea
              id="text-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A step-by-step guide on how to propagate houseplants for beginners..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
            />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              One-Click Prompt Helpers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_HELPERS.map((helper) => (
                <button
                  key={helper}
                  type="button"
                  onClick={() => setPrompt(helper)}
                  className="text-[10px] text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-2 py-1 text-left transition-colors font-medium truncate max-w-full"
                >
                  {helper}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="text-tone">Select Tone / Vibe</label>
            <select
              id="text-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all font-sans"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Format Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="text-format">Output Format</label>
            <select
              id="text-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Word Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-gray-700">Approximate Word Length</span>
              <span className="text-gray-900 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{wordCount} words</span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="50"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting Copy...
              </>
            ) : (
              <>
                Generate Text
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Side: Ad + Output Section (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ⚠️ PRD Core requirement: Ad placed between input form and results */}
          <AdPlacement 
            id="textgen-incontent" 
            size="medium-rectangle" 
            adBlockEnabled={adBlockEnabled}
            onAdClick={onAdClick}
          />

          {/* Result Box */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">
                  Generated Output
                </span>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-950 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </>
                    )}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  <p className="text-xs text-gray-500 font-mono">Generative neural network processing prompt...</p>
                </div>
              ) : output ? (
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-serif whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 space-y-2">
                  <FileText className="w-12 h-12 stroke-1 text-gray-200" />
                  <h3 className="font-sans font-bold text-gray-500">No output generated yet</h3>
                  <p className="text-xs max-w-xs leading-normal">
                    Describe your project or topic, select parameters, and click "Generate Text" to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-4 border-t border-gray-100/50 flex justify-between items-center text-[10px] text-gray-400">
              <span>Model: Gemini 3.5 Flash</span>
              <span>Always verify key historical/numerical data.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
