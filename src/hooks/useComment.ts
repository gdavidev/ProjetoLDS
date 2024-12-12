import { AxiosError } from 'axios';
import Comment from '@models/Comment.ts';
import { useMutation, useQuery } from 'react-query';
import ApiService from '@api/ApiService.ts';
import * as DTO from '@models/data/CommentDTOs'

const endpoints = {
	get: '/comentarios/list/',
	post: '/comentarios/create/',
	delete: '/comentarios/delete/',
	put: '/comentarios/update/'
}

type UseCommentOptions<T> = {
	onSuccess?: (comment: T) => void,
	onError?: (err: AxiosError | Error) => void
}

export default function useComments(options: UseCommentOptions<Comment[]>) {
	async function fetchComments() {
		const comments =
				await ApiService.get<DTO.CommentGetResponseDTO[]>(endpoints.get);
		return comments.data.map(dto => Comment.fromGetDTO(dto))
	}

	const { data: comments, refetch: reFetchComments, ...rest } = useQuery({
		queryKey: 'FETCH_COMMENTS',
		queryFn: fetchComments,
		...options
	});
	return { comments, reFetchComments, ...rest };
}

export function useCreateComment(options: UseCommentOptions<Comment>) {
	async function postComment(comment: Comment) {
		const res =
				await ApiService.post<DTO.CommentGetResponseDTO>(endpoints.post, comment.toCreateDTO());
		return Comment.fromGetDTO(res.data);
	}

	const { mutate: createComment, ...rest } = useMutation('CREATE_COMMENT',
		postComment,
		{...options}
	);
	return { createComment, ...rest };
}