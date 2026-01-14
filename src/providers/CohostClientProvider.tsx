'use client';

import { CohostProvider } from '@cohostvip/cohost-react';

interface CohostClientProviderProps {
  children: React.ReactNode;
}

export function CohostClientProvider({ children }: CohostClientProviderProps) {
  const token = process.env.NEXT_PUBLIC_COHOST_TOKEN!;

  return (
    <CohostProvider token={token}>
      {children}
    </CohostProvider>
  );
}
