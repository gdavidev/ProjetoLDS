import Post from "@/models/Post"
import { Link } from 'react-router-dom';
import LikeButton from '@apps/main/components/LikeButton.tsx';
import { useCallback, useState } from 'react';
import { useLikePost } from '@/hooks/useLikePost.ts';

type PostRowProps = {
	post: Post
}

export default function PostRow(props: PostRowProps) {
	const [ isLiked, setLiked ] = useState<boolean>(props.post.hasLiked);
	const { mutate: toggleLike } = useLikePost({
		onError: () => setLiked(props.post.hasLiked)
	});

	const handleToggleLike = useCallback(() => {
		toggleLike({
			currentState: isLiked,
			postId: props.post.id,
			userId: props.post.owner.id,
		});
		setLiked(li => !li)
	}, [isLiked, props.post])

	return (
		<tr className='block py-0.5 px-1'>
			<td className='flex justify-between align-middle'>
				<div className="flex gap-x-4 items-center">
					<div className='max-w-10 max-h-10 overflow-hidden rounded-full'>
						<img
								src={ props.post.owner.profilePic.toDisplayable() }
								className='object-cover h-full'
								alt="post-owner" />
					</div>
					<div className="flex flex-col justify-between">
						<Link to={'/forum/post/' + props.post.id}>
							<h3 className="font-bold text-lg">{props.post.title}</h3>
						</Link>
						<span>Por {props.post.owner.name}: {props.post.content}</span>
					</div>
				</div>
				<div className="flex gap-x-1 items-center">
					<div className="flex flex-col justify-between h-full">
						<span>{props.post.updatedDate.toDateString()}</span>
						<span>{props.post.createdDate.toDateString()}</span>
					</div>
					<LikeButton
							onClick={handleToggleLike}
							checked={isLiked}
					/>
				</div>
			</td>
		</tr>
	)
}