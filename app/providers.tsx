"use client";

import { ReactNode } from "react";
import { FhevmProvider } from "../fhevm/useFhevm";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <FhevmProvider>
      {children}
    </FhevmProvider>
  );
}
