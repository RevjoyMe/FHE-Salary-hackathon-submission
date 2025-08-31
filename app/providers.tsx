"use client";

export const dynamic = 'force-dynamic'

import { ReactNode, useRef } from "react";
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { ethers } from "ethers";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MetaMaskProvider>
      <MetaMaskEthersSignerProvider initialMockChains={{
        // Временно используем публичный RPC для тестирования
        31337: "https://rpc.sepolia.org", // Sepolia testnet
        // 31337: "http://127.0.0.1:8545", // Локальный Hardhat - закомментировано
      }}>
        <InMemoryStorageProvider>
          {children}
        </InMemoryStorageProvider>
      </MetaMaskEthersSignerProvider>
    </MetaMaskProvider>
  );
}

// Полный контекст для FHE с реальной функциональностью
export const useFhevmContext = () => {
  const { provider, chainId } = useMetaMask();
  const { ethersSigner, ethersReadonlyProvider } = useMetaMaskEthersSigner();

  const { instance, refresh, error, status } = useFhevm({
    provider,
    chainId,
    enabled: true,
  });

  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const sameChain = useRef((chainId: number | undefined) => {
    return chainId === 11155111; // Sepolia testnet (11155111)
  });

  const sameSigner = useRef((ethersSigner: ethers.JsonRpcSigner | undefined) => {
    return ethersSigner === ethersSigner;
  });

  return {
    instance,
    refresh,
    error,
    status,
    provider,
    chainId,
    signer: ethersSigner,
    readonlyProvider: ethersReadonlyProvider,
    fhevmDecryptionSignatureStorage,
    sameChain,
    sameSigner,
  };
};
