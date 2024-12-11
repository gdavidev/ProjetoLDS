/* CREATE */
export type PostCreateDTO = {
  titulo: string,
  descricao: string,
  id_categoria: number,
  id_user: number,
  tags: string[],
  img_topico?: File
}
export type PostCreateResponseDTO = {
  id: number,
  titulo: string,
  img_topico: string,
  descricao: string,
  id_categoria: number,
  id_user: number,
  tags: string[],
  created_at: number,
  updated_at: number,
  has_liked: boolean,
}

/* UPDATE */
export type PostUpdateDTO = {
  titulo?: string,
  descricao?: string,
  id_categoria?: number,
  id_user?: number,
  tags?: string[],
}
export type PostUpdateResponseDTO = {
  id: number,
  titulo: string,
  img_topico: string,
  descricao: string,
  id_categoria: number,
  id_user: number,
  tags: string[],
  created_at: number,
  updated_at: number,
  has_liked: boolean,
}

/* DELETE */
export type PostDeleteDTO = {
  topico_id: number
}
export type PostDeleteResponseDTO = {}

/* GET */
export type PostGetDTO = {  
  topico_id: number,
  id_usuario: string,
}
export type PostGetResponseDTO = {
  id: number,
  titulo: string,
  img_topico: string,
  descricao: string,
  id_categoria: number,
  id_user: number,
  tags: string[],
  created_at: number,
  updated_at: number,
  has_liked: boolean,
}