import User from "./User";
import * as DTO from '@models/data/CommentDTOs'

export type CommentParent = {
  postId: number,
  parentId: number | null,
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
        { postId: dto.id_topico, parentId: dto.id_parent } as CommentParent,
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

  public toCreateDTO(): DTO.CommentCreateDTO {
    return {
      id_topico: this.parent.postId,
      id_parent: this.parent.parentId ?? 0,
      id_user: this.owner.id,
      descricao: this.content,
      is_helpful: false,
    }
  }
}