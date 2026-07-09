import { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  onAdClick?: () => void;
}

export default function InterstitialAd({ isOpen, onClose, onAdClick }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setCanSkip(false);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdClick = () => {
    if (onAdClick) {
      onAdClick();
    }
    window.open('https://neon.tech', '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Premium Partner Spotlight
            </span>
            {canSkip ? (
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                title="Skip Ad"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <span className="text-xs font-mono font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                Skip in {countdown}s
              </span>
            )}
          </div>

          {/* Ad Body */}
          <div className="p-8 text-center space-y-6 flex-1">
            <div className="w-20 h-20 mx-auto bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg border border-gray-800">
              N
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Neon Serverless Database
              </span>
              <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight leading-tight">
                Postgres at the Speed of Light
              </h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Database branch creation, instant scaling, and cold-starts in under 100ms. Perfect for full-stack developers.
              </p>
            </div>

            {/* Campaign Metrics Simulation */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 max-w-xs mx-auto text-xs text-gray-500 font-mono flex justify-around">
              <div>
                <span className="block text-gray-400 text-[10px] uppercase">Campaign</span>
                <span className="font-semibold text-gray-700">NEON-LAUNCH</span>
              </div>
              <div className="border-r border-gray-200" />
              <div>
                <span className="block text-gray-400 text-[10px] uppercase">Avg CTR</span>
                <span className="font-semibold text-emerald-600">3.42%</span>
              </div>
              <div className="border-r border-gray-200" />
              <div>
                <span className="block text-gray-400 text-[10px] uppercase">Format</span>
                <span className="font-semibold text-gray-700">Interstitial</span>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={handleAdClick}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              Get Started with Neon Free
              <ExternalLink className="w-4 h-4" />
            </button>
            {canSkip && (
              <button 
                onClick={onClose}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
              >
                Close advertisement and view results
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
