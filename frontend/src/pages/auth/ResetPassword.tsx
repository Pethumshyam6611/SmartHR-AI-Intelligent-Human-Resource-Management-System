import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Lock } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Missing reset token');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast.success(response.data.message || 'Password reset successful');
      window.setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-text-secondary">This password reset link is missing a token or is malformed.</p>
        </div>
        <Link to="/forgot-password" className="btn-primary inline-flex">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-text-secondary">Choose a new password for your SmartHR account.</p>
      </div>

      {success ? (
        <div className="p-4 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span>Password updated successfully. Redirecting to login...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="label">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter a new password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Confirm Password</label>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Re-enter the password"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <span className="flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={18} className="animate-spin" />Updating password...</> : 'Reset Password'}
            </span>
          </button>
        </form>
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
