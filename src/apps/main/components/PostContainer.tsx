import Post from "@/models/Post"
import PostRow from "./PostRow"

type PostContainerProps = {
  title: string,
  posts: Post[],
}

export default function PostContainer(props: PostContainerProps) {
  const posts: JSX.Element[] = props.posts.map((post, i) => <PostRow key={i} post={ post } />)

  return (
      <div className='text-white'>
        <h2 className='text-lg font-bold mb-2'>{props.title}</h2>
        <table className="ms-3 w-full font-poppins">
          <tbody>
          {posts}
          </tbody>
        </table>
      </div>
  )
}