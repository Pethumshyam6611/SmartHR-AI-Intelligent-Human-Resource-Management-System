import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { User, Mail, MapPin, Phone, Building2, Briefcase, Lock, Edit2, Save, X, Camera } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.employee?.firstName || '',
    lastName: user?.employee?.lastName || '',
    address: user?.employee?.address || '',
    phoneNumber: user?.employee?.phoneNumber || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.employee) {
      setFormData({
        firstName: user.employee.firstName || '',
        lastName: user.employee.lastName || '',
        address: user.employee.address || '',
        phoneNumber: user.employee.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', formData);
      if (user) {
        updateUser({
          ...user,
          employee: user.employee
            ? {
                ...user.employee,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
              }
            : user.employee,
        });
      }
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Profile</h1>
        <p className="text-text-secondary">Manage your personal information and settings</p>
      </div>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-3xl font-bold shadow-industrial">
              {user?.employee?.firstName?.[0]}{user?.employee?.lastName?.[0]}
            </div>
            <button className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {user?.employee?.firstName} {user?.employee?.lastName}
            </h2>
            <p className="text-primary-400 font-mono text-sm uppercase tracking-wider mb-2">{user?.role}</p>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Mail size={16} />
              {user?.email}
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User size={20} className="text-primary-400" />
            Personal Information
          </h3>
          {isEditing && (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="btn-ghost">
                <X size={18} />
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={loading} className="btn-primary">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-text-primary font-medium">{user?.employee?.firstName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="label">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-text-primary font-medium">{user?.employee?.lastName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Phone size={16} />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-text-primary font-medium">{user?.employee?.phoneNumber || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Building2 size={16} />
              Department
            </label>
            <p className="text-text-primary font-medium">{user?.employee?.department || 'N/A'}</p>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Briefcase size={16} />
              Position
            </label>
            <p className="text-text-primary font-medium">{user?.employee?.position || 'N/A'}</p>
          </div>

          <div className="md:col-span-2">
            <label className="label flex items-center gap-2">
              <MapPin size={16} />
              Address
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field min-h-[80px]"
              />
            ) : (
              <p className="text-text-primary font-medium">{user?.employee?.address || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock size={20} className="text-secondary-500" />
            Security
          </h3>
          {!isChangingPassword && (
            <button onClick={() => setIsChangingPassword(true)} className="btn-secondary">
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
                minLength={6}
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input-field"
                minLength={6}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsChangingPassword(false)} className="btn-ghost flex-1">
                Cancel
              </button>
              <button onClick={handleChangePassword} disabled={loading} className="btn-primary flex-1">
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <p className="text-text-secondary text-sm">
            Password last changed: <span className="text-text-primary">Never</span>
          </p>
        )}
      </div>
    </div>
  );
}
