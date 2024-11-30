import { CircularProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

export default function ForumPage() {
	return (
			<>
				<Suspense fallback={ <div className='w-full h-full flex justify-center items-center'><CircularProgress color="primary" /></div> }>
					<Outlet />
				</Suspense>
			</>
	)
}