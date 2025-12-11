'use client';

import dynamic from 'next/dynamic';

// Disable SSR for Navigation to prevent hydration mismatches
const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false
});

// Disable SSR for ErrorSuppressor to prevent hydration issues
const ErrorSuppressor = dynamic(() => import('@/components/ErrorSuppressor'), {
  ssr: false
});

// Disable SSR for ErrorBoundary since it uses window
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), {
  ssr: false
});

export default function ClientLayout({ children }) {
  return (
    <>
      <ErrorSuppressor />
      <ErrorBoundary>
        <Navigation />
        <main suppressHydrationWarning>{children}</main>
      </ErrorBoundary>
    </>
  );
}

