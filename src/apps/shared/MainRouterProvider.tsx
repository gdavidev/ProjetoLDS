import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthPageMode } from '@/apps/main/pages/auth/AuthPage'
/*Main*/
import MainApp from '@apps/main/MainApp.tsx'
import AdminApp from '@apps/admin/AdminApp.tsx'
const HomePage = lazy(() => import('@apps/main/pages/HomePage.tsx'))
const ProfilePage = lazy(() => import('@apps/main/pages/ProfilePage.tsx'))
const LibraryPage = lazy(() => import('@apps/main/pages/LibraryPage.tsx'))
const GamesPage = lazy(() => import('@apps/main/pages/GamesPage.tsx'))
const AuthPage = lazy(() => import('@/apps/main/pages/auth/AuthPage'))
const GameViewPage = lazy(() => import('@apps/main/pages/GameViewPage.tsx'))
/*Admin*/
const GamesView = lazy(() => import('@apps/admin/pages/GamesView.tsx'))
const EmulatorsView = lazy(() => import('@apps/admin/pages/EmulatorsView'))
const UsersView = lazy(() => import('@apps/admin/pages/UsersView'))
/*Forum*/
const FeedPage = lazy(() => import('@apps/main/pages/forum/FeedPage'))
const PostPage = lazy(() => import('@apps/main/pages/forum/PostPage'))
const PostCreate = lazy(() => import('@apps/main/pages/forum/PostCreate'))
/*Misc*/
const ErrorPage = lazy(() => import('@shared/pages/ErrorPage.tsx'))

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
        { path: '/feed',               element: <FeedPage />                                   },
        { path: '/post/:postId',       element: <PostPage />                                   },
        { path: '/post/new',           element: <PostCreate />                                 },
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