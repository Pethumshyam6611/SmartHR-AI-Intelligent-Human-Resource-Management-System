import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { ArrowLeft, Loader2, Mail, ShieldAlert } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setResetLink(response.data.resetLink || '');
      toast.success(response.data.message || 'Password reset link sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
        <p className="text-text-secondary">Enter your email to receive a secure password reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="label">Email Address</label>
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

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <span className="flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" />Sending reset link...</> : 'Send Reset Link'}
          </span>
        </button>
      </form>

      {resetLink && (
        <div className="mt-6 p-4 rounded border border-primary-500/20 bg-primary-500/10">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-primary-400 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-text-primary">Development reset link</p>
              <a href={resetLink} className="text-sm text-primary-400 break-all hover:text-primary-300">
                {resetLink}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </div>
  );
}
