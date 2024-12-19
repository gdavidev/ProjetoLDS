import EmulatorApiService from '@/api/EmulatorApiService';
import Emulator from '@models/Emulator';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UseEmulatorsOptions<T> = {
  onSuccess?: (emulators: T) => void,
  onError?: (err: AxiosError | Error) => void,
  staleTime?: number,
  enabled?: boolean,
}

export default function useEmulators(options?: UseEmulatorsOptions<Emulator[]>, deps?: any[]): UseQueryResult<Emulator[]> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_EMULATORS' : ['FETCH_EMULATORS', ...deps],
    queryFn: async () => await EmulatorApiService.getAll(),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

export function useEmulator(id: number, options?: UseEmulatorsOptions<Emulator>, deps?: any[]): UseQueryResult<Emulator> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_EMULATOR' : ['FETCH_EMULATOR', ...deps],
    queryFn: async () => await EmulatorApiService.get(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

export function useStoreEmulator(token: string, options?: UseEmulatorsOptions<Emulator>) {
  return useMutation('MUTATE_EMULATOR',
      async (emulator: Emulator) => await EmulatorApiService.store(emulator, token), {
      onSuccess: options?.onSuccess,
      onError: options?.onError
    });
}

export function useDeleteEmulator(token: string, options?: UseEmulatorsOptions<Emulator>) {
  return useMutation('DELETE_EMULATOR',
      async (emulator: Emulator) => await EmulatorApiService.delete(emulator, token), {
      onSuccess: (_: any, emulator: Emulator) => options?.onSuccess?.(emulator),
      onError: options?.onError
    });
}