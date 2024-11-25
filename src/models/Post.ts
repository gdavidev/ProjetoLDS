import * as DTO from "@models/data/PostDTOs";
import User from "./User";

export default class Post {
  id: number;
  owner: User;
  name: string;
  lastUpdate: Date;
  likes: number
  content: string;
  comments: Comment[] = [];

  constructor(id?: number, owner?: User, name?: string, likes?: number, content?: string, lastUpdate?: Date) {
    this.id         = id          || 0;
    this.owner      = owner       || new User();
    this.name       = name        || '';
    this.likes      = likes       || 0;
    this.content    = content     || '';
    this.lastUpdate = lastUpdate  || new Date();
  }

  toCreateDTO(): DTO.PostCreateDTO {
    return { nome: this.name }
  }

  toUpdateDTO(): DTO.PostUpdateDTO {
    return {
      id: this.id,
      nome: this.name,
    }
  }

  toDeleteDTO(): DTO.PostDeleteDTO {
    return { id: this.id }
  }

  static fromGetDTO(dto: DTO.PostGetResponseDTO): Post {
    return new Post(
      dto.id,
      undefined,
      dto.nome,
      dto.likes,
      dto.content,
      dto.lastUpdate
    )
  }
}