import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name?: string, role?: 'builder' | 'owner') => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegister,
}) => {
  const [email, setEmail] = useState('enbarajenba21@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes('erode') || email.toLowerCase().includes('owner')) {
        onLoginSuccess(email.trim(), 'Er. Sivakumar M.', 'owner');
      } else {
        onLoginSuccess(email.trim(), 'Sanjay Verma', 'builder');
      }
      onClose();
    }, 400);
  };

  const handleQuickLogin = (demoEmail: string, demoName: string, demoRole: 'builder' | 'owner') => {
    setEmail(demoEmail);
    setPassword('demoPass2026');
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(demoEmail, demoName, demoRole);
      onClose();
    }, 350);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8E7F3] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-[#14162B] leading-tight">
                Sign In to ProblemBridge
              </h3>
              <p className="text-xs text-[#8B8DA3]">
                Enter your credentials to access your challenges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FBE9EC] border border-[#D6455A]/30 text-[#D6455A] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#14162B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B8DA3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu or email@company.com"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#14162B]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For this prototype, any password will sign in with your selected account.')}
                  className="text-[11px] text-[#5B4FE9] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B8DA3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8DA3] hover:text-[#14162B]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 accent-[#5B4FE9] rounded"
                />
                <span className="text-xs text-[#4A4C63]">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
            </button>
          </form>

          {/* 1-Click Quick Demo Switchers */}
          <div className="pt-2">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#E8E7F3]"></div>
              <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-[#8B8DA3]">
                Or Instant One-Click Login
              </span>
              <div className="flex-grow border-t border-[#E8E7F3]"></div>
            </div>

            <div className="space-y-1.5 mt-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('enbarajenba21@gmail.com', 'Sanjay Verma', 'builder')}
                className="w-full text-left p-2.5 rounded-xl border border-[#E8E7F3] hover:border-[#5B4FE9] hover:bg-[#EFEDFC]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center font-bold text-xs shrink-0">
                    SV
                  </div>
                  <div>
                    <strong className="text-xs text-[#14162B] group-hover:text-[#5B4FE9] block leading-tight">
                      Sanjay Verma
                    </strong>
                    <span className="text-[10px] text-[#8B8DA3]">
                      Student Builder · PSG College of Technology
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#E4F6EE] text-[#1FAE7C] font-semibold px-2 py-0.5 rounded-full">
                  Builder
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sivakumar@erodetextile.org', 'Er. Sivakumar M.', 'owner')}
                className="w-full text-left p-2.5 rounded-xl border border-[#E8E7F3] hover:border-[#5B4FE9] hover:bg-[#EFEDFC]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    SM
                  </div>
                  <div>
                    <strong className="text-xs text-[#14162B] group-hover:text-[#5B4FE9] block leading-tight">
                      Er. Sivakumar M.
                    </strong>
                    <span className="text-[10px] text-[#8B8DA3]">
                      Problem Owner · Erode Textile Processing Cluster
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#EFEDFC] text-[#5B4FE9] font-semibold px-2 py-0.5 rounded-full">
                  Owner
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Redirect to Register Page */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] text-center">
          <p className="text-xs text-[#4A4C63]">
            Don't have an account yet?{' '}
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="font-bold text-[#5B4FE9] hover:underline inline-flex items-center gap-1 ml-1"
            >
              <span>Register Here</span>
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
