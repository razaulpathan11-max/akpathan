import { ShieldCheck, HelpCircle, FileText, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: string) => void;
  adBlockEnabled: boolean;
  onToggleAdBlock: () => void;
}

export default function Footer({ onNavigate, adBlockEnabled, onToggleAdBlock }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-gray-900 text-white p-1.5 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="font-sans font-black tracking-tight text-base text-gray-900">Aether<span className="text-gray-500 font-normal">AI</span></span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Completely free, high-speed, no-signup-required artificial intelligence tools. Funded sustainably through non-obtrusive display advertisements.
            </p>
            {/* AdBlock Simulation Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase">
                AdBlock Simulation
              </span>
              <button
                onClick={onToggleAdBlock}
                className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Toggle simulated ad blocker to test the layout adaptability"
              >
                {adBlockEnabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
              <span className="text-[10px] font-mono text-gray-500">
                {adBlockEnabled ? 'Enabled (Showing Placeholders)' : 'Disabled (Showing Ads)'}
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">AI Tools</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    { name: 'AI Text Generator', view: 'tool-text-gen' },
                    { name: 'AI Image Generator', view: 'tool-image-gen' },
                    { name: 'AI Paraphraser', view: 'tool-paraphraser' },
                    { name: 'AI Summarizer', view: 'tool-summarizer' },
                    { name: 'AI Chatbot', view: 'tool-chatbot' },
                  ].map((item) => (
                    <li key={item.view}>
                      <button
                        onClick={() => onNavigate(item.view)}
                        className="text-xs text-gray-500 hover:text-gray-900 text-left transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Resources</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    { name: 'Blog & Articles', view: 'blog' },
                    { name: 'About Our Mission', view: 'about' },
                    { name: 'Contact Form', view: 'contact' },
                  ].map((item) => (
                    <li key={item.view}>
                      <button
                        onClick={() => onNavigate(item.view)}
                        className="text-xs text-gray-500 hover:text-gray-900 text-left transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Compliance & Ads</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => onNavigate('privacy')}
                      className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      GDPR Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms')}
                      className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 text-left"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Terms of Service
                    </button>
                  </li>
                  <li className="pt-2">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 max-w-xs">
                      <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase mb-1">Google AdSense Disclosure</span>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        This site is fully compliant with Google AdSense program policies. Advertisements never overlap core interactions.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} AetherAI, Inc. All rights reserved. Built for global free AI democratization.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <span>Server Location: Global CDN</span>
            <span>•</span>
            <span>API Status: Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
