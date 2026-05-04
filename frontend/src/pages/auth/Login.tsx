import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      toast.success('Access Granted - Welcome back');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-text-secondary">Enter your credentials to access the workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="label">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="label mb-0">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-surface-dark-3 bg-surface-dark-2 text-primary-600 focus:ring-offset-0 focus:ring-primary-500/50"
          />
          <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            Remember this device
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-surface-dark-2">
        <div className="flex items-start gap-3 p-4 bg-primary-500/5 border border-primary-500/10 rounded">
          <AlertCircle size={18} className="text-primary-400 mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-primary-400 block mb-0.5">Secure System</strong>
            This system is monitored. Unauthorized access is prohibited and will be reported to the administration.
          </p>
        </div>
      </div>
    </div>
  );
}
