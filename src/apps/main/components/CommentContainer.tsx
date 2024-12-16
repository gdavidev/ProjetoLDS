import Comment, { CommentParent } from '@models/Comment.ts';
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
}

export default function CommentContainer(props: CommentContainerProps) {
	const { openMessageBox } = useMessageBox();
	const { notifyError, notifySuccess } = useNotification();
	const { user, askToLogin } = useCurrentUser();

	// ---- API Calls Setup ----
	const { likeComment } = useLikeComment(user?.token!, {
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { createComment } = useCreateComment({
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { deleteComment } = useDeleteComment({
		onSuccess: () => notifySuccess('Comentário deletado com sucesso!'),
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});
	const { ban } = useBan(user?.token!, {
		onSuccess: () => notifySuccess('Usuário banido com sucesso!'),
		onError: (error: AxiosError | Error) => handleRequestError(error),
	});
	const { commentIsUseful } = useCommentIsUseful({
		onSuccess: () => notifySuccess('Comentário marcado como útil!'),
		onError: (error: AxiosError | Error) => handleRequestError(error)
	})

	// ---- API Calls Error Handling ----
	const { handleRequestError } = useRequestErrorHandler({
		mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
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
	}, []);

	const handleLikeButtonClick = useCallback((comment: Comment) => {
		if (!user)
			return askToLogin('É preciso estar logado para curtir comentários')

		likeComment({
			newState: comment.hasLiked,
			comment: comment,
		});
		comment.hasLiked = !comment.hasLiked;
	}, [user]);

	return (
			<div className="flex flex-col mt-2">
				{
					mockCommentList.map((com: Comment, i: number) => (
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

const mockCommentList: Comment[] = [
	new Comment(
			{ parentId: 0, postId: 1 } as CommentParent,
			new User(0, 'John Doe'),
			'This is the first comment!',
			0,
			false, // likes
			false,
			new Date(Date.now() + 40 * 60 * 60 * 1000),
			new Date(Date.now() + 40 * 60 * 60 * 1000),
			[
				new Comment(
						{ parentId: 0, postId: 1 } as CommentParent,
						new User(1, 'Jane Smith'),
						'I totally agree with this!',
						1,
						false, // likes
						true,
						new Date(Date.now() + 41 * 60 * 60 * 1000),
						new Date(Date.now() + 41 * 60 * 60 * 1000),
						[]
				),
				new Comment(
						{ parentId: 0, postId: 1 } as CommentParent,
						new User(2, 'Mark Johnson'),
						'Interesting perspective!',
						2,
						false, // likes
						false,
						new Date(Date.now() + 42 * 60 * 60 * 1000),
						new Date(Date.now() + 42 * 60 * 60 * 1000),
						[
							new Comment(
									{ parentId: 0, postId: 1 } as CommentParent,
									new User(3, 'Emily Davis'),
									'Thanks for pointing this out, Mark!',
									3,
									false, // likes
									false,
									new Date(Date.now() + 43 * 60 * 60 * 1000),
									new Date(Date.now() + 43 * 60 * 60 * 1000),
									[]
							)
						]
				)
			]
	),
	new Comment(
			{ parentId: 0, postId: 1 } as CommentParent,
			new User(4, 'Alice Brown'),
			'What are your thoughts on the current discussion?',
			4,
			false, // likes
			false,
			new Date(Date.now() + 44 * 60 * 60 * 1000),
			new Date(Date.now() + 44 * 60 * 60 * 1000),
			[
				new Comment(
						{ parentId: 0, postId: 1 } as CommentParent,
						new User(5, 'Charlie Wilson'),
						'I think it’s quite insightful.',
						5,
						false, // likes
						false,
						new Date(Date.now() + 45 * 60 * 60 * 1000),
						new Date(Date.now() + 45 * 60 * 60 * 1000),
						[]
				)
			]
	),
	new Comment(
			{ parentId: 0, postId: 1 } as CommentParent,
			new User(6, 'Sophia Taylor'),
			'Does anyone have sources to back this up?',
			6,
			true, // likes
			false,
			new Date(Date.now() + 46 * 60 * 60 * 1000),
			new Date(Date.now() + 46 * 60 * 60 * 1000),
			[
				new Comment(
						{ parentId: 0, postId: 1 } as CommentParent,
						new User(7, 'Liam Moore'),
						'Here’s a link to an article: [link]',
						7,
						false, // likes
						false,
						new Date(Date.now() + 47 * 60 * 60 * 1000),
						new Date(Date.now() + 47 * 60 * 60 * 1000),
						[]
				),
				new Comment(
						{ parentId: 0, postId: 1 } as CommentParent,
						new User(8, 'Olivia Martinez'),
						'I can provide some more details if needed.',
						8,
						false, // likes
						false,
						new Date(Date.now() + 48 * 60 * 60 * 1000),
						new Date(Date.now() + 48 * 60 * 60 * 1000),
						[]
				)
			]
	)
];