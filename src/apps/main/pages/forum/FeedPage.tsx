import Post from "@/models/Post";
import PostContainer from "../../components/PostContainer";

export default function FeedPage() {
  const mockPostContainer: Post[] = [ new Post(0, 'aaa') ]
  const posts = mockPostContainer.map(p => <PostContainer post={ p } />)
  
  return(
    <div className="flex col-gap-2">
      <div className="sticky">
      </div>
      <div>
        { posts }
      </div>
      <div>
      </div>
    </div>
  )
}