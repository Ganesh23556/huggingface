"use client";

import { create } from "zustand";

type AuthUser = {
  userId: number;
  email: string;
  name: string;
} | null;

type AuthState = {
  user: AuthUser;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        set({ user: null });
        return;
      }
      const data = await res.json();
      set({ user: data.user });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    set({ user: null });
  },
}));
