"use client";

export const dynamic = 'force-dynamic'

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
    </>
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
