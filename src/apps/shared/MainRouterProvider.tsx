import { createBrowserRouter, RouterProvider } from 'react-router-dom'
/*Main*/
import MainApp from '@apps/main/MainApp.tsx'
import HomePage from '@apps/main/pages/HomePage.tsx'
import ProfilePage from '@apps/main/pages/ProfilePage.tsx'
import LibraryPage from '@apps/main/pages/LibraryPage.tsx'
import GamesPage from '@apps/main/pages/GamesPage.tsx'
import AuthPage, { AuthPageMode } from '@apps/main/pages/authentication/AuthPage.tsx';
import AdminApp from '@apps/admin/AdminApp.tsx'
import GameViewPage from '@apps/main/pages/GameViewPage.tsx'
/*Admin*/
import GamesView from '@apps/admin/pages/GamesView.tsx'
import EmulatorsView from '../admin/pages/EmulatorsView'
import UsersView from '../admin/pages/UsersView'
/*Misc*/
import ErrorPage from '@shared/pages/ErrorPage.tsx'

const router = createBrowserRouter([
  { errorElement: <ErrorPage code={ 404 } /> },
  { 
    path: '/',
    element: <MainApp />,
    children: [
        { path: '/',                   element: <HomePage />                                   },
        { path: '/library/:profileId', element: <LibraryPage />                                },
        { path: '/games',              element: <GamesPage />                                  },
        { path: '/sign-in',            element: <AuthPage mode={AuthPageMode.REGISTER} />      },
        { path: '/log-in',             element: <AuthPage mode={AuthPageMode.LOGIN} />         },
        { path: '/reset-password',     element: <AuthPage mode={AuthPageMode.RESET_PASSWORD} />},
        { path: '/profile',            element: <ProfilePage />                                },
        { path: '/game/:gameId',       element: <GameViewPage />                               },
      ]      
  },
  {
    path: '/admin',
    element: <AdminApp />,
    children: [
      { path: '/admin/view-games',     element: <GamesView />      },
      { path: '/admin/view-emulators', element: <EmulatorsView />  },
      { path: '/admin/view-users',     element: <UsersView />      },
    ]      
  }
]);

export default function MainRouterProvider() {
  return (
    <RouterProvider router={ router }  />
  )
}