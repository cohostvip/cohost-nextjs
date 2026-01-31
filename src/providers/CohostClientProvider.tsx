'use client';

import { CohostProvider, AuthProvider, useTokenAuth, useCohostClient } from '@cohostvip/cohost-react';

interface CohostClientProviderProps {
  children: React.ReactNode;
  /** Query string parameter name for token auth (e.g., 'token'). If not set, token auth is disabled. */
  tokenParam?: string;
}

function AuthWrapper({ children, tokenParam }: { children: React.ReactNode; tokenParam?: string }) {
  const { apiUrl } = useCohostClient();

  const authConfig = {
    apiUrl: `${apiUrl}/auth`,
    tokenParam,
  };

  return (
    <AuthProvider config={authConfig}>
      <TokenAuthHandler>
        {children}
      </TokenAuthHandler>
    </AuthProvider>
  );
}

function TokenAuthHandler({ children }: { children: React.ReactNode }) {
  useTokenAuth();
  return <>{children}</>;
}

export function CohostClientProvider({ children, tokenParam }: CohostClientProviderProps) {
  const token = process.env.NEXT_PUBLIC_COHOST_TOKEN!;

  return (
    <CohostProvider token={token}>
      <AuthWrapper tokenParam={tokenParam}>
        {children}
      </AuthWrapper>
    </CohostProvider>
  );
}
