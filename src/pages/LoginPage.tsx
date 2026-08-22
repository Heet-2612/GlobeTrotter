import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Mail, Lock, User as UserIcon, ArrowRight, 
  Sparkles, CheckCircle2, Shield, Eye, EyeOff, Check, X, Languages
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
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [languagePreference, setLanguagePreference] = useState('en');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupVerified, setSignupVerified] = useState(false);

  // Form input IDs for accessibility
  const nameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();
  const languageInputId = useId();

  // Verification checks for password
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUpperCase && hasNumberOrSymbol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please enter a valid full name (minimum 2 characters)');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }
      if (!isPasswordValid) {
        setError('Password does not meet the security requirements (8+ characters, uppercase letter, and number/symbol)');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setError('Please accept the Terms of Service to create your account');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(name, email, password, languagePreference);
        setSignupVerified(true);
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        await login(email, password);
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      if (!isSignup) {
        setLoading(false);
      }
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPassword: string = 'Password123!') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      onSuccess();
    } catch (e: any) {
      setError(e?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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
            <span>Empowering Multi-City Exploration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-['Outfit']">
            Design, Budget & Share Your Dream <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Multi-City Trips</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Construct day-wise itineraries, explore global destinations with live cost indices, forecast travel budgets automatically, and share itineraries with friends.
          </p>

          {/* Feature Badges */}
          <div className="space-y-3 pt-2">
            {[
              { title: 'Interactive Multi-Stop Itineraries', desc: 'Seamlessly order and schedule city legs with custom activities.' },
              { title: 'Automated Budget Forecasting', desc: 'Category-level expense breakdowns and daily over-budget alerts.' },
              { title: '1-Click Public Sharing & Cloning', desc: 'Share your plans via unique UUID links or clone community trips.' },
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

          {/* Quick Demo Logins for Instant Testing */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-sm space-y-2.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quick Demo Accounts (1-Click Login):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                id="quick-demo-jane"
                type="button"
                onClick={() => handleQuickDemo('jane@example.com')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Jane Doe (Traveler)</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                id="quick-demo-admin"
                type="button"
                onClick={() => handleQuickDemo('admin@globetrotter.io')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Alex Rivera</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                id="quick-demo-usera"
                type="button"
                onClick={() => handleQuickDemo('usera.share@example.com')}
                className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>User A (Goa Trip Owner)</span>
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
                id="auth-tab-signin"
                type="button"
                onClick={() => { setIsSignup(false); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  !isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                id="auth-tab-signup"
                type="button"
                onClick={() => { 
                  setIsSignup(true); 
                  setError(null);
                  if (email === 'jane@example.com') setEmail('');
                  if (password === 'password123') setPassword('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                {isSignup ? 'Begin Your Odyssey' : 'Welcome Back, Traveler'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSignup ? 'Create your verified traveler profile with secure stateless JWT credentials.' : 'Sign in to access your planned routes, calendars, and budgets.'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2"
              >
                <X className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {signupVerified ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Registration Verified & Account Created!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your profile and stateless JWT session token have been initialized. Redirecting to your dashboard...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={nameInputId}
                        type="text"
                        placeholder="e.g. Alex Traveler"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                        required={isSignup}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor={emailInputId} className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id={emailInputId}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={passwordInputId} className="block text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id={passwordInputId}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isSignup && (
                  <>
                    <div>
                      <label htmlFor={confirmPasswordInputId} className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id={confirmPasswordInputId}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                          required={isSignup}
                        />
                      </div>
                    </div>

                    {/* Language Preference */}
                    <div>
                      <label htmlFor={languageInputId} className="block text-xs font-bold text-slate-700 mb-1">
                        Language Preference
                      </label>
                      <div className="relative">
                        <Languages className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          id={languageInputId}
                          value={languagePreference}
                          onChange={(e) => setLanguagePreference(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50/50"
                        >
                          <option value="en">English (Default)</option>
                          <option value="fr">Français (French)</option>
                          <option value="es">Español (Spanish)</option>
                          <option value="de">Deutsch (German)</option>
                          <option value="ja">日本語 (Japanese)</option>
                          <option value="hi">हिन्दी (Hindi)</option>
                        </select>
                      </div>
                    </div>

                    {/* Real-time Password Security Verification Checklist */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                      <span className="font-semibold text-slate-700 block mb-1">Password Requirements:</span>
                      
                      <div className="flex items-center space-x-2">
                        {hasMinLength ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                        <span className={hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          At least 8 characters
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasUpperCase ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                        <span className={hasUpperCase ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          At least 1 uppercase letter (A-Z)
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasNumberOrSymbol ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                        <span className={hasNumberOrSymbol ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          At least 1 number or special symbol
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isPasswordMatch ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                        <span className={isPasswordMatch ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          Passwords match
                        </span>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-2 pt-1">
                      <input
                        id="terms-checkbox"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="terms-checkbox" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                        I agree to GlobeTrotter's travel planning Terms of Service & Privacy Policy.
                      </label>
                    </div>
                  </>
                )}

                <button
                  id="auth-submit-button"
                  type="submit"
                  disabled={loading || (isSignup && (!isPasswordValid || !isPasswordMatch || !agreeTerms))}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>{isSignup ? 'Complete Registration & Verify' : 'Sign In to GlobeTrotter'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

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

