import Post from "@/models/Post";
import PostContainer from "@apps/main/components/PostContainer";
import User from "@/models/User";
import userImageNotFound from '@/assets/media/user-image-not-found.webp'

export default function FeedPage() {
  const mockPostContainer: Post[] =
      Array(6).fill(
          new Post(
              0,
              new User(0, 'name', userImageNotFound),
              false,
              'Postname',
              'lorem inpsum'
          )
      )
  
  return(
      <div className="flex flex-col gap-y-16">
        <PostContainer title="Suporte" posts={ mockPostContainer } />
        <PostContainer title="Games" posts={ mockPostContainer } />
      </div>
  )
}