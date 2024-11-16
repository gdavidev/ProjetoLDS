import CategoryApiService from '@/api/CategoryApiService';
import Category from '@models/Category';
import { AxiosError } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";

type UseCategoriesOptions = { 
  onSuccess?: (categories: Category[]) => void,
  onError?: (err: AxiosError | Error) => void,
}
export default function useCategories(options: UseCategoriesOptions): UseQueryResult {
  return useQuery('FETCH_CATEGORIES', {
    queryFn: async () => await CategoryApiService.getAll(),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseCategoryOptions = { 
  onSuccess?: (category: Category) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useCategory(id: number, options: UseCategoryOptions): UseQueryResult {
  return useQuery('FETCH_CATEGORY', {
    queryFn: async () => await CategoryApiService.get(id),
    onSuccess: options.onSuccess,
    onError: options.onError
  });
}

type UseStoreCategoryOptions = { 
  onSuccess?: (category: Category) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useStoreCategory(token: string, options: UseStoreCategoryOptions) {
  return useMutation('MUTATE_CATEGORY',
      async (category: Category) => await CategoryApiService.store(category, token), {
      onSuccess: options.onSuccess,
      onError: options.onError
    });
}

type UseDeleteCategoryOptions = { 
  onSuccess?: (category: Category) => void,
  onError?: (err: AxiosError | Error) => void,
}
export function useDeleteCategory(token: string, options: UseDeleteCategoryOptions) {
  return useMutation('DELETE_CATEGORY',
      async (category: Category) => await CategoryApiService.delete(category, token), {
      onSuccess: (_: any, category: Category) => options.onSuccess?.(category),
      onError: options.onError
    });
}