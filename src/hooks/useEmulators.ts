import EmulatorApiService from '@/api/EmulatorApiService';
import Emulator from '@models/Emulator';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UseEmulatorsOptions = { 
  onSuccess?: (emulators: Emulator[]) => void,
  onError?: (err: AxiosError | Error) => void,
}
export default function useEmulators(options: UseEmulatorsOptions): UseQueryResult {
  return useQuery('FETCH_EMULATORS', {
    queryFn: async () => await EmulatorApiService.getAll(),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseEmulatorOptions = { 
  onSuccess?: (emulator: Emulator) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useEmulator(id: number, options: UseEmulatorOptions): UseQueryResult {
  return useQuery('FETCH_EMULATOR', {
    queryFn: async () => await EmulatorApiService.get(id),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseStoreEmulatorOptions = { 
  onSuccess?: (emulator: Emulator) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useStoreEmulator(token: string, options: UseStoreEmulatorOptions) {
  return useMutation('MUTATE_EMULATOR',
      async (emulator: Emulator) => await EmulatorApiService.store(emulator, token), {
      onSuccess: options.onSuccess,
      onError: options.onError
    });
}

type UseDeleteEmulatorOptions = { 
  onSuccess?: (emulator: Emulator) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useDeleteEmulator(token: string, options: UseDeleteEmulatorOptions) {
  return useMutation('DELETE_EMULATOR',
      async (emulator: Emulator) => await EmulatorApiService.delete(emulator, token), {
      onSuccess: (_: any, emulator: Emulator) => options.onSuccess?.(emulator),
      onError: options.onError
    });
}