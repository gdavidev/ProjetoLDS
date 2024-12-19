/* CREATE */
import { CategoryGetResponseDTO } from '@models/data/CategoryDTOs.ts';
import { UseGetResponseDTO } from '@models/data/UserDTOs.ts';
import { CommentGetResponseDTO } from '@models/data/CommentDTOs.ts';

export type PostCreateDTO = {
  titulo: string,
  descricao: string,
  id_categoria: number,
  id_user: number,
  tags: string[],
  img_topico?: File
}

/* UPDATE */
export type PostUpdateDTO = {
  titulo?: string,
  descricao?: string,
  id_categoria?: number,
  id_user?: number,
  tags?: string[],
  img_topico?: File
}

/* DELETE */
export type PostDeleteDTO = {
  topico_id: number
}

/* GET */
export type PostGetDTO = {  
  topico_id: number,
  id_usuario: string,
}
export type PostGetResponseDTO = {
  id: 1;
  titulo: string;
  img_topico64: string;
  tags: string[] | 'None';
  descricao: string;
  categoria: CategoryGetResponseDTO
  user: UseGetResponseDTO
  comentarios: number;
  obj_comentarios: CommentGetResponseDTO[]
  likes: number;
  created_at: Date;
  updated_at: Date;
  has_liked: boolean;
}