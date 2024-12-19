import Category from '@models/Category';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from "react-query";
import * as DTO from '@models/data/CategoryDTOs.ts';
import ApiService from '@api/ApiService.ts';

export enum CategoryType {
  GAMES,
  POSTS,
}

type UseCategoriesOptions<T> = {
  onSuccess?: (categories: T) => void,
  onError?: (err: AxiosError | Error) => void,
  staleTime?: number,
  enabled?: boolean,
}

const endpoints = {
  [CategoryType.GAMES]: {
    get: 'api/categorias/',
  },
  [CategoryType.POSTS]: {
    get: 'api/topicos/categorias/',
  }
};

function useCategories(categoryType: CategoryType, options?: UseCategoriesOptions<Category[]>,deps?: any[]): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: resolveDependencyArray('FETCH_CATEGORIES', categoryType, deps),
    queryFn: async () => {
      const res: AxiosResponse<DTO.CategoryGetResponseDTO[]> = await ApiService.get(endpoints[categoryType].get);
      return res.data.map(dto => Category.fromGetDTO(dto));
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

function useCategory(categoryType: CategoryType, id: number, options?: UseCategoriesOptions<Category>, deps?: any[]): UseQueryResult<Category> {
  return useQuery({
    queryKey: resolveDependencyArray('FETCH_CATEGORY', categoryType, deps),
    queryFn: async () => {
      const res: AxiosResponse<DTO.CategoryGetResponseDTO> = await ApiService.get(endpoints[categoryType].get, { data: { id: id } });
      return Category.fromGetDTO(res.data);
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

function resolveDependencyArray(queryKey: string, categoryType: CategoryType, deps?: any[]): any[] {
  const resolvedQueryKey = queryKey + categoryType.toString();
  return deps === undefined ?
      [resolvedQueryKey, categoryType] :
      [resolvedQueryKey, categoryType, ...deps];
}

export default useCategories;
export { useCategory };