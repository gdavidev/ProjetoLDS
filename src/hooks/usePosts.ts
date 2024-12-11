import PostApiService from "@/api/PostApiService";
import Post from "@models/Post"
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";
import * as DTO from "@models/data/PostDTOs";

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

export function useCreatePost(token: string, options: UsePostsOptions<Post>) {
  return useMutation('CREATE_POST',
        async (dto: DTO.PostCreateDTO) => {
          const res: DTO.PostGetResponseDTO = await PostApiService.create(dto, token)
          return Post.fromGetDTO(res);
        }, {
        ...options
      });
}

export function useUpdatePost(token: string, options: UsePostsOptions<Post>) {
  return useMutation('UPDATE_POST',
        async (dto: DTO.PostUpdateDTO) => {
          const res: DTO.PostGetResponseDTO = await PostApiService.update(dto, token);
          return Post.fromGetDTO(res)
        }, {
        ...options
      });
}