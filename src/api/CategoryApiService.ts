import * as DTO from "@/models/data/CategoryDTOs";
import Category from "@models/Category";
import ApiService from "./ApiService";
import { AxiosResponse } from 'axios'

export default class CategoryApiService {
  private static readonly endpoints = {
    get: 'api/categorias/',
    post: 'api/categorias/create/',
    put: 'api/categorias/update/',
    delete: 'api/categorias/delete/',
  };

  static async getAll(): Promise<Category[]> {
    const res: AxiosResponse<DTO.CategoryGetResponseDTO[]> = await ApiService.get(CategoryApiService.endpoints.get);
    return res.data.map(dto => Category.fromGetDTO(dto));     
  }

  static async get(id: number): Promise<Category> {
    const res: AxiosResponse<DTO.CategoryGetResponseDTO> = 
        await ApiService.get(CategoryApiService.endpoints.get, {
          data: {id: id}
        });
    return Category.fromGetDTO(res.data);
  }  

  public static async delete(category: Category, token: string): Promise<void> {
    await ApiService.delete(
        CategoryApiService.endpoints.delete,
        {
          data: category.toDeleteDTO(),
          headers: { 'Authorization': 'Bearer ' + token }
        }
      );
  }

  static async store(category: Category, token: string): Promise<Category> {
    if (category.id === 0) {
      return await this.post(category, token);
    } else {
      await this.put(category, token);
      return category;
    }
  }

  private static async post(category: Category, token: string): Promise<Category> {
    const res: AxiosResponse<DTO.CategoryCreateResponseDTO> = await ApiService.post(
        CategoryApiService.endpoints.post,
        category.toCreateDTO(),
        { headers: { 'Authorization': 'Bearer ' + token } }
      );
    category.id = res.data.id;
    return category;
  }

  private static async put(category: Category, token: string): Promise<void> {    
    await ApiService.put(
      CategoryApiService.endpoints.put,
      category.toUpdateDTO(),
      { headers: { 'Authorization': 'Bearer ' + token } }
    );    
  }
}