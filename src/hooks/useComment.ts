import { AxiosError } from 'axios';
import Comment from '@models/Comment.ts';
import { useMutation, useQuery } from 'react-query';
import ApiService from '@api/ApiService.ts';
import * as DTO from '@models/data/CommentDTOs'
import { useCallback } from 'react';

const endpoints = {
	get: '/api/comentarios/list/',
	post: '/api/comentarios/create/',
	isUseful: '/api/comentarios/is-helpful/',
	delete: '/api/comentarios/delete/',
	put: '/api/comentarios/update/'
}

type UseCommentOptions<T> = {
	onSuccess?: (comment: T) => void,
	onError?: (err: AxiosError | Error) => void
}

export default function useComments(options?: UseCommentOptions<Comment[]>) {
	const fetchComments = useCallback(async () => {
		const comments =
				await ApiService.get<DTO.CommentGetResponseDTO[]>(endpoints.get);
		return comments.data.map(dto => Comment.fromGetDTO(dto))
	}, []);

	const { data: comments, refetch: reFetchComments, ...rest } = useQuery({
		queryKey: 'FETCH_COMMENTS',
		queryFn: fetchComments,
		...options
	});
	return { comments, reFetchComments, ...rest };
}

export function useCreateComment(token: string, options?: UseCommentOptions<Comment>) {
	const postComment = useCallback(async (comment: Comment) => {
		const res =
				await ApiService.post<DTO.CommentGetResponseDTO>(
						endpoints.post,
						comment.toCreateDTO(),
						{ headers: { 'Authorization': 'Bearer ' + token } });
		return Comment.fromGetDTO(res.data);
	}, []);

	const { mutate: createComment, ...rest } = useMutation('CREATE_COMMENT',
		postComment,
		{...options}
	);
	return { createComment, ...rest };
}

export function useDeleteComment(token:string, options?: UseCommentOptions<void>) {
	const sendDeleteComment = useCallback(async (comment: Comment) => {
			await ApiService.delete(
					endpoints.delete, {
						data: { id: comment.id },
						headers: { 'Authorization': 'Bearer ' + token }
					});
	}, []);

	const { mutate: deleteComment, ...rest } = useMutation('DELETE_COMMENT',
			sendDeleteComment,
			{...options}
	);
	return { deleteComment, ...rest };
}

export function useCommentIsUseful(token: string, options?: UseCommentOptions<void>) {
	const sendCommentIsUseful = useCallback(async (comment: Comment) => {
		await ApiService.post(
				endpoints.isUseful,
				{ id: comment.id },
				{ headers: { 'Authorization': 'Bearer ' + token } }
		);
	}, []);

	const { mutate: commentIsUseful, ...rest } = useMutation('COMMENT_IS_USEFUL',
			sendCommentIsUseful,
			{...options}
	);
	return { commentIsUseful, ...rest };
}