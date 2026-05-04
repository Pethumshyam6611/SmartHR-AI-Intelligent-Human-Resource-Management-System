import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { User, Building2, Briefcase, MapPin, Phone, Calendar, CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nic: '',
        department: '',
        position: '',
        address: '',
        phoneNumber: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!token) {
            toast.error('Invalid invitation link');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', {
                token,
                ...formData,
            });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Invalid Invitation</h2>
                    <p className="text-text-secondary mb-6">This invitation link is invalid or has expired.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-dark p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Complete Your Registration</h1>
                    <p className="text-text-secondary">Fill in your details to join the SmartHR system</p>
                </div>

                <form onSubmit={handleSubmit} className="card">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <User size={20} />
                                Personal Information
                            </h3>
                        </div>

                        <div>
                            <label className="label">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">NIC Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    name="nic"
                                    value={formData.nic}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g., 200012345678"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="+94 71 234 5678"
                                />
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-bold text-secondary-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={20} />
                                Employment Details
                            </h3>
                        </div>

                        <div>
                            <label className="label">Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g., Engineering"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Position</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="label">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-text-tertiary" size={18} />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-field pl-10 min-h-[80px]"
                                    placeholder="Your full address"
                                />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Lock size={20} />
                                Security
                            </h3>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="btn-ghost flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Complete Registration
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
