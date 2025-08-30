"use client";

export const dynamic = 'force-dynamic'

import { ReactNode, useRef } from "react";
import { ethers } from "ethers";
import { useFhevm } from "@/fhevm/useFhevm";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // MetaMask provider
  const { provider, chainId } = useMetaMask();
  
  // MetaMask signer
  const { signer, readonlyProvider } = useMetaMaskEthersSigner();
  
  // FHEVM instance
  const { instance, refresh, error, status } = useFhevm({
    provider,
    chainId,
    enabled: true,
  });

  // Storage for decryption signatures
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  // Check if we're on the same chain
  const sameChain = useRef((chainId: number | undefined) => {
    return chainId === 9746; // FHEVM testnet
  });

  // Check if we have the same signer
  const sameSigner = useRef((ethersSigner: ethers.JsonRpcSigner | undefined) => {
    return ethersSigner === signer;
  });

  return (
    <FhevmDecryptionSignature.Provider value={fhevmDecryptionSignatureStorage}>
      {children}
    </FhevmDecryptionSignature.Provider>
  );
}

// Export context values for use in components
export const useFhevmContext = () => {
  const { provider, chainId } = useMetaMask();
  const { signer, readonlyProvider } = useMetaMaskEthersSigner();
  
  const { instance, refresh, error, status } = useFhevm({
    provider,
    chainId,
    enabled: true,
  });

  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const sameChain = useRef((chainId: number | undefined) => {
    return chainId === 9746; // FHEVM testnet
  });

  const sameSigner = useRef((ethersSigner: ethers.JsonRpcSigner | undefined) => {
    return ethersSigner === signer;
  });

  return {
    instance,
    refresh,
    error,
    status,
    provider,
    chainId,
    signer,
    readonlyProvider,
    fhevmDecryptionSignatureStorage,
    sameChain,
    sameSigner,
  };
};
