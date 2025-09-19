import { create } from 'zustand';

export type TenantKey = 'sk' | 'cap' | 'adt';
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  tenant: TenantKey | null;
  mode: ThemeMode;
  setTenant: (tenant: TenantKey | null) => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  tenant: null,
  mode: 'light',
  setTenant: (tenant) => set({ tenant }),
  setMode: (mode) => set({ mode }),
}));
