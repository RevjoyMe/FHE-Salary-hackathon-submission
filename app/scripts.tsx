"use client";

import { useEffect } from 'react';

export function Scripts() {
  useEffect(() => {
    // Global polyfill for Relayer SDK
    if (typeof global === 'undefined') {
      (window as any).global = window;
    }
    if (typeof process === 'undefined') {
      (window as any).process = { env: {} };
    }

    // Load Relayer SDK
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zama-fhe/relayer-sdk@0.1.2/dist/relayer-sdk.js';
    script.async = true;
    script.onerror = () => {
      console.warn('Failed to load Relayer SDK from CDN, will use dynamic import');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
