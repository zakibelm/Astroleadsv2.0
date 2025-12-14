import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

// Demo users for testing
const DEMO_USERS: Record<string, User> = {
    'admin@astroleads.com': {
        id: 'user-1',
        email: 'admin@astroleads.com',
        name: 'Alex Chen',
        role: 'admin',
        createdAt: '2023-01-15',
    },
    'demo@astroleads.com': {
        id: 'user-2',
        email: 'demo@astroleads.com',
        name: 'Demo User',
        role: 'user',
        createdAt: '2024-01-01',
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            login: async (email: string, _password: string) => {
                set({ isLoading: true });

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const user = DEMO_USERS[email.toLowerCase()];

                if (user) {
                    set({ user, isAuthenticated: true, isLoading: false });
                    return true;
                }

                set({ isLoading: false });
                return false;
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },

            setLoading: (isLoading) => {
                set({ isLoading });
            },
        }),
        {
            name: 'astroleads-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
