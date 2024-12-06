import Post from '@/models/Post';
import PostContainer from '@apps/main/components/PostContainer';
import User from '@/models/User';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import Loading from '@shared/components/Loading.tsx';

export default function FeedPage() {
  const { exit } = useEmergencyExit();
  const { data: categories, isLoading } = useCategories(CategoryType.POSTS, {
    onError: () => exit('/', 'Erro ao carregar posts.')
  });

  const mockPostContainer: Post[] =
      Array(3).fill(new Post(0, new User(0, 'name'), false, 'Postname', 'lorem inpsum'))

  if (isLoading)
    return <Loading />;

  return(
      <div className="flex flex-col gap-y-16">
        { categories &&
            categories.map(category => (
                <PostContainer title={category.name} posts={ mockPostContainer } />
            ))
        }
      </div>
  )
}