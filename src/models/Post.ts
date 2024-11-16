import * as DTO from "@models/data/PostDTOs";

export default class Post {
  id: number;
  name: string;

  constructor(id?: number, name?: string) {
    this.id   = id    || 0;
    this.name = name  || "";
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
      dto.nome,
    )
  }
}