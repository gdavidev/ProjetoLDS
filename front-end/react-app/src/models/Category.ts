import * as DTO from "@models/data/CategoryDTOs";

export default class Category {
  id: number;
  name: string;

  constructor(id?: number, name?: string) {
    this.id   = id    || 0;
    this.name = name  || "";
  }

  toCreateDTO(): DTO.CategoryCreateDTO {
    return { nome: this.name }
  }

  toUpdateDTO(): DTO.CategoryUpdateDTO {
    return {
      id: this.id,
      nome: this.name,
    }
  }

  toDeleteDTO(): DTO.CategoryDeleteDTO {
    return { id: this.id }
  }

  static fromGetDTO(dto: DTO.CategoryGetResponseDTO): Category {
    return new Category(
      dto.id,
      dto.nome,
    )
  }
}