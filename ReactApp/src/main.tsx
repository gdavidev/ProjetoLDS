import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "react-query";
import App from './App.tsx'
import MainContextProvider from './MainContextProvider.tsx'
import HomePage from './pages/HomePage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import LibraryPage from './pages/LibraryPage.tsx'
import EmulatorsPage from './pages/EmulatorsPage.tsx'
import GamesPage from './pages/GamesPage.tsx'
import AuthPage from './pages/Authentication/AuthPage.tsx';

const queryClient: QueryClient = new QueryClient();
const router = createBrowserRouter([
  { errorElement: <div>404 Page not Found</div> },
  { 
    path: '/',
    element: <App />,
    children: [
      { path: '/',                    element: <HomePage />      },
      { path: '/profile/:profileId',  element: <ProfilePage />   },
      { path: '/library/:profileId',  element: <LibraryPage />   },
      { path: '/emulators',           element: <EmulatorsPage /> },
      { path: '/games',               element: <GamesPage />     },
      { path: '/sign-in',             element: <AuthPage />      },
      { path: '/log-in',              element: <AuthPage />      },
    ]
  },
])

createRoot(document.getElementById('root')!).render(getApp());
function getApp(): React.ReactNode {
  return (
    <StrictMode>
      <QueryClientProvider client={ queryClient }>
        <MainContextProvider>
          <RouterProvider router={ router } />
        </MainContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
