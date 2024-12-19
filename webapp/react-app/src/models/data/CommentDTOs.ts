import { UseGetResponseDTO } from '@models/data/UserDTOs.ts';

/* CREATE */
export type CommentCreateDTO = {
	id_topico: number,
	descricao: string,
	is_helpful: boolean,
	id_parent?: number
}

/* UPDATE */
export type CommentUpdateDTO = {
	id_topico: number,
	descricao: string,
	comentario_delete: boolean
}

/* DELETE */
export type CommentDeleteDTO = {
	id: number
}

/* GET */
export type CommentGetDTO = {
	id: number,
}
export type CommentGetResponseDTO = {
	id: number;
	id_topico: number;
	descricao: string;
	type_content: string;
	user: UseGetResponseDTO;
	is_helpful: boolean;
	id_parent: number | 'None';
	created_at: Date;
	updated_at: Date;
	has_liked: boolean;
	children: CommentGetResponseDTO[]
}