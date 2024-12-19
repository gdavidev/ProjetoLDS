import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import ForumSidebar from '@apps/main/components/ForumSidebar.tsx';
import Loading from '@shared/components/Loading.tsx';

export default function ForumPage() {
	return (
			<div className="flex me-4 gap-x-3 min-h-[92vh] -mt-14 -mb-16">
				<ForumSidebar />
				<Suspense fallback={ <Loading /> }>
					<div className='mt-14 mb-16 w-full'>
						<Outlet />
					</div>
				</Suspense>
			</div>
	)
}