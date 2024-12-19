import * as DTO from "@/models/data/PostDTOs";
import Post from "@models/Post";
import ApiService from "./ApiService";

export default class PostApiService {
  private static readonly endpoints = {
    get: 'api/post/',
    post: 'api/post/create/',
    put: 'api/post/update/',
    delete: 'api/post/delete/',
  };

  static async getAll(): Promise<Post[]> {
    const data: DTO.PostGetResponseDTO[] = await ApiService.get(PostApiService.endpoints.get);
    return data.map(dto => Post.fromGetDTO(dto));
  }

  static async get(id: number): Promise<Post> {
    const data: DTO.PostGetResponseDTO = 
        await ApiService.get(PostApiService.endpoints.get, { data: {id: id} });
    return Post.fromGetDTO(data);
  }  
  
  public static async delete(post: Post, token: string): Promise<void> {
    await ApiService.delete(
      PostApiService.endpoints.delete,
      {
        data: post.toDeleteDTO(),
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
  }

  static async store(post: Post, token: string): Promise<Post> {
    if (post.id === 0) {
      return await this.post(post, token);
    } else {
      await this.put(post, token);
      return post;
    }
  }

  private static async post(post: Post, token: string): Promise<Post> {
    const response: DTO.PostCreateResponseDTO = await ApiService.post(
      PostApiService.endpoints.post,
      post.toCreateDTO(),
      { headers: { 'Authorization': 'Bearer ' + token } }
    );
    post.id = response.id;
    return post;
  }

  private static async put(post: Post, token: string): Promise<void> {    
    await ApiService.put(
      PostApiService.endpoints.put,
      post.toUpdateDTO(),
      { headers: { 'Authorization': 'Bearer ' + token } }
    );    
  }
}