import { useState } from 'react';
import { Download, Sparkles, Loader2, Image, Maximize, Palette, ArrowRight } from 'lucide-react';
import AdPlacement from './AdPlacement';

interface ToolImageGenProps {
  onUsage: () => boolean; // Returns true if permitted, false if rate limited
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

const ASPECTS = [
  { value: '1:1', label: '1:1 Square', description: 'Avatars & Instagram posts' },
  { value: '16:9', label: '16:9 Cinematic', description: 'Banners, desktop wallpaper' },
  { value: '9:16', label: '9:16 Portrait', description: 'Mobile wallpaper & stories' },
  { value: '4:3', label: '4:3 Classic', description: 'Standard card illustrations' }
];

const STYLES = [
  { value: 'photorealistic', label: '📷 Photorealistic', promptAdd: 'photorealistic, highly detailed, shot on 35mm lens, natural lighting' },
  { value: 'cinematic', label: '🎬 Cinematic Drama', promptAdd: 'cinematic, dramatic key lighting, atmospheric blue backlight, octane render style' },
  { value: 'synthwave', label: '🌌 Neon Synthwave', promptAdd: 'cyberpunk synthwave aesthetic, glowing neon pink and cyan lights, wireframe mountains, retro grid landscape' },
  { value: 'watercolor', label: '🎨 Soft Watercolor', promptAdd: 'soft vintage watercolor painting, bleed edge style, wet-on-wet technique, textured cold press paper' },
  { value: 'anime', label: '🌸 Stylized Anime', promptAdd: 'vibrant anime aesthetic, high-contrast cel shading, beautiful detailed sky, Makoto Shinkai style' },
  { value: 'pixel', label: '👾 Retro Pixel Art', promptAdd: 'retro 16-bit pixel art, vibrant color palette, precise pixel placement, cute game asset look' }
];

const HELPER_PROMPTS = [
  'A mystical ancient temple hidden deep inside a glowing mossy cave',
  'A cute futuristic helper robot carrying a wooden box of fresh organic apples',
  'An atmospheric coffee shop in Seattle at midnight with rain on the window pane'
];

export default function ToolImageGen({ onUsage, adBlockEnabled, onAdClick }: ToolImageGenProps) {
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [styleValue, setStyleValue] = useState('photorealistic');

  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }

    setError('');
    
    const allowed = onUsage();
    if (!allowed) return;

    setLoading(true);
    setImageSrc('');

    try {
      // Find style prompt additions
      const selectedStyle = STYLES.find(s => s.value === styleValue);
      const stylePromptAdd = selectedStyle ? `, ${selectedStyle.promptAdd}` : '';
      const fullPrompt = `${prompt}${stylePromptAdd}`;

      const response = await fetch('/api/tools/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, aspectRatio: aspect })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error generating image');
      }

      setImageSrc(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `aetherai_${styleValue}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-gray-800" />
            AI Image Generator
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl leading-normal">
            Generate stunning high-resolution graphics and illustrations in seconds. Describe your vision, pick an artistic style and layout aspect ratio, and watch the image materialize.
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
        {/* Left column: controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="image-prompt">Describe your image prompt</label>
            <textarea
              id="image-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A serene golden laboratory full of flasks, plants growing inside test tubes, warm sunlight, isometric..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
            />
          </div>

          {/* Quick Ideas */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Inspiration Sparks
            </span>
            <div className="flex flex-col gap-1.5">
              {HELPER_PROMPTS.map((helper) => (
                <button
                  key={helper}
                  type="button"
                  onClick={() => setPrompt(helper)}
                  className="text-[10px] text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg p-2 text-left transition-colors font-medium truncate max-w-full"
                >
                  {helper}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <Palette className="w-4 h-4 text-gray-400" /> Choose Art Style
            </span>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyleValue(s.value)}
                  className={`px-3 py-2 text-left text-xs font-medium rounded-xl border transition-all ${
                    styleValue === s.value
                      ? 'border-gray-900 bg-gray-950 text-white shadow-xs'
                      : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <Maximize className="w-4 h-4 text-gray-400" /> Choose Aspect Ratio
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ASPECTS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAspect(a.value)}
                  className={`p-2.5 text-left rounded-xl border transition-all ${
                    aspect === a.value
                      ? 'border-gray-900 bg-gray-950 text-white shadow-xs'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-semibold block">{a.label}</span>
                  <span className={`text-[9px] block ${aspect === a.value ? 'text-gray-300' : 'text-gray-400'}`}>{a.description}</span>
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
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Painting Canvas...
              </>
            ) : (
              <>
                Paint Masterpiece
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right column: results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ad Placement between Input and Output */}
          <AdPlacement 
            id="imagegen-incontent" 
            size="medium-rectangle" 
            adBlockEnabled={adBlockEnabled}
            onAdClick={onAdClick}
          />

          {/* Render Result Screen */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between items-stretch">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">
                  Canvas View
                </span>
                {imageSrc && (
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-950 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-28 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-800 font-bold font-mono">Generative Adversarial Diffusion processing...</p>
                    <p className="text-[10px] text-gray-400 max-w-xs leading-normal">
                      Image rendering generally takes around 3-6 seconds. Thank you for your patience!
                    </p>
                  </div>
                </div>
              ) : imageSrc ? (
                <div className="flex justify-center items-center py-2 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={imageSrc}
                    alt={prompt}
                    referrerPolicy="no-referrer"
                    className="max-h-[380px] object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-28 text-center text-gray-400 space-y-3">
                  <Image className="w-16 h-16 stroke-1 text-gray-200" />
                  <h3 className="font-sans font-bold text-gray-500">No image painted yet</h3>
                  <p className="text-xs max-w-xs leading-normal">
                    Enter a creative description on the left, pick your preferences, and start generating!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100/50 flex justify-between items-center text-[10px] text-gray-400">
              <span>Model: Gemini 3.1 Flash Image</span>
              <span>All images generated in 1K high quality.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
