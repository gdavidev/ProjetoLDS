import Post from '@/models/Post';
import PostContainer from '@apps/main/components/PostContainer';
import User from '@/models/User';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import Loading from '@shared/components/Loading.tsx';
import Category from '@models/Category.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';

export default function FeedPage() {
  const { exit } = useEmergencyExit();
  const { data: categories, isLoading } = useCategories(CategoryType.POSTS, {
    onError: () => exit('/', 'Erro ao carregar posts.')
  });

  const mockPostContainer: Post[] =
      Array(3).fill(new Post(
          'Postname',
          new User(0, 'Name usuer'),
          new Category(8, 'Emuladores'),
          'lorem inpsumaaaaaaaaaaaaaaaaa sdad wwasaw as daw dasd aw sad as dwad asd awd asd aw dasd aws daw asd asd awd asdasdsdsada wda s dsadsad a dwasdsadas awd asdsad wad',
          ['item', 'hardware', 'emulador'],
          new Thumbnail({ url: '/backgrounds/login-page.png' }),
          0,
          false,
          new Date(Date.now() + 30 * 60 * 60 * 1000),
          new Date(Date.now() + 40 * 60 * 60 * 1000),
      ))

  if (isLoading)
    return <Loading />;
  return(
      <div className="flex flex-col gap-y-16">
        { categories &&
            categories.map(((category: Category, i: number) => (
                <PostContainer
                    key={ i }
                    title={ category.name }
                    posts={ mockPostContainer }
                    category={ category } />
            )))
        }
      </div>
  )
}