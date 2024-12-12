/* CREATE */
export type CommentCreateDTO = {
	id_topico: number,
	id_user: number,
	descricao: string,
	comentario_delete: boolean
}

/* UPDATE */
export type CommentUpdateDTO = {
	id_topico: number,
	id_user: number,
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
	id: number
	id_topico: number
	id_user: number
	descricao: string
	comentario_delete: boolean
	is_helpful: boolean
	created_at: Date
	updated_at: Date
	has_liked: boolean
}