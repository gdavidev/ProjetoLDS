import ApiService from "@/api/ApiService"
import { useMutation } from "react-query"
import { AxiosError } from 'axios';
import { useCallback } from 'react';
import Comment from '@models/Comment.ts';

type UseLikeCommentOptions = {
  onSuccess?: (_: any, variables: UseLikeCommentVariables) => void,
  onError?: (err: AxiosError | Error) => void
}

type UseLikeCommentVariables = {
  newState: boolean,
  comment: Comment,
}

const commentEndPoints = {
  like: '/api/comentarios/like/',
  unlike: '/api/comentarios/unlike/'
}

export function useLikeComment(token: string, options?: UseLikeCommentOptions) {
  const postLikeComment = useCallback(async (target: UseLikeCommentVariables) => {
    if (target.newState) {
      await ApiService.post(
          commentEndPoints.like,
          { id_comentario: target.comment.id },
          { headers: { 'Authorization': 'Bearer ' + token } }
      );
    } else {
      await ApiService.delete(
          commentEndPoints.unlike, {
            params: { id_comentario: target.comment.id },
            headers: { 'Authorization': 'Bearer ' + token }
          });
    }
    return target.newState;
  }, []);

  const { mutate: likeComment, isLoading: isLikeCommentLoading, ...rest } =
      useMutation('TOGGLE_LIKE_COMMENT', postLikeComment, {...options});
  return { likeComment, isLikeCommentLoading, ...rest };
}