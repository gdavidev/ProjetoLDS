import EmulatorApiService from '@/api/EmulatorApiService';
import Emulator from '@models/Emulator';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UseEmulatorsOptions<T> = {
  onSuccess?: (emulators: T) => void,
  onError?: (err: AxiosError | Error) => void,
}

export default function useEmulators(options?: UseEmulatorsOptions<Emulator[]>, deps?: any[]): UseQueryResult<Emulator[]> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_EMULATORS' : ['FETCH_EMULATORS', ...deps],
    queryFn: () => EmulatorApiService.getAll(),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useEmulator(id: number, options?: UseEmulatorsOptions<Emulator>, deps?: any[]): UseQueryResult<Emulator> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_EMULATOR' + id : ['FETCH_EMULATOR' + id, ...deps],
    queryFn: () => EmulatorApiService.get(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useStoreEmulator(token: string, options?: UseEmulatorsOptions<Emulator>) {
  return useMutation('MUTATE_EMULATOR',
      (emulator: Emulator) => EmulatorApiService.store(emulator, token), {
      onSuccess: options?.onSuccess,
      onError: options?.onError
    });
}

export function useDeleteEmulator(token: string, options?: UseEmulatorsOptions<Emulator>) {
  return useMutation('DELETE_EMULATOR',
      (emulator: Emulator) => EmulatorApiService.delete(emulator, token), {
      onSuccess: (_: any, emulator: Emulator) => options?.onSuccess?.(emulator),
      onError: options?.onError
    });
}