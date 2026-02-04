
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Folder, Trophy, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-dark p-6 rounded-2xl shadow-xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all duration-500">
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
            <h3 className={`text-4xl font-bold tracking-tight ${color} neon-text-purple`}>{value}</h3>
        </div>
        <div className={`p-4 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={color} size={28} />
        </div>
    </div>
);

const ProjectCard = ({ title, description, difficulty, files, tests, badgeColor }) => (
    <div className="glass-dark p-8 rounded-3xl shadow-2xl border border-white/5 flex flex-col h-full group hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
        {/* Decorative Gradient */}
        <div className="absolute -top-24 -right-24 w-48 height-48 bg-purple-600/10 blur-3xl rounded-full group-hover:bg-purple-600/20 transition-colors duration-500"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{title}</h3>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeColor} neon-border-magenta shadow-lg`}>
                {difficulty}
            </span>
        </div>
        <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed relative z-10">{description}</p>

        <div className="flex items-center gap-6 text-xs font-bold text-slate-500 mb-8 relative z-10 uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>{files} files</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-magenta-500"></div>
                <span>{tests} tests</span>
            </div>
        </div>

        <Link
            to="/editor"
            className="w-full bg-white text-[#030303] hover:bg-slate-200 font-bold py-4 rounded-2xl text-center transition-all duration-300 relative z-10 shadow-xl hover:shadow-white/10 mt-auto"
        >
            Launch Editor
        </Link>
    </div>
);

const Dashboard = () => {
    const { user, signOut, isConfigured } = useAuth();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !supabase) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('username, full_name, user_type')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error);
                } else {
                    setUserProfile(data);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="relative min-h-screen bg-[#030303] overflow-hidden font-sans pb-20">
            {/* Background Streaks */}
            <div className="bg-streaks">
                <div className="streak-1 opacity-50"></div>
                <div className="streak-2 opacity-50"></div>
            </div>

            {/* Header */}
            <header className="glass-dark border-b border-white/5 px-10 py-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-3xl">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 glass rounded-xl neon-border-magenta">
                        <Code2 size={24} className="text-magenta-500" />
                    </div>
                    <h1 className="text-xl font-black tracking-tight uppercase">CodeSandbox</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-white font-bold text-sm tracking-tight">
                            {loading ? '...' : userProfile?.username || user?.email?.split('@')[0] || 'Guest User'}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                            {userProfile?.full_name && (
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{userProfile.full_name}</p>
                            )}
                            {!user && !loading && (
                                <p className="text-purple-500 text-[10px] uppercase font-black tracking-widest border border-purple-500/30 px-2 py-0.5 rounded-full">Dev Mode</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-3 glass rounded-xl text-red-500 hover:text-red-400 hover:bg-white/5 transition-all duration-300"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {!isConfigured && (
                <div className="bg-purple-600 text-white px-10 py-2.5 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest relative z-40">
                    <AlertCircle size={14} />
                    <span>Supabase is not configured. Some features may be offline.</span>
                    <Link to="/login" className="underline hover:text-purple-200">Connect Now</Link>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-10 py-12 space-y-12 relative z-10">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        title="Projects Available"
                        value="05"
                        icon={Folder}
                        color="text-white"
                    />
                    <StatCard
                        title="Submissions"
                        value="00"
                        icon={Trophy}
                        color="text-magenta-400"
                    />
                    <StatCard
                        title="Avg Score"
                        value="0%"
                        icon={CheckCircle}
                        color="text-purple-400"
                    />
                </div>

                {/* Available Projects Section */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Available Projects</h2>
                        <div className="h-px flex-grow bg-white/10"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <ProjectCard
                            title="E-Commerce Total Bug"
                            description="Fix calculation errors in a complex multi-file shopping cart system."
                            difficulty="Medium"
                            files={3}
                            tests={3}
                            badgeColor="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        />
                        <ProjectCard
                            title="Auth Session Management"
                            description="Build a secure session validation layer with token handling."
                            difficulty="Hard"
                            files={2}
                            tests={4}
                            badgeColor="bg-red-500/10 text-red-500 border border-red-500/20"
                        />
                        <ProjectCard
                            title="String Reverse Logic"
                            description="Implement an optimized string reversal algorithm for large buffers."
                            difficulty="Easy"
                            files={1}
                            tests={2}
                            badgeColor="bg-green-500/10 text-green-500 border border-green-500/20"
                        />
                        <ProjectCard
                            title="Smart Palindrome"
                            description="Detect palindromes while filtering out complex Unicode noise."
                            difficulty="Medium"
                            files={1}
                            tests={4}
                            badgeColor="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        />
                        <ProjectCard
                            title="Sliding Rate Limiter"
                            description="Implement a high-performance rate limiting algorithm using buckets."
                            difficulty="Hard"
                            files={1}
                            tests={5}
                            badgeColor="bg-red-500/10 text-red-500 border border-red-500/20"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
