import * as DTO from "@models/data/PostDTOs";
import User from "./User";
import Category from '@models/Category.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';
import Comment from '@models/Comment.ts';
import { CommentGetResponseDTO } from '@models/data/CommentDTOs.ts';

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
  likeCount: number;
  commentCount: number;
  comments: Comment[];

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
      likeCount: number,
      commentCount: number,
      createdDate: Date,
      updatedDate: Date,
      comments: Comment[])
  constructor(
      title: string,
      owner: User,
      category: Category,
      content: string,
      tags: string[],
      image: Thumbnail | null = null,
      id: number = 0,
      hasLiked: boolean = false,
      likeCount: number = 0,
      commentCount: number = 0,
      createdDate: Date = new Date(0),
      updatedDate: Date = new Date(0),
      comments: Comment[] = [])
  {
    this.title        = title;
    this.owner        = owner;
    this.category     = category;
    this.content      = content;
    this.tags         = tags;
    this.image        = image;
    this.id           = id;
    this.hasLiked     = hasLiked;
    this.likeCount    = likeCount;
    this.commentCount = commentCount;
    this.createdDate  = createdDate;
    this.updatedDate  = updatedDate;
    this.comments     = comments;
  }

  static fromGetDTO(dto: DTO.PostGetResponseDTO): Post {
    return new Post(
      dto.titulo,
      new User(dto.user.id, dto.user.username, new Thumbnail({ base64: dto.user.img_perfil })),
      new Category(dto.categoria.id, dto.categoria.nome),
      dto.descricao,
      dto.tags !== 'None' ? dto.tags : [],
      dto.img_topico64 ? new Thumbnail({ base64: dto.img_topico64 }) : null,
      dto.id,
      dto.has_liked,
      dto.likes,
      dto.comentarios,
      new Date(dto.created_at),
      new Date(dto.updated_at),
      dto.obj_comentarios ?
          dto.obj_comentarios.map((comm: CommentGetResponseDTO) => Comment.fromGetDTO(comm)) :
          []
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