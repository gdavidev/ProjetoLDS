import Comment from '@models/Comment.ts';
import User from '@models/User.ts';
import CommentRow from '@apps/main/components/CommentRow.tsx';
import { useCallback } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import { useLikeComment } from '@/hooks/useLikeComments.ts';
import { useCommentIsUseful, useCreateComment, useDeleteComment } from '@/hooks/useComment.ts';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import { AxiosError } from 'axios';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import useMessageBox from '@/hooks/interaction/useMessageBox.ts';
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';
import Post from '@models/Post.ts';
import useBan from '@/hooks/useBan.ts';

type CommentContainerProps = {
	comments: Comment[];
	post: Post;
	onReportClick: (comment: Comment) => void;
	onUpdate: () => void
}

export default function CommentContainer(props: CommentContainerProps) {
	const { openMessageBox } = useMessageBox();
	const { notifyError, notifySuccess } = useNotification();
	const { user, askToLogin, forceLogin } = useCurrentUser();

	// ---- API Calls Setup ----
	const { likeComment } = useLikeComment(user?.token!, {
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { createComment } = useCreateComment(user?.token!, {
		onSuccess: () => {
			notifySuccess('Comentário criado com sucesso!');
			props.onUpdate();
		},
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { deleteComment } = useDeleteComment(user?.token!, {
		onSuccess: () => {
			notifySuccess('Comentário deletado com sucesso!');
			props.onUpdate();
		},
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { ban } = useBan(user?.token!, {
		onSuccess: () => notifySuccess('Usuário banido com sucesso!'),
		onError: (error: AxiosError | Error) => handleRequestError(error),
	});
	const { commentIsUseful } = useCommentIsUseful(user?.token!, {
		onSuccess: () => notifySuccess('Comentário marcado como útil!'),
		onError: (error: AxiosError | Error) => handleRequestError(error)
	})

	// ---- API Calls Error Handling ----
	const { handleRequestError } = useRequestErrorHandler({
		mappings: [
			{ status: 401, onError: () => forceLogin("Por favor faça login novamente") },
			{ status: 'default', userMessage: "Por favor tente novamente mais tarde." },
		],
		onError: (message: string) => notifyError(message)
	});

	// ---- API Executing API Calls ----
	const handleSendAnswer =
			useCallback((answeredComment: Comment, answerText: string) => {
				if (!user)
					return askToLogin('Você precisa estar logado para responder comentários.');

				createComment(new Comment(
						{ parentId: answeredComment.id, postId: props.post.id },
						User.fromCurrentUser(user),
						answerText
				));
			}, []);

	const handleExcludeButtonClick = useCallback((comment: Comment): void => {
		openMessageBox({
			title: 'Deletar Comentário',
			message: 'Tem certeza que deseja deletar esse comentário?',
			type: MessageBoxType.YES_NO,
			onClick: (result: MessageBoxResult) => {
				if (result === MessageBoxResult.YES)
					deleteComment(comment);
			}
		});
		props.onUpdate();
	}, []);

	const handleBanButtonClick = useCallback((userId: number): void => {
		openMessageBox({
			title: 'Banir Usuário',
			message: 'Tem certeza que deseja banir esse usuário?',
			type: MessageBoxType.YES_NO,
			onClick: (result: MessageBoxResult) => {
				if (result === MessageBoxResult.YES)
					ban(userId);
			}
		});
	}, []);

	const handleIsUsefulButtonClick = useCallback((comment: Comment): void => {
		commentIsUseful(comment);
		comment.isUseful = !comment.isUseful
	}, []);

	const handleLikeButtonClick = useCallback((comment: Comment) => {
		if (!user)
			return askToLogin('É preciso estar logado para curtir comentários')

		likeComment({
			newState: !comment.hasLiked,
			comment: comment,
		});
		comment.hasLiked = !comment.hasLiked;
	}, [user]);

	return (
			<div className="flex flex-col mt-2">
				{
					props.comments.map((com: Comment, i: number) => (
							<CommentRow
									key={i}
									postOwner={ props.post.owner }
									comment={ com }
									onSendAnswer={ handleSendAnswer }
									onLikeClick={ handleLikeButtonClick }
									onReportClick={ props.onReportClick }
									onIsUsefulClick={ handleIsUsefulButtonClick }
									onBanClick={ handleBanButtonClick }
									onExcludeClick={ handleExcludeButtonClick }
							/>
					))
				}
			</div>
	);
}