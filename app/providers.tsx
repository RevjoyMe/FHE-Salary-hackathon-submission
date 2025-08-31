"use client";

export const dynamic = 'force-dynamic'

import { ReactNode } from "react";
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MetaMaskProvider>
      {children}
    </MetaMaskProvider>
  );
}

// Простой контекст для FHE - пока без сложной логики
export const useFhevmContext = () => {
  return {
    instance: undefined,
    refresh: () => {},
    error: null,
    status: "initializing",
    provider: undefined,
    chainId: undefined,
    signer: undefined,
    readonlyProvider: undefined,
    fhevmDecryptionSignatureStorage: {
      get: () => null,
      set: () => {},
      remove: () => {},
    },
    sameChain: { current: () => false },
    sameSigner: { current: () => false },
  };
};
