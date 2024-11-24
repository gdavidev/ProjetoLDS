import ApiService from "@/api/ApiService"
import { useMutation } from "react-query"
import { AxiosError } from 'axios';

type UseLikePostOptions = {
  onSucess?: (_: any, varibles: UseLikePostVariables) => void,
  onError?: (err: AxiosError | Error) => void
}

type UseLikePostVariables = {
  currentState: boolean,
  targetId: number,
  userId: number
}

const postEndPoints = {
  like: '/topicos/like',
  unlike: '/topicos/unlike'
}


export function useLikePost(options: UseLikePostOptions) {
  return useMutation('TOGGLE_LIKE_POST',
    async (variables: UseLikePostVariables) => {
      const targetEndpoint: string = variables.currentState ? postEndPoints.like : postEndPoints.unlike;
      return ApiService.post(targetEndpoint, {
        id_topico: variables.targetId,
        id_user: variables.userId,
      })
    }, {
      onSuccess: options.onSucess,
      onError: options.onError
    }
  )
}

