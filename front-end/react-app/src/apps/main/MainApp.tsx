import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Footer from '@apps/main/components/layout/Footer';
import Header from '@apps/main/components/layout/Header';
import '@apps/main/MainApp.css';
import '@shared/AppsCommon.css';
import { Suspense } from 'react';
import Loading from '@shared/components/Loading.tsx';

export default function App() {
	const currentPath: string = useLocation().pathname;
	let backgroundClass: string;
	switch (currentPath) {
		case '/sign-up':
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
			<ScrollRestoration /> {/* Restore scroll on route change */}
			<Header />
			<main className={'pt-28 pb-16 min-w-screen min-h-screen bg-no-repeat' + backgroundClass}>
				<Suspense fallback={ <Loading className='centered' /> }>
					<Outlet />
				</Suspense>
			</main>
			<Footer />
		</>
	);
}
