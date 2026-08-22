import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Mail, Lock, User as UserIcon, ArrowRight, 
  Sparkles, CheckCircle2, Shield, Compass, MapPin 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('jane@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Value Prop Hero */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Empowering Personalized Travel</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-['Outfit']">
            Design, Budget & Share Your Dream <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Multi-City Trips</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Construct structured day-wise itineraries, explore global destinations with live cost indices, forecast trip budgets automatically, and share itineraries with friends.
          </p>

          {/* Feature Badges */}
          <div className="space-y-3 pt-2">
            {[
              { title: 'Interactive Multi-Stop Itineraries', desc: 'Seamlessly order and schedule city legs with custom activities.' },
              { title: 'Automated Budget Forecasting', desc: 'Category-level expense breakdowns and daily over-budget alerts.' },
              { title: '1-Click Public Sharing & Cloning', desc: 'Share your plans or clone community trips in seconds.' },
            ].map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{feat.title}</p>
                  <p className="text-xs text-slate-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Demo Logins for Judges */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-sm space-y-2.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quick Demo Accounts (1-Click Login):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('jane@example.com', 'Jane Doe')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition active:scale-95 flex items-center space-x-1.5"
              >
                <span>Jane Doe (Traveler)</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@globetrotter.io', 'Alex Rivera')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition active:scale-95 flex items-center space-x-1.5"
              >
                <span>Alex Rivera (Admin)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            
            {/* Header Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setIsSignup(false); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  !isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignup(true); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                {isSignup ? 'Begin Your Odyssey' : 'Welcome Back, Traveler'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSignup ? 'Create your traveler profile to start crafting multi-city itineraries.' : 'Sign in to access your planned routes, calendars, and budgets.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                      required={isSignup}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isSignup ? 'Complete Registration' : 'Sign In to GlobeTrotter'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Note on stateless JWT */}
            <div className="mt-5 text-center text-[11px] text-slate-400">
              Stateless JWT Token Authentication • Relational Database Domain Ready
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
