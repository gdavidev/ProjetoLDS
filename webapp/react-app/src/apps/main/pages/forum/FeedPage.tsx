import PostContainer from '@apps/main/components/PostContainer';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import Loading from '@shared/components/Loading.tsx';
import Category from '@models/Category.ts';
import usePosts, { useSearchPosts } from '@/hooks/usePosts.ts';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import Post from '@models/Post.ts';
import { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import SearchBar from '@shared/components/formComponents/SearchBar.tsx';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';

type FeedPageParams = {
  search: string;
}

export default function FeedPage() {
  const { params, setParams, clearParams } = useTypeSafeSearchParams<FeedPageParams>({ search: '' });
  const { user } = useCurrentUser();
  const [ postsByCategory, setPostsByCategory ] = useState<{ category: Category, posts: Post[] }[] | null>(null);
  const { exit } = useEmergencyExit();

  const { reFetchPosts, isPostsLoading } = usePosts(user?.token, {
    onSuccess: (posts: Post[]) => setPostsByCategory(getPostsByCategoryArray(posts)),
    onError: (err: AxiosError | Error) => handleRequestError(err),
    enabled: !params.search,
  });

  const { searchPosts, isSearchPostsLoading } = useSearchPosts(user?.token, {
    onSuccess: (posts: Post[]) => setPostsByCategory(getPostsByCategoryArray(posts)),
    onError: (err: AxiosError | Error) => handleRequestError(err)
  });

  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
    onError: (message: string) => exit('/', message)
  });

  useEffect(() => {
    if (params.search)
      searchPosts(params.search);
  }, [params.search]);

  return(
      <>
        <SearchBar
            onSearch={ (text: string) => {
              setParams('search', text);
              searchPosts(text);
            }}
            onErase={ async () => {
              clearParams();
              await reFetchPosts();
            }}
            isLoading={ isSearchPostsLoading || isPostsLoading }
            defaultValue={ params.search }
        />

        <div className="flex flex-col">
          {!postsByCategory ?
              <Loading className='mt-[20vh]' /> :
              postsByCategory.map((postsByCategoryNode: { category: Category, posts: Post[] }, i: number) => (
                  <PostContainer
                      key={i}
                      category={postsByCategoryNode.category}
                      title={postsByCategoryNode.category.name}
                      posts={postsByCategoryNode.posts}
                      onUpdate={ async () => {
                        setPostsByCategory(null);
                        if (params.search)
                          return searchPosts(params.search);
                        return await reFetchPosts();
                      }}
                  />
              ))
          }
        </div>
      </>
  )
}

function getPostsByCategoryArray(posts: Post[]): { category: Category, posts: Post[] }[] {
  // Get categories from posts
  const categories = posts.map(p => p.category);

  // Store uniq categories in uniqCategories
  const uniqCategories: Category[] = [];
  const seenCategoryIds: number[] = [];
  categories.forEach((cat: Category) => {
    if (!seenCategoryIds.includes(cat.id)) {
      seenCategoryIds.push(cat.id);
      uniqCategories.push(cat);
    }
  });

  // Push posts in its own category list
  const postsByCategory: { category: Category, posts: Post[] }[] = [];
  uniqCategories.forEach((cat: Category) => {
    postsByCategory.push({
      category: cat,
      posts: posts.filter(p => p.category.id === cat.id)
    });
  });

  return postsByCategory;
}