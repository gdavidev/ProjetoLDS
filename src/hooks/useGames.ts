import GameApiService from "@/api/GameApiService";
import Game from "@models/Game"
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UseGamesOptions = { 
  onSuccess?: (games: Game[]) => void,
  onError?: (err: AxiosError | Error) => void
}
export default function useGames(options: UseGamesOptions): UseQueryResult {
  return useQuery('FETCH_GAMES', {
    queryFn: async () => await GameApiService.getAll(),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseGameOptions = { 
  onSuccess?: (game: Game) => void,
  onError?: (err: AxiosError | Error) => void
}
export function useGame(id: number, options: UseGameOptions): UseQueryResult {
  return useQuery('FETCH_GAME', {
    queryFn: async () => await GameApiService.get(id),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseStoreGameOptions = { 
  onSuccess?: (game: Game) => void,
  onError?: (err: AxiosError | Error) => void
}
export function useStoreGame(token: string, options: UseStoreGameOptions) {
  return useMutation('MUTATE_GAME',
      async (game: Game) =>  await GameApiService.store(game, token), {
      onSuccess: options.onSuccess,
      onError: options.onError
    });
}

type UseDeleteGameOptions = { 
  onSuccess?: (game: Game) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useDeleteGame(token: string, options: UseDeleteGameOptions) {
  return useMutation('DELETE_GAME',
      async (game: Game) => await GameApiService.delete(game, token), {
      onSuccess: (_: any, game: Game) => options.onSuccess?.(game),
      onError: options.onError
    });
}