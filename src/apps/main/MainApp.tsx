import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@apps/main/components/layout/Footer';
import Header from '@apps/main/components/layout/Header';
import '@apps/main/MainApp.css';
import '@shared/AppsCommon.css';
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';

export default function App() {
	const currentPath: string = useLocation().pathname;
  let backgroundClass: string = '';
  switch (currentPath) {
    case '/sign-in':
    case '/log-in':
    case '/reset-password':
			backgroundClass = ' bg-cover bg-login-page';
      break;    
    default:
			backgroundClass = ' bg-cover bg-background';
      break;
  }

  return (
    <>
      <Header />
			<main className={'pt-28 pb-16 min-w-screen min-h-screen bg-no-repeat' + backgroundClass}>
				<Suspense fallback={<CircularProgress color="primary" />}>
        <Outlet />
				</Suspense>
      </main>
      <Footer />
    </>    
  );
}
