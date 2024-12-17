import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import MainContextProvider from '@shared/context/MainContextProvider.tsx'
import OverlayContextProvider from '@shared/context/OverlayContextProvider.tsx'
import { lazy, useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useMatches } from 'react-router-dom';
import { AuthPageMode } from '@/apps/main/pages/auth/AuthPage'

/*Misc*/
import ErrorPage from '@shared/pages/ErrorPage.tsx';
/*Main*/
import MainApp from '@apps/main/MainApp.tsx'
import AdminApp from '@apps/admin/AdminApp.tsx'
const HomePage = lazy(() => import('@apps/main/pages/HomePage.tsx'))
const ProfilePage = lazy(() => import('@apps/main/pages/ProfilePage.tsx'))
const GamesPage = lazy(() => import('@apps/main/pages/GamesPage.tsx'))
const AuthPage = lazy(() => import('@/apps/main/pages/auth/AuthPage'))
const GameViewPage = lazy(() => import('@apps/main/pages/GameViewPage.tsx'))
/*Admin*/
const GamesView = lazy(() => import('@apps/admin/pages/GamesView.tsx'))
const EmulatorsView = lazy(() => import('@apps/admin/pages/EmulatorsView'))
const ReportView = lazy(() => import('@apps/admin/pages/ReportsView.tsx'))
/*Forum*/
const ForumPage = lazy(() => import('@apps/main/pages/forum/ForumPage'))
const FeedPage = lazy(() => import('@apps/main/pages/forum/FeedPage'))
const PostPage = lazy(() => import('@apps/main/pages/forum/PostPage'))
const PostCreate = lazy(() => import('@apps/main/pages/forum/PostCreate'))

const router = createBrowserRouter([
  { handle: { title: 'Erro 404' }, errorElement: <ErrorPage code={ 404 } /> },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainApp />,
        children: [
          { handle: { title: 'Home'          }, path: '/',               element: <HomePage />                                   },
          { handle: { title: 'Games'         }, path: '/games',          element: <GamesPage />                                  },
          { handle: { title: 'Registro'      }, path: '/sign-up',        element: <AuthPage mode={AuthPageMode.SIGNUP} />        },
          { handle: { title: 'Entrar'        }, path: '/log-in',         element: <AuthPage mode={AuthPageMode.LOGIN} />         },
          { handle: { title: 'Alterar Senha' }, path: '/reset-password', element: <AuthPage mode={AuthPageMode.RESET_PASSWORD} />},
          { handle: { title: 'Perfil'        }, path: '/profile',        element: <ProfilePage />                                },
          { handle: { title: 'Game'          }, path: '/game/:gameId',   element: <GameViewPage />                               },
          {
            path: '/forum',
            element: <ForumPage />,
            children: [
              { handle: { title: 'Feed'       }, path: '/forum/feed',         element: <FeedPage />   },
              { handle: { title: 'Post'       }, path: '/forum/post/:postId', element: <PostPage />   },
              { handle: { title: 'Criar Post' }, path: '/forum/post/new',     element: <PostCreate /> },
            ]},
        ]
      },
      {
        path: '/admin',
        element: <AdminApp />,
        children: [
          { handle: { title: 'Games'      }, path: '/admin/view-games',     element: <GamesView />      },
          { handle: { title: 'Emuladores' }, path: '/admin/view-emulators', element: <EmulatorsView />  },
          { handle: { title: 'Denúncias'  }, path: '/admin/view-reports',   element: <ReportView />     },
        ]
      }
    ],
  }
]);

function App() {
  const matches = useMatches()
  const handle: any = matches[matches.length - 1].handle
  const title: string = handle.title ?? ''

  useEffect(() => {
    if (title)
      document.title = title;
  }, [title])

  return (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <MainContextProvider>
            <OverlayContextProvider>
              <Outlet />
            </OverlayContextProvider>
          </MainContextProvider>
        </QueryClientProvider>
      </StrictMode>
  )
}

const queryClient: QueryClient = new QueryClient();
createRoot(document.getElementById('root')!).render( <RouterProvider router={ router } /> );