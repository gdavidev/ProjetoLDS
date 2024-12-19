import Post from "@/models/Post";
import PostContainer from "@apps/main/components/PostContainer";
import User from "@/models/User";

export default function FeedPage() {
  const mockPostContainer: Post[] =
      Array(15).fill(new Post(0, new User(0, 'name'), false, 'postname', 'lorem inpsum'))
  
  return(
    <PostContainer title="Suporte" posts={ mockPostContainer } />
  )
}