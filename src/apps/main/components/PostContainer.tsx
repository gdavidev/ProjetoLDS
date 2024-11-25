import Post from "@/models/Post"
import PostRow from "./PostRow"

type PostContainerProps = {
  title: string,
  posts: Post[],
}

export default function PostContainer(props: PostContainerProps) {
  const posts: JSX.Element[] = props.posts.map(post => <PostRow post={ post } />)

  return (
    <div className="bg-white rounded-sm w-full">
      <h2 className="">{ props.title }</h2>
      <div>
        { posts }
      </div>     
    </div>
  )
}