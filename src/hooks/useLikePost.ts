import ApiService from "@/api/ApiService"
import { useMutation } from "react-query"
import { AxiosError } from 'axios';
import { useCallback } from 'react';
import Post from '@models/Post.ts';

type UseLikePostOptions = {
  onSuccess?: (_: unknown, variables: UseLikePostVariables) => void,
  onError?: (err: AxiosError | Error, variables: UseLikePostVariables) => void
}

export type UseLikePostVariables = {
  newState: boolean,
  post: Post
}

const postEndPoints = {
  like: '/api/topicos/like/',
  unlike: '/api/topicos/unlike/'
}

export function useLikePost(token: string, options?: UseLikePostOptions) {
  const postLikePost = useCallback(async (target: UseLikePostVariables) => {
    if (target.newState) {
      await ApiService.post(
          postEndPoints.like,
          { id_topico: target.post.id },
          { headers: { 'Authorization': 'Bearer ' + token } }
      );
    } else {
      await ApiService.delete(
          postEndPoints.unlike, {
          params: { topico_id: target.post.id },
          headers: { 'Authorization': 'Bearer ' + token }
      });
    }
    return target.newState;
  }, []);

  const { mutate: likePost, isLoading: isLikePostLoading, ...rest } =
      useMutation('TOGGLE_LIKE_POST', postLikePost, {...options});
  return { likePost, isLikePostLoading, ...rest }
}

