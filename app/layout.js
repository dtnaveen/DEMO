import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'VibeMatch - Find Your Perfect Match',
  description: 'A vibe-based dating app where users match based on shared values and content preferences',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
