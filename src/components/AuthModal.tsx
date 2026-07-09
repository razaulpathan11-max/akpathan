import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate server response
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(email);
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        onClose();
      }, 1500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-500 mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isSignUp ? 'Account Created!' : 'Welcome Back!'}
              </h3>
              <p className="text-sm text-gray-500">
                {isSignUp 
                  ? 'Your daily AI limit has been increased to 25 generations.' 
                  : 'You have successfully logged in. Limits updated.'}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 mb-1">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isSignUp ? 'Unlock Higher Limits' : 'Sign In to Your Account'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isSignUp 
                    ? 'Get 25 daily generations (up from 5) entirely for free.' 
                    : 'Access your account to continue generating with higher limits.'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600" htmlFor="auth-email">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600" htmlFor="auth-password">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    isSignUp ? 'Sign Up for Free Limit Boost' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Toggle Link */}
              <div className="text-center text-xs text-gray-500">
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      onClick={() => { setIsSignUp(false); setError(''); }}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      onClick={() => { setIsSignUp(true); setError(''); }}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Sign Up (Boost Limit)
                    </button>
                  </span>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
