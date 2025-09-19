import type { Metadata } from 'next';
import ThemeProvider from '../providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'ADTCAPS',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initialTenant="adt">{children}</ThemeProvider>;
}
