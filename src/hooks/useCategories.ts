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
  });
}

function useCategory(categoryType: CategoryType, id: number, options?: UseCategoriesOptions<Category>, deps?: any[]): UseQueryResult<Category> {
  return useQuery({
    queryKey: resolveDependencyArray('FETCH_CATEGORY' + id, categoryType, deps),
    queryFn: async () => {
      const res: AxiosResponse<DTO.CategoryGetResponseDTO> = await ApiService.get(endpoints[categoryType].get, { data: { id: id } });
      return Category.fromGetDTO(res.data);
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

function resolveDependencyArray(queryKey: string, categoryType: CategoryType, deps?: any[]): any[] {
  // Dynamically change the query key based on categoryType to avoid mixing the cached values
  const resolvedQueryKey = queryKey + categoryType.toString();
  return deps === undefined ?
      [resolvedQueryKey, categoryType] :
      [resolvedQueryKey, categoryType, ...deps];
}

export default useCategories;
export { useCategory };