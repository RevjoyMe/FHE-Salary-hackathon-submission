"use client";

import { useEffect } from 'react';
import '../lib/polyfills';

export function Scripts() {
  useEffect(() => {
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
