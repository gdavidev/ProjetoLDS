import { createBrowserRouter, RouterProvider } from 'react-router-dom'
/*Main*/
import MainApp from './../main/MainApp.tsx'
import HomePage from './../main/pages/HomePage.tsx'
import ProfilePage from './../main/pages/ProfilePage.tsx'
import LibraryPage from './../main/pages/LibraryPage.tsx'
import GamesPage from './../main/pages/GamesPage.tsx'
import AuthPage from './../main/pages/Authentication/AuthPage.tsx';
import AdminApp from '../admin/AdminApp.tsx'
/*Admin*/
import GamesView from '../admin/pages/GamesView.tsx'
import EmulatorsView from '../admin/pages/EmulatorsView.tsx'
import UsersView from '../admin/pages/UsersView.tsx'

const router = createBrowserRouter([
  { errorElement: <div>404 Page not Found</div> },
  { 
    path: '/app',
    element: <MainApp />,
    children: [
        { path: '/app',                     element: <HomePage />      },
        { path: '/app/profile/:profileId',  element: <ProfilePage />   },
        { path: '/app/library/:profileId',  element: <LibraryPage />   },
        { path: '/app/games',               element: <GamesPage />     },
        { path: '/app/sign-in',             element: <AuthPage />      },
        { path: '/app/log-in',              element: <AuthPage />      },
      ]      
  },
  {
    path: '/admin',
    element: <AdminApp />,
    children: [
      { path: '/admin/view-games',      element: <GamesView />     },
      { path: '/admin/view-emulators',  element: <EmulatorsView /> },
      { path: '/admin/view-users',      element: <UsersView />     },
    ]      
  }
]);

export default function MainRouterProvider() {
  return (
    <RouterProvider router={router} />
  )
}