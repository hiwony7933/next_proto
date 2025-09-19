import type { Metadata } from 'next';
import ThemeProvider from '../providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'CAPSHOME',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initialTenant="cap">{children}</ThemeProvider>;
}
