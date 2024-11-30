import GameApiService from '@/api/GameApiService';
import Game from '@models/Game';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from 'react-query';
import useEmulators, { useEmulator } from '@/hooks/useEmulators.ts';
import useCategories, { CategoryType, useCategory } from '@/hooks/useCategories.ts';

type UseGameOptions<T> = { 
  onSuccess?: (data: T) => void,
  onError?: (err: AxiosError | Error) => void
}

export default function useGames(options?: UseGameOptions<Game[]>): UseQueryResult<Game[]> {
  const { data: emulators  } = useEmulators({
    onError: options?.onError,
  });
  const { data: categories } = useCategories(CategoryType.GAMES, {
    onError: options?.onError,
  });

  return useQuery({
    queryKey: ['FETCH_GAMES', emulators, categories], // dependencies
    queryFn: async () => await GameApiService.getAll(emulators, categories),
    ...options
  });
}

export function useGame(id: number, options?: UseGameOptions<Game>): UseQueryResult<Game> {
  const gameQuery = useQuery('FETCH_GAME', {
    queryFn: async () => await GameApiService.get(id),
    ...options
  });
  if (gameQuery.isError || !gameQuery.data)
    return gameQuery;

  const { data: emulator, isError: emIsError } = useEmulator(gameQuery.data.emulator.id, {
    onError: options?.onError,
  }, [gameQuery.isSuccess]);
  const { data: category, isError: catIsError } = useCategory(CategoryType.GAMES, gameQuery.data.category.id, {
    onError: options?.onError,
  }, [gameQuery.isSuccess]);

  if (!emIsError && emulator)
    gameQuery.data.emulator = emulator;
  if (!catIsError && category)
    gameQuery.data.category = category;

  return gameQuery
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
      onError: options?.onError
    });
}