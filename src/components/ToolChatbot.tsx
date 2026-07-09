import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, RefreshCw, User, BrainCircuit } from 'lucide-react';
import AdPlacement from './AdPlacement';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ToolChatbotProps {
  onUsage: () => boolean;
  adBlockEnabled: boolean;
  onAdClick: () => void;
}

const QUICK_CHIPS = [
  'Explain quantum physics in simple terms',
  'Help me brainstorm 5 catchy domain names for an AI tool site',
  'Draft a polite request for a salary increase',
  'Tell me a witty joke about software compilers'
];

export default function ToolChatbot({ onUsage, adBlockEnabled, onAdClick }: ToolChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your free general-purpose AI assistant. Ask me anything, brainstorm ideas, draft outlines, or practice coding. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    setError('');
    
    // Check limit first
    const allowed = onUsage();
    if (!allowed) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Reconstruct the message history for the model
      const history = messages.concat(userMessage);

      const response = await fetch('/api/tools/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error communicating with chatbot');
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.result }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      { role: 'model', text: 'Hello! I am your free general-purpose AI assistant. Ask me anything, brainstorm ideas, draft outlines, or practice coding. How can I help you today?' }
    ]);
    setError('');
  };

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-800" />
            AI Chatbot Q&A
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl leading-normal">
            A general-purpose Q&A chat assistant. Ask questions, brainstorm copy, write snippets, or proofread messages instantly.
          </p>
        </div>
        <div>
          <button
            onClick={handleClear}
            className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Conversation
          </button>
        </div>
      </div>

      {/* Main Column */}
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[550px]">
        {/* Chat window stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 max-w-[85%] ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`p-2 rounded-xl flex items-center justify-center border text-xs font-bold ${
                m.role === 'user' 
                  ? 'bg-gray-950 text-white border-gray-900' 
                  : 'bg-gray-50 text-gray-800 border-gray-100'
              }`}>
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <BrainCircuit className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
              </div>

              {/* Bubble */}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-xs ${
                m.role === 'user'
                  ? 'bg-gray-900 text-white rounded-tr-none'
                  : 'bg-gray-50 border border-gray-100/70 text-gray-800 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t border-gray-50 space-y-2 bg-gray-50/50">
            <span className="text-[9px] font-mono tracking-wider text-gray-400 font-bold uppercase block">
              💡 Need inspiration? Click to ask
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="text-[10px] text-gray-600 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-left transition-colors font-medium truncate max-w-full"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inline Ad Placement - complies with AdSense policy */}
        <AdPlacement 
          id="chatbot-inline" 
          size="mobile-banner" 
          className="my-1 border-t border-b border-gray-50 py-1"
          adBlockEnabled={adBlockEnabled}
          onAdClick={onAdClick}
        />

        {error && (
          <div className="px-6 py-2 bg-red-50 text-xs text-red-600 border-t border-red-100">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message or prompt here..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-xl transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
