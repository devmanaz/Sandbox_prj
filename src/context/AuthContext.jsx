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
                    throw new Error('Too many signup attempts. Please wait a few minutes and try again, or disable email confirmation in Supabase settings.');
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
                            phone_number: userData.phone_number,
                            date_of_birth: userData.date_of_birth,
                            user_type: userData.user_type,
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
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
