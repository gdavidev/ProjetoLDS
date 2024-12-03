import * as DTO from "@models/data/PostDTOs";
import User from "./User";
import Category from '@models/Category.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';

export default class Post {
  id: number;
  owner: User;
  title: string;
  content: string;
  category: Category;
  tags: string[];
  createdDate: Date;
  updatedDate: Date;
  image: Thumbnail | null;
  hasLiked: boolean;

  constructor(
      id?: number,
      owner?: User,
      hasLiked?: boolean,
      title?: string,
      content?: string,
      createdDate?: Date,
      updatedDate?: Date,
      tags?: string[],
      category?: Category,
      image?: Thumbnail | null)
  {
    this.id          = id          || 0;
    this.owner       = owner       || new User();
    this.hasLiked    = hasLiked    || false;
    this.title       = title       || '';
    this.content     = content     || '';
    this.createdDate = createdDate || new Date();
    this.updatedDate = updatedDate || new Date();
    this.tags        = tags        || [];
    this.category    = category    || new Category();
    this.image       = image       || null;
  }

  toCreateDTO(): DTO.PostCreateDTO {
    return {
      titulo: this.title,
      descricao: this.content,
      id_categoria: this.category.id,
      id_user: this.owner.id,
      tags: this.tags,
    }
  }

  toUpdateDTO(): DTO.PostUpdateDTO {
    return {
      titulo: this.title,
      descricao: this.content,
      id_categoria: this.category.id,
      id_user: this.owner.id,
      tags: this.tags,
    }
  }

  toDeleteDTO(): DTO.PostDeleteDTO {
    return { topico_id: this.id }
  }

  static fromGetDTO(dto: DTO.PostGetResponseDTO, categories?: Category[]): Post {
    const category: Category | undefined = categories?.find((c) => c.id === dto.id_categoria);

    return new Post(
      dto.id,
      new User(dto.id_user),
      dto.has_liked,
      dto.titulo,
      dto.descricao,
      new Date(dto.created_at),
      new Date(dto.updated_at),
      dto.tags,
      category,
      new Thumbnail(dto.img_topico)
    )
  }
}