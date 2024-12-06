import Post from "@/models/Post"
import { Link } from 'react-router-dom';

type PostRowProps = {
	post: Post
}

export default function PostRow(props: PostRowProps) {
	return (
		<tr className='block py-0.5 px-1 border-b-[1px] bg-[#5E5E5E] border-white'>
			<td className='flex justify-between align-middle'>
				<div className="flex flex-col justify-between">
					<Link to={'/forum/post/' + props.post.id}>
						<h3 className="font-bold text-lg">{props.post.title}</h3>
					</Link>
					<span>{props.post.content}</span>
				</div>
				<span>{props.post.updatedDate.toDateString()}</span>
			</td>
		</tr>
	)
}