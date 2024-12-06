import Post from "@/models/Post"
import PostRow from "./PostRow"

type PostContainerProps = {
  title: string,
  posts: Post[],
}

export default function PostContainer(props: PostContainerProps) {
  const posts: JSX.Element[] = props.posts.map((post, i) => <PostRow key={i} post={ post } />)

  return (
    <table className="text-white border-[1px] border-white w-full font-poppins">
      <thead>
        <tr className="block border-b-[1px] bg-[#4C4C4C] py-0.5 px-1.5 box-border text-left">
          <th className='text-lg'>{ props.title }</th>
        </tr>
      </thead>
      <tbody>
        {posts}
      </tbody>
    </table>
  )
}