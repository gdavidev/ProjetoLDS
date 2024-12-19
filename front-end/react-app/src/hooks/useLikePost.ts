import ApiService from "@/api/ApiService"
import { useMutation } from "react-query"
import { AxiosError } from 'axios';

type UseLikePostOptions = {
  onSuccess?: (_: unknown, variables: UseLikePostVariables) => void,
  onError?: (err: AxiosError | Error) => void
}

type UseLikePostVariables = {
  currentState: boolean,
  postId: number,
  userId: number
}

const postEndPoints = {
  like: '/topicos/like',
  unlike: '/topicos/unlike'
}

export function useLikePost(options?: UseLikePostOptions) {
  return useMutation('TOGGLE_LIKE_POST',
    async (variables: UseLikePostVariables) => {
      const targetEndpoint: string = variables.currentState ? postEndPoints.like : postEndPoints.unlike;
      return ApiService.post(targetEndpoint, {
        id_topico: variables.postId,
        id_user: variables.userId,
      })
    }, {
    onSuccess: options?.onSuccess,
    onError: options?.onError
  }
  )
}

