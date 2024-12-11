import * as DTO from "@/models/data/PostDTOs";
import Post from "@models/Post";
import ApiService from "./ApiService";

export default class PostApiService {
  private static readonly endpoints = {
    get: 'api/topicos/list/',
    detail: 'api/topicos/details/',
    post: 'api/topicos/create/',
    put: 'api/topicos/update/',
    delete: 'api/topicos/delete/',
  };

  static async getAll(): Promise<Post[]> {
    const res  =
        await ApiService.get<DTO.PostGetResponseDTO[]>(PostApiService.endpoints.get);
    return res.data.map(dto => Post.fromGetDTO(dto));
  }

  static async get(id: number): Promise<Post> {
    const res =
        await ApiService.get<DTO.PostGetResponseDTO>(PostApiService.endpoints.detail, { data: {id: id} });
    return Post.fromGetDTO(res.data);
  }  
  
  public static async delete(post: Post, token: string): Promise<void> {
    await ApiService.delete(
      PostApiService.endpoints.delete,
      {
        data: { id: post.id },
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
  }

  public static async create(dto: DTO.PostCreateDTO, token: string): Promise<DTO.PostGetResponseDTO> {
    const res = await ApiService.post<DTO.PostGetResponseDTO>(
      PostApiService.endpoints.post,
      dto,
      { headers: { 'Authorization': 'Bearer ' + token } }
    );
    return res.data
  }

  public static async update(dto: DTO.PostUpdateDTO, token: string): Promise<DTO.PostGetResponseDTO> {
    const res = await ApiService.put<DTO.PostGetResponseDTO>(
      PostApiService.endpoints.put,
      dto,
      { headers: { 'Authorization': 'Bearer ' + token } }
    );
    return res.data
  }
}