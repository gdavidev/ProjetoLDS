import Post from "@/models/Post"
import LikeButton from "../pages/forum/LikeButton"
import { useLikePost } from "@/hooks/useLikePost"
import useCurrentUser from "@/hooks/useCurrentUser"
import { useState } from "react"

type PostRowProps = {
  post: Post
}

export default function PostRow(props: PostRowProps) {
  const [ isLiked, setIsLiked ] = useState<boolean>(false)
  const { user } = useCurrentUser()
  const { mutate: likePost } = useLikePost({
    onSucess: () => setIsLiked(li => !li)
  })

  return (
    <div>
      <h3>{ props.post.name }</h3>
      <span>{ props.post.name }</span>
      <LikeButton 
        onClick={ () => likePost({
          currentState: isLiked,
          targetId: props.post.id,
          userId: 1
        }) } />
    </div>
  )
}