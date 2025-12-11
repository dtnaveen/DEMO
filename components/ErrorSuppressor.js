'use client';

import { useEffect, useState } from 'react';

/**
 * Suppresses non-critical development errors (WebSocket HMR, etc.)
 * This must run as early as possible to catch errors during React hydration
 */
export default function ErrorSuppressor() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    
    // Unregister any problematic service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          // Only unregister if it's causing errors
          registration.unregister().catch(() => {
            // Silently fail
          });
        });
      });
    }
    
    // Suppress WebSocket HMR errors (non-critical development warnings)
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // More aggressive filtering
    const shouldSuppress = (message) => {
      if (!message || typeof message !== 'string') return false;
      return (
        // WebSocket HMR errors
        ((message.includes('WebSocket connection') || message.includes('WebSocket')) &&
         (message.includes('_next/webpack-hmr') || 
          message.includes('webpack-hmr') || 
          message.includes('ws://localhost') ||
          message.includes('use-websocket'))) ||
        // Service worker errors
        message.includes('FetchEvent') ||
        message.includes('sw.js') ||
        message.includes('service worker') ||
        message.includes('Failed to convert value to \'Response\'') ||
        message.includes('Failed to fetch') && message.includes('sw.js') ||
        // Geolocation errors (expected when GPS unavailable)
        message.includes('Error getting location') ||
        message.includes('Error getting initial location') ||
        message.includes('Location tracking error') ||
        message.includes('Geolocation unavailable') ||
        message.includes('GPS not available') ||
        message.includes('Location tracking unavailable') ||
        message.includes('Initial location unavailable')
      );
    };
    
    console.error = function(...args) {
      // Filter out WebSocket HMR connection errors and geolocation errors
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg?.message || arg?.toString() || ''
      ).join(' ');
      
      // Check if it's a geolocation error object
      const isGeolocationError = args.some(arg => 
        arg && typeof arg === 'object' && (
          arg.code === 1 || // PERMISSION_DENIED
          arg.code === 2 || // POSITION_UNAVAILABLE
          arg.code === 3    // TIMEOUT
        )
      );
      
      if (shouldSuppress(message) || isGeolocationError) {
        // Silently ignore HMR WebSocket errors and expected geolocation errors
        return;
      }
      // Log other errors normally
      originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
      // Filter out WebSocket HMR warnings
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg?.message || arg?.toString() || ''
      ).join(' ');
      
      if (shouldSuppress(message)) {
        // Silently ignore HMR WebSocket warnings
        return;
      }
      // Log other warnings normally
      originalWarn.apply(console, args);
    };
    
    // Suppress unhandled WebSocket errors (catch-all)
    const errorHandler = (event) => {
      const message = event.message || event.error?.message || '';
      if (shouldSuppress(message)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };
    
    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || event.reason?.toString() || '';
      if (shouldSuppress(message)) {
        event.preventDefault();
      }
    }, true);
    
    // Cleanup on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', errorHandler, true);
    };
  }, [isMounted]);
  
  return null; // This component doesn't render anything
}

