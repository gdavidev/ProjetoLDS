import PostApiService from "@/api/PostApiService";
import Post from "@models/Post"
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UsePostsOptions<T> = { 
  onSuccess?: (data: T) => void,
  onError?: (err: AxiosError | Error) => void
}

export default function usePosts(options: UsePostsOptions<Post[]>): UseQueryResult<Post[]> {
  return useQuery('FETCH_POSTS', {
    queryFn: async () => await PostApiService.getAll(),
    ...options
  });
}

export function usePost(id: number, options: UsePostsOptions<Post>): UseQueryResult<Post> {
  return useQuery('FETCH_POST', {
    queryFn: async () => await PostApiService.get(id),
    ...options
  });
}

export function useStorePost(token: string, options: UsePostsOptions<Post>) {
  return useMutation('MUTATE_POST',
      async (post: Post) =>  await PostApiService.store(post, token), {
        ...options
    });
}