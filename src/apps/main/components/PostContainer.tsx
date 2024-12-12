import Post from "@/models/Post"
import PostRow from "./PostRow"
import { Link } from 'react-router-dom';
import Category from '@models/Category.ts';

type PostContainerProps = {
  title: string,
  posts: Post[],
  category: Category,
}

export default function PostContainer(props: PostContainerProps) {
  const posts: JSX.Element[] = props.posts.map((post, i) => <PostRow key={i} post={ post } />)

  return (
      <div className='text-white flex flex-col w-full'>
        <h2 className='text-lg font-bold mb-2'>{props.title}</h2>
        <div className="ms-8 w-full font-poppins flex flex-col gap-y-3">
          {posts}
        </div>
        <Link
            className="underline text-primary-light text-lg self-end"
            to={ '/forum/feed?categoryId=' + props.category.id }>
          Ver mais...
        </Link>
      </div>
  )
}