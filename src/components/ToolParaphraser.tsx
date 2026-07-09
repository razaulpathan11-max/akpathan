import { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, RefreshCw, FileEdit, ArrowRight } from 'lucide-react';
import AdPlacement from './AdPlacement';

interface ToolParaphraserProps {
  onUsage: () => boolean;
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

const TONES = [
  { value: 'Professional', label: '💼 Professional & Diplomatic' },
  { value: 'Friendly', label: '😊 Friendly & Conversational' },
  { value: 'Academic', label: '🎓 Academic & Formal' },
  { value: 'Exciting', label: '🔥 Exciting & Dynamic' },
  { value: 'Casual', label: '☕ Casual & Relaxed' },
  { value: 'Direct', label: '🎯 Direct & Concise' }
];

const LENGTHS = [
  { value: 'same', label: '📐 Keep Same Length' },
  { value: 'shorten', label: '✂️ Shorten / Condense' },
  { value: 'expand', label: '🔍 Expand / Elaborate' }
];

const HELP_TEXTS = [
  {
    label: 'Clumsy Email',
    text: 'hey i am late on the slides because my computer was acting super weird but they are done now i guess. let me know if they look alright.'
  },
  {
    label: 'Dry Feature List',
    text: 'Our product has a camera. It has a high resolution battery. It can save a lot of photos on it.'
  },
  {
    label: 'Informal Request',
    text: 'Can you write back to me as soon as possible? I really need to know the answer by tonight otherwise I am screwed.'
  }
];

export default function ToolParaphraser({ onUsage, adBlockEnabled, onAdClick }: ToolParaphraserProps) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [lengthMode, setLengthMode] = useState('same');

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleRewrite = async () => {
    if (!text.trim()) {
      setError('Please enter some text to paraphrase.');
      return;
    }

    if (text.length > 3000) {
      setError('Please limit your input text to 3,000 characters for optimal performance.');
      return;
    }

    setError('');
    
    const allowed = onUsage();
    if (!allowed) return;

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/tools/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, lengthMode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error rewriting text');
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
            <FileEdit className="w-5 h-5 text-gray-800" />
            AI Paraphraser / Rewriter
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl leading-normal">
            Instantly shift the tone, clarity, and impact of any sentence or paragraph. Paste your clumsy drafts, choose your desired voice style, and get pristine, professionally-formatted text.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100">
            SEO High Rank
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="paraphrase-input">Original draft to rewrite</label>
            <textarea
              id="paraphrase-input"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write your text here (up to 3,000 characters)..."
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
              {HELP_TEXTS.map((ht) => (
                <button
                  key={ht.label}
                  type="button"
                  onClick={() => setText(ht.text)}
                  className="text-[10px] text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-2.5 py-1 text-left transition-colors font-medium"
                >
                  {ht.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Tone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="paraphrase-tone">Select Tone Change</label>
            <select
              id="paraphrase-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Select Length */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="paraphrase-length">Desired Length</label>
            <select
              id="paraphrase-length"
              value={lengthMode}
              onChange={(e) => setLengthMode(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            >
              {LENGTHS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rewriting Draft...
              </>
            ) : (
              <>
                Paraphrase Text
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ad Placement */}
          <AdPlacement 
            id="paraphrase-incontent" 
            size="medium-rectangle" 
            adBlockEnabled={adBlockEnabled}
            onAdClick={onAdClick}
          />

          {/* Result Block */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[340px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">
                  Paraphrased Text
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
                  <p className="text-xs text-gray-500 font-mono">Reconstructing sentences and replacing synonyms...</p>
                </div>
              ) : output ? (
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-serif whitespace-pre-wrap text-sm">
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 space-y-2">
                  <RefreshCw className="w-12 h-12 stroke-1 text-gray-200" />
                  <h3 className="font-sans font-bold text-gray-500">Ready to rewrite</h3>
                  <p className="text-xs max-w-xs leading-normal">
                    Paste your text on the left, pick a specific tone, and hit rewrite to instantly see the updated version.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100/50 flex justify-between items-center text-[10px] text-gray-400">
              <span>Model: Gemini 3.5 Flash</span>
              <span>Guarantees 100% unique syntax.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
