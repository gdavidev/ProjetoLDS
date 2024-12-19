import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import CheckBox from '@shared/components/formComponents/CheckBox.tsx';
import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';

export default function ForumSidebar() {
	const navigate = useNavigate();
	const { data: categories } = useCategories(CategoryType.POSTS);

	return (
		<aside className="min-w-72 flex flex-col px-2 pt-10 pb-4 bg-layout-background">
			<div className='flex justify-between'>
				<Link to='/forum/feed'>
					<h2 className='font-bold text-2xl text-white'>
						Forum
					</h2>
				</Link>
				<button
						className='btn-r-md bg-primary text-white'
						onClick={ () => navigate('/forum/post/new') }>
					<IonIcon icon={ add } />
					Novo Post
				</button>
			</div>
			<h3 className='font-bold text-xl text-white'>
				Todas as categorias
			</h3>
			<div>
				{ categories &&
						categories.map((cat, i) => (
							<CheckBox
								key={i}
								name={cat.name}
								label={cat.name}
							/>
						))
				}
			</div>
		</aside>
	)
}