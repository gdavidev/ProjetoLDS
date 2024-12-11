import User from "./User";
import * as DTO from '@models/data/CommentDTOs'

export enum CommentParentType {
  POST,
  COMMENT,
}
export type CommentParent = {
  id: number
  type: CommentParentType
}

export default class Comment {
  id: number;
  parent: CommentParent;
  owner: User;
  content: string;
  hasLiked: boolean;
  isUseful: boolean;
  createdDate: Date;
  updatedDate: Date;
  responses: Comment[];

  constructor(
      parent: CommentParent,
      owner: User,
      content: string)
  constructor(
      parent: CommentParent,
      owner: User,
      content: string,
      id: number,
      hasLiked: boolean,
      isUseful: boolean,
      createdDate: Date,
      updatedDate: Date,
      responses: Comment[])
  constructor(
      parent: CommentParent,
      owner: User,
      content: string,
      id: number = 0,
      hasLiked: boolean = false,
      isUseful: boolean = false,
      createdDate: Date = new Date(0),
      updatedDate: Date = new Date(0),
      responses: Comment[] = [])
  {
    this.parent      = parent;
    this.owner       = owner;
    this.content     = content;
    this.id          = id;
    this.hasLiked    = hasLiked;
    this.isUseful    = isUseful;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.responses   = responses;
  }

  static fromGetDTO(dto: DTO.CommentGetResponseDTO) {
    return new Comment(
        { id: dto.id_topico, type: Comment.parseCommentParentType(dto.tipo_pai) } as CommentParent,
        new User(dto.id_user, ''),
        dto.descricao,
        dto.id,
        dto.has_liked,
        dto.is_helpful,
        dto.created_at,
        dto.updated_at,
        []
    )
  }

  public static parseCommentParentType(type: string) {
    if (type === 'comentario') return CommentParentType.COMMENT
    if (type === 'post') return CommentParentType.POST
    return CommentParentType.POST
  }

  public static serializeCommentParentType(type: CommentParentType) {
    if (type === CommentParentType.COMMENT) return 'comentario'
    if (type === CommentParentType.POST) return 'post'
    return 'post'
  }

  public toCreateDTO(): DTO.CommentCreateDTO {
    return {
      id_topico: this.parent.id,
      id_user: this.owner.id,
      descricao: this.content,
      comentario_delete: false
    }
  }
}