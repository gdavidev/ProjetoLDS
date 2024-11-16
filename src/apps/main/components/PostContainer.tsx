import Post from "@/models/Post"

type PostContainerProps = {
  post: Post,
}

export default function PostContainer(props: PostContainerProps) {
  return (
    <div className="bg-white rounded-sm w-full">
      <h2 className="">{ props.post.name }</h2>
      <span className="">bbbbb</span>
    </div>
  )
}