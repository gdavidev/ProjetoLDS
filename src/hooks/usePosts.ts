import PostApiService from "@/api/PostApiService";
import Post from "@models/Post"
import { AxiosError } from 'axios';
import { useMutation, useQuery } from "react-query";
import * as DTO from "@models/data/PostDTOs";
import { useCallback } from 'react';

type UsePostsOptions<T> = { 
  onSuccess?: (data: T) => void,
  onError?: (err: AxiosError | Error) => void
}

export default function usePosts(options: UsePostsOptions<Post[]>) {
  const { data: posts, refetch: reFetchPosts, isLoading: isPostsLoading, ...rest } =
      useQuery('FETCH_POSTS', {
        queryFn: async () => await PostApiService.getAll(),
        ...options
      });
  return { posts, reFetchPosts, isPostsLoading, ...rest };
}

export function usePost(id: number, options: UsePostsOptions<Post>) {
  const { data: post, refetch: reFetchPost, isLoading: isPostLoading, ...rest } =
      useQuery('FETCH_POST', {
        queryFn: async () => await PostApiService.get(id),
        ...options
      });
  return { post, reFetchPost, isPostLoading, ...rest };
}

export function useCreatePost(token: string, options: UsePostsOptions<Post>) {
  const postPost = useCallback(async (post: Post) => {
    const res: DTO.PostGetResponseDTO = await PostApiService.create(post.toCreateDTO(), token)
    return Post.fromGetDTO(res);
  }, [])

  const { mutate: createPost, isLoading: isCreatePostLoading, ...rest } =
      useMutation('CREATE_POST',
          postPost,
          {...options}
      );
  return { createPost, isCreatePostLoading, ...rest };
}

export function useUpdatePost(token: string, options: UsePostsOptions<Post>) {
  const putPost = useCallback(async (post: Post) => {
    const res: DTO.PostGetResponseDTO = await PostApiService.update(post.toUpdateDTO(), token);
    return Post.fromGetDTO(res)
  }, [])

  const { mutate: updatePost, isLoading: isUpdatePostLoading, ...rest } =
      useMutation('UPDATE_POST',
          putPost,
          {...options}
      );
  return { updatePost, isUpdatePostLoading, ...rest };
}