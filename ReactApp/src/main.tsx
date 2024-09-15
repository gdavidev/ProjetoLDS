import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "react-query";
import MainContextProvider from './apps/shared/context/MainContextProvider.tsx'
import MainRouterProvider from './apps/shared/MainRouterProvider.tsx';

const queryClient: QueryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(getApp());
function getApp(): React.ReactNode {
  return (
    <StrictMode>
      <QueryClientProvider client={ queryClient }>
        <MainContextProvider>
          <MainRouterProvider />
        </MainContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}


