'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useThemeStore, ThemeMode, TenantKey } from '../../stores/themeStore';

export interface ThemeProviderProps extends PropsWithChildren {
  initialTenant: TenantKey | null;
  initialMode?: ThemeMode;
}

export default function ThemeProvider({
  children,
  initialTenant,
  initialMode = 'light',
}: ThemeProviderProps) {
  const setTenant = useThemeStore((s) => s.setTenant);
  const setMode = useThemeStore((s) => s.setMode);

  useEffect(() => {
    setTenant(initialTenant);
    setMode(initialMode);
  }, [initialTenant, initialMode, setTenant, setMode]);

  return children;
}
