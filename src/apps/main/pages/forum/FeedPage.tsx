import PostContainer from '@apps/main/components/PostContainer';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import Loading from '@shared/components/Loading.tsx';
import Category from '@models/Category.ts';
import usePosts from '@/hooks/usePosts.ts';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import Post from '@models/Post.ts';
import { useState } from 'react';

export default function FeedPage() {
  const [ postsByCategory, setPostsByCategory] =
      useState<{ category: Category, posts: Post[] }[] | null>(null);
  const { exit } = useEmergencyExit();

  const { isPostsLoading } = usePosts({
    onSuccess: (posts: Post[]) => {
      setPostsByCategory(getPostsByCategoryArray(posts));
    },
    onError: (err: AxiosError | Error) => handleRequestError(err)
  })

  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
    onError: (message: string) => exit('/', message)
  });

  if (isPostsLoading || !postsByCategory)
    return <Loading />
  return(
      <div className="flex flex-col gap-y-16">
        { postsByCategory &&
            postsByCategory.map((postsByCategoryNode: { category: Category, posts: Post[] }, i: number) => (
                <PostContainer
                    key={ i }
                    category={ postsByCategoryNode.category }
                    title={ postsByCategoryNode.category.name }
                    posts={ postsByCategoryNode.posts }
                />
            ))
        }
      </div>
  )
}

function getPostsByCategoryArray(posts: Post[]): { category: Category, posts: Post[] }[] {
  // Get categories
  const categories = posts.map(p => p.category);

  // Store uniq categories in uniqCategories
  const uniqCategories: Category[] = [];
  const seenCategoryIds: number[] = [];
  categories.forEach((cat: Category) => {
    if (!(cat.id in seenCategoryIds)) {
      seenCategoryIds.push(cat.id);
      uniqCategories.push(cat);
    }
  })

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