import * as DTO from "@/models/data/PostDTOs";
import Post from "@models/Post";
import ApiService from "./ApiService";

export default class PostApiService {
  private static readonly endpoints = {
    get: 'api/topicos/list/',
    detail: 'api/topicos/detail/',
    search: 'api/topicos/search/',
    post: 'api/topicos/create/',
    put: 'api/topicos/update/',
    delete: 'api/topicos/delete/',
  };

  static async getAll(token?: string): Promise<Post[]> {
    const res  =
        await ApiService.get<DTO.PostGetResponseDTO[]>(PostApiService.endpoints.get, {
          headers: token !== undefined ? { 'Authorization': 'Bearer ' + token } : undefined
        });
    return res.data.map(dto => Post.fromGetDTO(dto));
  }

  static async get(id: number, token?: string): Promise<Post> {
    const res =
        await ApiService.get<DTO.PostGetResponseDTO>(PostApiService.endpoints.detail, {
          params: { topico_id: id },
          headers: token !== undefined ? { 'Authorization': 'Bearer ' + token } : undefined
        });
    return Post.fromGetDTO(res.data);
  }

  static async search(search: string, token?: string): Promise<Post[]> {
    const res =
        await ApiService.get<{ topicos: DTO.PostGetResponseDTO[] }>(PostApiService.endpoints.search, {
          params: { search: search },
          headers: token !== undefined ? { 'Authorization': 'Bearer ' + token } : undefined
        });
    return res.data.topicos.map(dto => Post.fromGetDTO(dto));
  }

  public static async delete(post: Post, token: string): Promise<void> {
    await ApiService.delete(
      PostApiService.endpoints.delete,
      {
        data: { topico_id: post.id },
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
  }

  public static async create(dto: DTO.PostCreateDTO, token: string): Promise<DTO.PostGetResponseDTO> {
    const res = await ApiService.post<DTO.PostGetResponseDTO>(
      PostApiService.endpoints.post,
      dto,
      { headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }}
    );
    return res.data
  }

  public static async update(dto: DTO.PostUpdateDTO, token: string): Promise<DTO.PostGetResponseDTO> {
    const res = await ApiService.put<DTO.PostGetResponseDTO>(
      PostApiService.endpoints.put,
      dto,
      { headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }}
    );
    return res.data
  }
}