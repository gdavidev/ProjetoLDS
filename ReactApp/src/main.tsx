import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import LibraryPage from './pages/LibraryPage.tsx'
import SignInPage from './pages/SignInPage.tsx'
import EmulatorsPage from './pages/EmulatorsPage.tsx'
import GamesPage from './pages/GamesPage.tsx'


const router = createBrowserRouter([
  { errorElement: <div>404 Page not Found</div> },
  { 
    path: '/',
    element: <App />,
    children: [
      { path: '/',                    element: <HomePage /> },
      { path: '/profile/:profileId',  element: <ProfilePage /> },
      { path: '/library/:profileId',  element: <LibraryPage /> },
      { path: '/emulators',           element: <EmulatorsPage /> },
      { path: '/games',               element: <GamesPage /> },
      { path: '/signin/',             element: <SignInPage /> },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router } />
  </StrictMode>,
)
