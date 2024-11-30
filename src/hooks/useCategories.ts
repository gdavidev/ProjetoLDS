import Category from '@models/Category';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, useQuery, UseQueryResult } from "react-query";
import * as DTO from '@models/data/CategoryDTOs.ts';
import ApiService from '@api/ApiService.ts';

export enum CategoryType {
  GAMES,
  POSTS,
}

const endpoints = {
  [CategoryType.GAMES]: {
    get: 'api/categorias/',
    post: 'api/categorias/create/',
    put: 'api/categorias/update/',
    delete: 'api/categorias/delete/',
  },
  [CategoryType.POSTS]: {
    get: 'api/topicos/categorias/',
    post: 'api/topicos/categorias/create/',
    put: 'api/topicos/categorias/update/',
    delete: 'api/topicos/categorias/delete/',
  }
};

type UseCategoriesOptions<T> = {
  onSuccess?: (categories: T) => void,
  onError?: (err: AxiosError | Error) => void,
}
export default function useCategories(categoryType: CategoryType, options?: UseCategoriesOptions<Category[]>, deps?: any[]): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_CATEGORIES' : ['FETCH_CATEGORIES', ...deps],
    queryFn: async () => {
      const res: AxiosResponse<DTO.CategoryGetResponseDTO[]> = await ApiService.get(endpoints[categoryType].get);
      return res.data.map(dto => Category.fromGetDTO(dto));
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}

export function useCategory(categoryType: CategoryType, id: number, options?: UseCategoriesOptions<Category>, deps?: any[]): UseQueryResult<Category> {
  return useQuery({
    queryKey: deps === undefined ? 'FETCH_CATEGORY' : ['FETCH_CATEGORY', ...deps],
    queryFn: async () => {
      const res: AxiosResponse<DTO.CategoryGetResponseDTO> =
          await ApiService.get(endpoints[categoryType].get, {
            data: { id: id }
          });
      return Category.fromGetDTO(res.data);
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}

export function useStoreCategory(categoryType: CategoryType, token: string, options?: UseCategoriesOptions<Category>) {
  return useMutation('MUTATE_CATEGORY',
      async (category: Category) => {
        if (category.id === 0) {
          const res: AxiosResponse<DTO.CategoryCreateResponseDTO> = await ApiService.post(
              endpoints[categoryType].post,
              category.toCreateDTO(),
              { headers: { 'Authorization': 'Bearer ' + token } }
          );
          category.id = res.data.id;
        } else {
          await ApiService.put(
              endpoints[categoryType].put,
              category.toUpdateDTO(),
              { headers: { 'Authorization': 'Bearer ' + token } }
          );
        }
        return category;
      }, {
      onSuccess: options?.onSuccess,
      onError: options?.onError
    });
}

export function useDeleteCategory(categoryType: CategoryType, token: string, options?: UseCategoriesOptions<Category>) {
  return useMutation('DELETE_CATEGORY',
      async (category: Category) => {
        await ApiService.delete(endpoints[categoryType].delete, {
          data: category.toDeleteDTO(),
          headers: { 'Authorization': 'Bearer ' + token }
        });
      }, {
      onSuccess: (_: any, category: Category) => options?.onSuccess?.(category),
      onError: options?.onError
    });
}