import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import MainContextProvider from '@shared/context/MainContextProvider.tsx'
import MainRouterProvider from '@shared/MainRouterProvider.tsx';

const queryClient: QueryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(<App />);

function App() {
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


