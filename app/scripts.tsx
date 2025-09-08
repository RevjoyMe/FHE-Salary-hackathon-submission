"use client";

export const dynamic = 'force-dynamic'

import { useEffect } from 'react';
import '../lib/polyfills';

export function Scripts() {
  useEffect(() => {
    // Relayer SDK is now installed via npm
    console.log('Relayer SDK available via npm import');
  }, []);

  return null;
}
