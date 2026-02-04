
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Folder, Trophy, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
            <Icon className={color} size={24} />
        </div>
    </div>
);

const ProjectCard = ({ title, description, difficulty, files, tests, badgeColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                {difficulty}
            </span>
        </div>
        <p className="text-gray-600 text-sm mb-6 flex-grow">{description}</p>

        <div className="flex justify-between text-sm text-gray-500 mb-6">
            <span>{files} files</span>
            <span>{tests} tests</span>
        </div>

        <Link
            to="/editor"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition-colors"
        >
            Start Project
        </Link>
    </div>
);

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;

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
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 text-gray-900">
                    <Code2 className="text-blue-600" size={28} />
                    <h1 className="text-xl font-bold">CodeSandbox Platform</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-gray-900 font-semibold">
                            {loading ? 'Loading...' : userProfile?.username || 'User'}
                        </p>
                        {userProfile?.full_name && (
                            <p className="text-gray-500 text-sm">{userProfile.full_name}</p>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Projects Available"
                        value="3"
                        icon={Folder}
                        color="text-blue-500"
                    />
                    <StatCard
                        title="Submissions"
                        value="0"
                        icon={Trophy}
                        color="text-green-500"
                    />
                    <StatCard
                        title="Avg Score"
                        value="0%"
                        icon={CheckCircle}
                        color="text-purple-500"
                    />
                </div>

                {/* Available Projects Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProjectCard
                            title="E-Commerce Cart Bug Fix"
                            description="Fix the cart total calculation bug in a multi-file e-commerce application"
                            difficulty="Medium"
                            files={3}
                            tests={3}
                            badgeColor="bg-yellow-100 text-yellow-800"
                        />
                        <ProjectCard
                            title="User Authentication System"
                            description="Implement password validation and session management"
                            difficulty="Hard"
                            files={2}
                            tests={4}
                            badgeColor="bg-red-100 text-red-800"
                        />
                        <ProjectCard
                            title="String Reversal"
                            description="Write a function that takes a string and returns it reversed"
                            difficulty="Easy"
                            files={1}
                            tests={2}
                            badgeColor="bg-green-100 text-green-800"
                        />
                        <ProjectCard
                            title="Palindrome Checker"
                            description="Check if a string is a palindrome, ignoring special characters"
                            difficulty="Medium"
                            files={1}
                            tests={4}
                            badgeColor="bg-yellow-100 text-yellow-800"
                        />
                        <ProjectCard
                            title="API Rate Limiter"
                            description="Design a sliding window rate limiter for an API endpoint"
                            difficulty="Hard"
                            files={1}
                            tests={5}
                            badgeColor="bg-red-100 text-red-800"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
