import { create } from 'zustand';

type User = {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),
  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));
