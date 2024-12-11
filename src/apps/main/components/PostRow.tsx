import Post from "@/models/Post"
import { Link } from 'react-router-dom';
import LikeButton from '@apps/main/components/LikeButton.tsx';
import { useCallback, useState } from 'react';
import { useLikePost } from '@/hooks/useLikePost.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import DateFormatter from '@libs/DateFormatter.ts';
import usePosts from '@/hooks/usePosts.ts';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { AxiosError } from 'axios';
import Loading from '@shared/components/Loading.tsx';

type PostRowProps = {
	post: Post
}

export default function PostRow(props: PostRowProps) {
	const { user, askToLogin } = useCurrentUser();
	const [ isLiked, setLiked ] = useState<boolean>(props.post.hasLiked);
	const { mutate: toggleLike } = useLikePost({
		onError: () => setLiked(props.post.hasLiked)
	});

	const handleToggleLike = useCallback(() => {
		if (!user)
			return askToLogin('É preciso estar logado para curtir posts.')

		toggleLike({
			currentState: isLiked,
			postId: props.post.id,
			token: user!.token,
		});
		setLiked(li => !li)
	}, [isLiked, props.post])

	return (
			<div className="flex gap-x-4 items-start grow">
				<div className='max-w-10 max-h-10 overflow-hidden rounded-full'>
					<img
							src={ props.post.owner.profilePic.toDisplayable() }
							className='object-cover h-full'
							alt="post-owner" />
				</div>
				<div className="flex flex-col justify-between grow">
					<span className='flex gap-x-1 items-center text-gray-500 text-xs h-2'>
						{props.post.owner.name}
						<span className='text-sm'>&#8226;</span>
						{ DateFormatter.relativeDate(props.post.updatedDate) }
					</span>
					<Link to={'/forum/post/' + props.post.id}>
						<h3 className="line-clamp-1 underline font-bold text-lg">{props.post.title}</h3>
					</Link>
					<p className="line-clamp-2">{props.post.content}</p>
				</div>
				{
						props.post.image &&
							<div className='flex justify-center min-w-16 size-16 mt-2 rounded-md overflow-hidden'>
								<img
									className='object-cover h-full'
									src={ props.post.image.toDisplayable() }
									alt={ props.post.title } />
							</div>
				}

				<LikeButton
						className='self-center'
						onClick={handleToggleLike}
						checked={isLiked}
				/>
			</div>
	)
}