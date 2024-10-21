import * as DTO from "@/models/CategoryDTOs";
import Category from "@models/Category";
import ApiService, { Endpoints } from "./ApiService";

export default class CategoryApiClient {
  private apiService: ApiService;
  private static endpoints: Endpoints = {
    get: 'api/categorias/',
    post: 'api/categorias/create/',
    put: 'api/categorias/update/',
    delete: 'api/categorias/delete/',
  };

  constructor(token?: string) {
    this.apiService = new ApiService(CategoryApiClient.endpoints, token)
  }

  async getAll(): Promise<Category[]> {
    const data: DTO.CategoryGetResponseDTO[] = await this.apiService.getAll<DTO.CategoryGetResponseDTO>();
    const categories: Category[] = data.map(dto => Category.fromGetDTO(dto));
    return categories;
  }

  async get(id: number): Promise<Category> {
    const data: DTO.CategoryGetResponseDTO = await this.apiService.get<DTO.CategoryGetResponseDTO>(id);
    const category = Category.fromGetDTO(data);
    return category;
  }  
  
  async store(category: Category): Promise<Category> {
    if (category.id === 0) {
      return await this.post(category);
    } else {
      await this.put(category);
      return category;
    }
  }

  public async delete(category: Category): Promise<void> {
    await this.apiService.delete<DTO.CategoryDeleteDTO, DTO.CategoryDeleteResponseDTO>(category.toDeleteDTO());
  }

  private async post(category: Category): Promise<Category> {
    const response: DTO.CategoryCreateResponseDTO = 
      await this.apiService.post<DTO.CategoryCreateDTO, DTO.CategoryCreateResponseDTO>(category.toCreateDTO());
    category.id = response.id;
    return category;
  }

  private async put(category: Category): Promise<void> {    
    await this.apiService.put<DTO.CategoryUpdateDTO, DTO.CategoryCreateResponseDTO>(category.toUpdateDTO());    
  }
}