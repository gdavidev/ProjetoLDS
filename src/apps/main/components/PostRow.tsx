import Post from "@/models/Post"
import { Link } from 'react-router-dom';
import useCurrentUser from '@/hooks/useCurrentUser';
import DateFormatter from '@libs/DateFormatter.ts';
import { ReportContentType } from '@models/Report.ts';
import PostActionBar from '@apps/main/components/PostActionBar.tsx';

type PostRowProps = {
	post: Post
	onReportClick: (contentType: ReportContentType, contentId: number) => void
	onLikeClick: (post: Post) => void
	onAnswerClick: (targetPostId: number) => void
	onBanClick: (userId: number) => void
	onExcludeClick: (post: Post) => void
}

export default function PostRow(props: PostRowProps) {
	const { user } = useCurrentUser();

	return (
			<div className="flex gap-x-4 items-start grow">
				<div className='w-10 h-10 overflow-hidden rounded-full'>
					<img
							src={ props.post.owner.profilePic.toDisplayable() }
							className='object-cover h-full min-w-10'
							alt="post-owner" />
				</div>
				<div className="flex flex-col justify-between grow">
					<span className='flex gap-x-1 items-center text-gray-500 text-xs h-2'>
						{props.post.owner.name}
						<span className='text-sm'>&#8226;</span>
						{ DateFormatter.relativeDate(props.post.updatedDate) }
					</span>
					<Link to={'/forum/post/' + props.post.id}>
						<h3 className="line-clamp-1 underline font-bold text-lg">{ props.post.title }</h3>
					</Link>
					<p className="line-clamp-2 whitespace-pre">{ props.post.content }</p>

					<PostActionBar
							className='mt-1'
							userIsPostOwner={ user?.id === props.post.owner.id }
							user={ user }
							isLiked={ props.post.hasLiked }
							likeCount={ props.post.likeCount }
							commentCount={ props.post.commentCount }
							onLikeClick={ () => props.onLikeClick(props.post) }
							onAnswerClick={ () => props.onAnswerClick(props.post.id) }
							onReportClick={ () => props.onReportClick(ReportContentType.POST, props.post.id) }
							onBanClick={ () => props.onBanClick(props.post.owner.id) }
							onExcludeClick={ () => props.onExcludeClick(props.post) }
					/>
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
			</div>
	);
}