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
      title: string,
      owner: User,
      category: Category,
      content: string,
      tags: string[],
      image?: Thumbnail)
  constructor(
      title: string,
      owner: User,
      category: Category,
      content: string,
      tags: string[],
      image: Thumbnail | null,
      id: number,
      hasLiked: boolean,
      createdDate: Date,
      updatedDate: Date)
  constructor(
      title: string,
      owner: User,
      category: Category,
      content: string,
      tags: string[],
      image: Thumbnail | null = null,
      id: number = 0,
      hasLiked: boolean = false,
      createdDate: Date = new Date(0),
      updatedDate: Date = new Date(0))
  {
    this.title       = title;
    this.owner       = owner;
    this.category    = category;
    this.content     = content;
    this.tags        = tags;
    this.image       = image;
    this.id          = id;
    this.hasLiked    = hasLiked;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  static fromGetDTO(dto: DTO.PostGetResponseDTO): Post {
    return new Post(
      dto.titulo,
      new User(dto.id_user, dto.nome_user),
      new Category(dto.id_categoria, dto.nome_categoria),
      dto.descricao,
      dto.tags,
      new Thumbnail({ base64: dto.img_topico }),
      dto.id,
      dto.has_liked,
      new Date(dto.created_at),
      new Date(dto.updated_at),
    )
  }

  public toCreateDTO(): DTO.PostCreateDTO {
    return {
      titulo: this.title,
      descricao: this.content,
      id_categoria: this.category.id,
      id_user: this.owner.id,
      tags: this.tags,
      img_topico: this.image?.file ?? undefined,
    }
  }

  public toUpdateDTO(): DTO.PostUpdateDTO {
    return {
      titulo: this.title,
      descricao: this.content,
      id_categoria: this.category.id,
      id_user: this.owner.id,
      tags: this.tags,
      img_topico: this.image?.file ?? undefined,
    }
  }
}