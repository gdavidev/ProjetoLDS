import Category from '@models/Category';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from "react-query";
import * as DTO from '@models/data/CategoryDTOs.ts';
import ApiService from '@api/ApiService.ts';
import { useCallback } from 'react';

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

function useCategories(
    categoryType: CategoryType,
    options?: UseCategoriesOptions<Category[]>,
    deps?: any[]
): UseQueryResult<Category[]>
{
  const query = useCallback(async () => {
    const res: AxiosResponse<DTO.CategoryGetResponseDTO[]> =
        await ApiService.get(endpoints[categoryType].get);
    return res.data.map(dto => Category.fromGetDTO(dto));
  }, []);

  const resolvedDeps: any[] = deps === undefined ?
      ['FETCH_CATEGORIES', categoryType] :
      ['FETCH_CATEGORIES', categoryType, ...deps];

  return useQuery({
    queryKey: resolvedDeps,
    queryFn: query,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

function useCategory(
    categoryType: CategoryType,
    id: number,
    options?: UseCategoriesOptions<Category>,
    deps?: any[]
): UseQueryResult<Category>
{
  const query = useCallback(async () => {
    const res: AxiosResponse<DTO.CategoryGetResponseDTO> =
        await ApiService.get(endpoints[categoryType].get, {
          data: { id: id }
        });
    return Category.fromGetDTO(res.data);
  }, [])

  const resolvedDeps: any[] = deps === undefined ?
          ['FETCH_CATEGORY', categoryType] :
          ['FETCH_CATEGORY', categoryType, ...deps];

  return useQuery({
    queryKey: resolvedDeps,
    queryFn: query,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000 // five minutes
  });
}

export default useCategories;
export { useCategory };