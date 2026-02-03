
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Calendar } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 font-sans py-10">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-blue-600 mb-2">
                        <Code2 size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">CodeSandbox</h1>
                    <p className="text-gray-500 mt-1">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your email" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter phone" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-2xl tracking-widest" placeholder="••••••••" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">User Type</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option>Select type</option>
                            <option>Developer</option>
                            <option>Student</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                        Already have an account? <span className="text-blue-600">Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
