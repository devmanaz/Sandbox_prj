
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { signIn, isConfigured } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await signIn(formData.username, formData.password);

            if (error) {
                setError(error.message || 'Invalid username or password');
                setLoading(false);
                return;
            }

            if (data) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-blue-600 mb-2">
                        <Code2 size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">CodeSandbox</h1>
                    <p className="text-gray-500 mt-1">Scenario-Driven Coding Platform</p>
                </div>

                {!isConfigured && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-blue-800 font-semibold">
                            <AlertCircle size={20} />
                            <span>Development Mode</span>
                        </div>
                        <p className="text-sm text-blue-700">
                            Supabase is not configured yet. Authentication features are disabled, but you can still access the dashboard!
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                            Skip to Dashboard →
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-2xl tracking-widest"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                        Don't have an account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
