import { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, FileText, ArrowRight } from 'lucide-react';
import AdPlacement from './AdPlacement';

interface ToolSummarizerProps {
  onUsage: () => boolean;
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

const MODES = [
  { value: 'bullets', label: '📋 Bullet Points List', description: 'Lists key events or elements' },
  { value: 'executive', label: '💼 Executive Summary', description: 'One concise professional paragraph' },
  { value: 'takeaways', label: '🎯 Core Takeaways', description: 'Actionable numbered insights' },
  { value: 'brief', label: '⚡ Ultra Brief / One-Liner', description: 'A single high-level headline summary' }
];

const HELP_ARTICLES = [
  {
    label: 'Photosynthesis Science',
    text: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism\'s activities. This chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. In most cases, oxygen is also released as a waste product. Most plants, algae, and cyanobacteria perform photosynthesis; such organisms are called photoautotrophs. Photosynthesis is largely responsible for producing and maintaining the oxygen content of the Earth\'s atmosphere, and supplies most of the energy necessary for life on Earth.'
  },
  {
    label: 'Quantum Computing Brief',
    text: 'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Today, IBM, Google, and other research groups are building real quantum computers. These machines are fundamentally different from the classical computers we use today. Classical computers process information using bits, which represent either a 0 or a 1. Quantum computers, however, use qubits. Qubits can represent a 0, a 1, or any proportion of both 0 and 1 simultaneously, a phenomenon called superposition. This allows quantum systems to perform massive parallel calculations, dramatically accelerating complex tasks like molecular modeling and cryptography.'
  }
];

export default function ToolSummarizer({ onUsage, adBlockEnabled, onAdClick }: ToolSummarizerProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('bullets');
  const [detail, setDetail] = useState('medium'); // short, medium, long

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setError('');
    
    const allowed = onUsage();
    if (!allowed) return;

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/tools/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, detail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error summarizing text');
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
      {/* Intro */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-800" />
            AI Summarizer
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl leading-normal">
            Condense long research articles, news stories, essays, or technical reports into concise bullet points or executive briefings instantly. Save hours of reading time.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-100">
            High Demand
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="summarize-input">Paste article or essay to summarize</label>
            <textarea
              id="summarize-input"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste long text content here..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
            />
          </div>

          {/* Quick Paste Templates */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Templates
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HELP_ARTICLES.map((art) => (
                <button
                  key={art.label}
                  type="button"
                  onClick={() => setText(art.text)}
                  className="text-[10px] text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-2.5 py-1 text-left transition-colors font-medium"
                >
                  {art.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700">Choose Summary Format</span>
            <div className="grid grid-cols-1 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    mode === m.value
                      ? 'border-gray-900 bg-gray-950 text-white shadow-xs'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-semibold block">{m.label}</span>
                  <span className={`text-[9px] block ${mode === m.value ? 'text-gray-300' : 'text-gray-400'}`}>{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing Content...
              </>
            ) : (
              <>
                Summarize Now
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ad Placement between Input and Output */}
          <AdPlacement 
            id="summarizer-incontent" 
            size="medium-rectangle" 
            adBlockEnabled={adBlockEnabled}
            onAdClick={onAdClick}
          />

          {/* Result Block */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[340px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">
                  Summary Result
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
                  <p className="text-xs text-gray-500 font-mono">Synthesizing document structure and identifying focal concepts...</p>
                </div>
              ) : output ? (
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-serif whitespace-pre-wrap text-sm">
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 space-y-2">
                  <FileText className="w-12 h-12 stroke-1 text-gray-200" />
                  <h3 className="font-sans font-bold text-gray-500">Awaiting text input</h3>
                  <p className="text-xs max-w-xs leading-normal">
                    Provide raw paragraphs or articles, choose a compression format, and start summarizing.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100/50 flex justify-between items-center text-[10px] text-gray-400">
              <span>Model: Gemini 3.5 Flash</span>
              <span>Summarized using key event grouping.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
