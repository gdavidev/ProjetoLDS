import GameApiService from '@/api/GameApiService';
import Game from '@models/Game';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from 'react-query';

type UseGameOptions<T> = { 
  onSuccess?: (data: T) => void;
  onError?: (err: AxiosError | Error) => void;
}

export default function useGames(options?: UseGameOptions<Game[]> & { enabled?: boolean }): UseQueryResult<Game[]> {
  return useQuery('FETCH_GAMES', {
    queryFn: async () => await GameApiService.getAll(),
    enabled: options ? options.enabled ?? true : true,
    ...options
  });
}

export function useGame(id: number, options?: UseGameOptions<Game> & { enabled?: boolean }): UseQueryResult<Game> {
  return useQuery(['FETCH_GAME', id], {
    queryFn: async () => await GameApiService.get(id),
    enabled: options ? options.enabled ?? true : true,
    ...options,
  });
}

export function useStoreGame(token: string, options?: UseGameOptions<Game>) {
  return useMutation('MUTATE_GAME',
      async (game: Game) =>  await GameApiService.store(game, token), {
      ...options
    });
}

export function useDeleteGame(token: string, options?: UseGameOptions<Game>) {
  return useMutation('DELETE_GAME',
      async (game: Game) => await GameApiService.delete(game, token), {
        onSuccess: (_: any, game: Game) => options?.onSuccess?.(game),
        onError: options?.onError,
      });
}

export function useSearchGames(options?: UseGameOptions<Game[]>) {
  return useMutation('SEARCH_GAME',
      async (search: string) => await GameApiService.search(search), {
        ...options
      });
}