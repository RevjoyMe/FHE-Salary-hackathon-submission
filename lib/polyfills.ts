// Polyfills for browser environment
if (typeof window !== 'undefined') {
  // Global polyfill
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }
  
  // Process polyfill
  if (typeof process === 'undefined') {
    (window as any).process = { env: {} };
  }
  
  // Buffer polyfill
  if (typeof Buffer === 'undefined') {
    (window as any).Buffer = require('buffer').Buffer;
  }
  
  // Crypto polyfill
  if (typeof crypto === 'undefined') {
    (window as any).crypto = require('crypto').webcrypto;
  }
}

export {};
