import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import { IonIcon } from '@ionic/react';
import { add, arrowForward } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';

export default function ForumSidebar() {
	const navigate = useNavigate();
	const { user, askToLogin } = useCurrentUser();
	const { data: categories } = useCategories(CategoryType.POSTS);

	const handleNavigateToPostCreate = useCallback(() => {
		if (!user) {
			askToLogin('É preciso estar logado para criar posts.')
		} else {
			navigate('/forum/post/new')
		}
	}, [])

	return (
		<aside className="min-w-72 flex flex-col px-2 pt-10 pb-4 bg-layout-background">
			<div className='flex justify-between'>
				<Link to='/forum/feed'>
					<h2 className='font-bold text-2xl text-white'>
						Forum
					</h2>
				</Link>
				<button
						className='btn-primary'
						onClick={ handleNavigateToPostCreate }>
					<IonIcon icon={ add } />
					Novo Post
				</button>
			</div>
			<h3 className='font-bold text-xl text-white'>
				Todas as categorias
			</h3>
			<div className='mt-2 flex flex-col'>
				{ categories &&
						categories.map((cat, i) => (
							<Link
									key={i}
									className='flex items-center gap-x-2 text-white'
									to={'/forum/feed?search=' + cat.name }>
								<IonIcon icon={ arrowForward } />
								{ cat.name }
							</Link>
						))
				}
			</div>
		</aside>
	)
}