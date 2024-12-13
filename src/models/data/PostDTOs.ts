/* CREATE */
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
  categoria: {
    id: 1,
    nome: string;
  }
  comentarios: number;
  created_at: Date;
  descricao: string;
  has_liked: boolean;
  id: 1;
  img_topico64: string;
  likes: number;
  tags: string[] | null;
  titulo: string;
  updated_at: Date;
  user: {
    admin: boolean;
    email: string;
    id: 1;
    img_perfil: string;
    is_active: boolean;
    is_banned: boolean;
    username: string;
  }
}