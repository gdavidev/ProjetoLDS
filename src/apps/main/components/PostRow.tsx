import Post from "@/models/Post"
import LikeButton from "./LikeButton.tsx"
import { useLikePost } from "@/hooks/useLikePost"
import { useState } from "react"
import { Link } from 'react-router-dom';

type PostRowProps = {
	post: Post
}

export default function PostRow(props: PostRowProps) {
	const [ isLiked, setIsLiked ] = useState<boolean>(false)
	const { mutate: likePost } = useLikePost({
		onSuccess: () => setIsLiked(li => !li)
	})

	return (
		<div>
			<Link to={ '/forum/post/' + props.post.id }>
				<h3>{props.post.title}</h3>
			</Link>
			<span>{ props.post.content }</span>
			<LikeButton
				onClick={ () => likePost({
					currentState: isLiked,
					postId: props.post.id,
					userId: 1
				}) } />
		</div>
	)
}