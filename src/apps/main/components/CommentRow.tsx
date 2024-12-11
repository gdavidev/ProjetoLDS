import DateFormatter from '@libs/DateFormatter.ts';
import LikeButton from '@apps/main/components/LikeButton.tsx';
import Comment from '@models/Comment.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import React, { useCallback, useState } from 'react';
import { useLikeComment } from '@/hooks/useLikeComments.ts';
import {
	chatbubbleOutline,
	flagOutline,
	starOutline,
	hammerOutline,
	trashOutline,
	ellipsisHorizontal,
	checkmarkOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Role } from '@/hooks/usePermission.ts';
import CurrentUser from '@models/CurrentUser.ts';
import { ListItemIcon, ListItemText, MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextArea from '@shared/components/formComponents/TextArea.tsx';
import { ReportContentType } from '@models/Report.ts';

type CommentRowProps = {
	userIsPostOwner: boolean;
	userIsCommentOwner: boolean;
	comment: Comment;
	onReportClick: (contentType: ReportContentType, contentId: number) => void;
	onBanClick: (userId: number) => void;
	onExcludeClick: (commentId: number) => void;
	onIsUsefulClick: (commentId: number) => void;
	className?: string;
}

export default function CommentRow(props: CommentRowProps) {
	const [ isAnswerInputOpen, setIsAnswerInputOpen ] = useState<boolean>(false);
	const { user, askToLogin } = useCurrentUser();
	const [ isLiked, setLiked ] = useState<boolean>(props.comment.hasLiked);
	const { mutate: toggleLike } = useLikeComment({
		onError: () => setLiked(props.comment.hasLiked)
	});

	const handleToggleLike = useCallback(() => {
		if (!user)
			return askToLogin('É preciso estar logado para curtir comentários')

		toggleLike({
			currentState: isLiked,
			targetId: props.comment.id,
			token: user!.token,
		});
		setLiked(li => !li)
	}, [isLiked, props.comment]);

	return (
			<div className={ "flex flex-col mt-8 " + props.className }>
				<div className='flex gap-x-4 items-start grow'>
					<div className='max-w-10 max-h-10 overflow-hidden rounded-full'>
						<img
								src={props.comment.owner.profilePic.toDisplayable()}
								className='object-cover h-full'
								alt="post-owner" />
					</div>
					<div className="flex flex-col justify-between grow">
						<span className="flex gap-x-1 items-center text-gray-500 text-xs h-2">
							{
								props.userIsCommentOwner ?
										<span className='text-primary'>Você</span> :
										props.comment.owner.name
							}
							{
								props.userIsPostOwner &&
									<span className='text-teal-500'> OP</span>
							}
							<span className="text-sm">&#8226;</span>
							{DateFormatter.relativeDate(props.comment.createdDate)}
							{
								props.comment.isUseful &&
									<span className='text-emerald-500 flex items-center gap-x-1'>
										<IonIcon icon={ checkmarkOutline } />
										Marcado como útil
									</span>
							}
						</span>

						<p>{props.comment.content}</p>

						<CommentRowActionBar
								user={ user }
								userIsPostOwner={ props.userIsPostOwner }
								userIsCommentOwner={ props.userIsCommentOwner }
								onAnswerClick={ () => setIsAnswerInputOpen(true) }
								onReportClick={ () => props.onReportClick(ReportContentType.COMMENT, props.comment.id) }
								onBanClick={ () => props.onBanClick(props.comment.owner.id) }
								onExcludeClick={ () => props.onExcludeClick(props.comment.id) }
								onIsUsefulClick={ () => props.onIsUsefulClick(props.comment.id) }
						/>

						{
							isAnswerInputOpen &&
									<div className="flex flex-col items-end gap-y-1 mt-2">
										<TextArea
											name="answer"
											className="rounded-md text-black px-2 py-1"
											labelClassName="hidden" />
										<div className='flex gap-x-2'>
											<button
													onClick={ () => setIsAnswerInputOpen(false) }
													className="btn-r-md bg-secondary text-white">
												Cancelar
											</button>
											<button className="btn-r-md bg-primary text-white">
												Enviar
											</button>
										</div>
									</div>
						}

					</div>

					<LikeButton
							className="self-center"
							onClick={handleToggleLike}
							checked={isLiked}
					/>
				</div>
					{
						(props.comment.responses && props.comment.responses.length > 0) &&
								<div className='flex flex-col ps-5 border-s-[1px] border-gray-500'>
									{
										props.comment.responses.map((resp: Comment, i: number) => (
												<CommentRow
														key={i}
														className='!mt-3'
														userIsPostOwner={ props.userIsPostOwner }
														userIsCommentOwner={ props.userIsCommentOwner }
														onReportClick={ props.onReportClick }
														comment={ resp } />
										))
									}
								</div>
					}
			</div>
	)
}

type CommentRowActionBarProps = {
	userIsPostOwner: boolean;
	userIsCommentOwner: boolean;
	user: CurrentUser | null;
	onIsUsefulClick: () => void;
	onAnswerClick: () => void;
	onReportClick: () => void;
	onBanClick: () => void;
	onExcludeClick: () => void;
}

function CommentRowActionBar(props: CommentRowActionBarProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleOptionsClick =
			useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
				setAnchorEl(event.currentTarget);
			}, []);
	const handleClose =
			useCallback(() => {
				setAnchorEl(null);
			}, []);

	return (
			<div className="flex gap-x-2 w-full justify-start">
				{ (props.user && (props.userIsPostOwner || props.user.role === Role.ADMIN)) &&
							<button
									onClick={ props.onIsUsefulClick }
									className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
								<IonIcon icon={ starOutline } />
								<span>Mais útil</span>
							</button>
				}

				<button
						onClick={ props.onAnswerClick }
						className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					<IonIcon icon={chatbubbleOutline} />
					<span>Responder</span>
				</button>
				<button
						onClick={ handleOptionsClick }
						className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					<IonIcon icon={ellipsisHorizontal} />
				</button>

				<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
						sx={{ width: 320, maxWidth: '100%' }}>
					<MenuList>
						<MenuItem>
							<ListItemIcon>
								<IonIcon icon={flagOutline} />
							</ListItemIcon>
							<ListItemText>Denunciar</ListItemText>
						</MenuItem>
						{ (props.user && [Role.ADMIN, Role.MODERATOR].includes(props.user.role)) &&
									<MenuItem onClick={ props.onBanClick }>
										<ListItemIcon>
											<IonIcon icon={hammerOutline} />
										</ListItemIcon>
										<ListItemText>Banir Usuário</ListItemText>
									</MenuItem>
						}
						{ (props.user && (props.userIsCommentOwner || [Role.ADMIN, Role.MODERATOR].includes(props.user.role))) &&
									<MenuItem onClick={ props.onExcludeClick }>
										<ListItemIcon>
											<IonIcon icon={trashOutline} />
										</ListItemIcon>
										<ListItemText>Apagar</ListItemText>
									</MenuItem>
						}
					</MenuList>
				</Menu>
			</div>
	)
}