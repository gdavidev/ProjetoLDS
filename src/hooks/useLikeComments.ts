import ApiService from "@/api/ApiService"
import { useMutation } from "react-query"
import { AxiosError } from 'axios';

type UseLikeCommentOptions = {
  onSucess?: (_: any, varibles: UseLikeCommentVariables) => void,
  onError?: (err: AxiosError | Error) => void
}

type UseLikeCommentVariables = {
  currentState: boolean,
  targetId: number,
  token: string
}

const commentEndPoints = {
  like: '/comentarios/like',
  unlike: '/comentarios/unlike'
}

export function useLikeComment(options: UseLikeCommentOptions) {
  return useMutation('TOGGLE_LIKE_COMMENT',
    async (variables: UseLikeCommentVariables) => {
      const targetEndpoint: string = variables.currentState ? 
          commentEndPoints.like :
          commentEndPoints.unlike;

      return ApiService.post(targetEndpoint, {
        comentario_id: variables.targetId,
      },
      { headers: { 'Authorization': 'Bearer ' + variables.token } }
    )
    }, {
      onSuccess: options.onSucess,
      onError: options.onError
    }
  )
}