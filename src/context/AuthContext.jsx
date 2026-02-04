import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sign up function
    const signUp = async (email, password, userData) => {
        if (!supabase) {
            return { data: null, error: { message: 'Supabase is not configured. Please check your .env file.' } };
        }
        try {
            // Create auth user with email confirmation disabled for development
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Skip email confirmation to avoid rate limits during development
                    emailRedirectTo: undefined,
                }
            });

            if (authError) {
                // Handle rate limit errors specifically
                if (authError.message.includes('rate limit') || authError.message.includes('Email rate limit exceeded')) {
                    throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
                }
                throw authError;
            }

            // Insert additional user data into public.users table
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: authData.user.id,
                            email: email,
                            username: userData.username,
                            full_name: userData.full_name,
                            phone_number: userData.phoneNumber,
                            date_of_birth: userData.dateOfBirth,
                            user_type: userData.userType,
                        },
                    ]);

                if (profileError) throw profileError;
            }

            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // Sign in function
    const signIn = async (username, password) => {
        if (!supabase) {
            return { data: null, error: { message: 'Supabase is not configured. Please check your .env file.' } };
        }
        try {
            // First, get the email associated with the username
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('email')
                .eq('username', username)
                .single();

            if (userError || !userData) {
                throw new Error('Invalid username or password');
            }

            // Then sign in with email and password
            const { data, error } = await supabase.auth.signInWithPassword({
                email: userData.email,
                password: password,
            });

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // Sign out function
    const signOut = async () => {
        if (!supabase) return { error: null };
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isConfigured: !!supabase,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">Loading CodeSandbox...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
