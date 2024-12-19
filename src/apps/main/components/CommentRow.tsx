import DateFormatter from '@libs/DateFormatter.ts';
import Comment from '@models/Comment.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import React, { useCallback, useState } from 'react';
import {
	chatbubbleOutline,
	flagOutline,
	star,
	starOutline,
	hammerOutline,
	trashOutline,
	ellipsisHorizontal,
	checkmarkOutline, heart, heartOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Role } from '@/hooks/usePermission.ts';
import CurrentUser from '@models/CurrentUser.ts';
import { ListItemIcon, ListItemText, MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextArea from '@shared/components/formComponents/TextArea.tsx';
import User from '@models/User.ts';
import { Controller, useForm } from 'react-hook-form';

type CommentRowProps = {
	postOwner: User;
	comment: Comment;
	onSendAnswer: (answeredComment: Comment, answerText: string) => void;
	onLikeClick: (comment: Comment) => void;
	onReportClick: (comment: Comment) => void;
	onBanClick: (userId: number) => void;
	onExcludeClick: (comment: Comment) => void;
	onIsUsefulClick: (comment: Comment) => void;
	className?: string;
}

type CommentFormData = {
	comment: string
}

export default function CommentRow(props: CommentRowProps) {
	const [ isAnswerInputOpen, setIsAnswerInputOpen ] = useState<boolean>(false);
	const { user } = useCurrentUser();
	const { handleSubmit, control, formState: { errors }, setValue } =
			useForm<CommentFormData>({
				defaultValues: { comment: '' },
			});

	const handleSendAnswer = useCallback((data: CommentFormData) => {
		props.onSendAnswer(props.comment, data.comment);
		setValue('comment', '');
		setIsAnswerInputOpen(false);
	}, []);

	return (
			<div className={ "flex flex-col mt-8 " + props.className }>
				<div className='flex gap-x-4 items-start grow'>
					<div className='max-w-10 max-h-10 overflow-hidden rounded-full'>
						<img
								src={props.comment.owner.profilePic.toDisplayable()}
								className='object-cover h-full'
								alt="post-owner" />
					</div>
					<div className="flex flex-col gap-y-1 justify-between grow">
						<span className="flex gap-x-1 items-center text-gray-500 text-xs h-2">
							{
								(user && props.comment.owner.id === user.id) ?
										<span className="bg-primary text-white px-3 rounded-md">Você</span> :
										props.comment.owner.name
							}
							{
								(props.postOwner.id === props.comment.owner.id) &&
										<span className='text-teal-500'> OP</span>
							}
							<span className="text-sm">&#8226;</span>
							{ DateFormatter.relativeDate(props.comment.createdDate) }
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
								userIsPostOwner={ !!user && props.postOwner.id === user.id }
								userIsCommentOwner={ !!user && props.comment.owner.id === user.id }
								comment={ props.comment }
								onLikeClick={ () => props.onLikeClick(props.comment) }
								onAnswerClick={ () => setIsAnswerInputOpen(true) }
								onReportClick={ () => props.onReportClick(props.comment) }
								onBanClick={ () => props.onBanClick(props.comment.owner.id) }
								onExcludeClick={ () => props.onExcludeClick(props.comment) }
								onIsUsefulClick={ () => props.onIsUsefulClick(props.comment) }
						/>

						{
							isAnswerInputOpen &&
									<form
											onSubmit={ handleSubmit(handleSendAnswer) }
											className="flex flex-col items-end gap-y-1 mt-2">
										<Controller
											name="comment"
											control={ control }
											rules={{ required: 'Não é possível enviar um comentário vazio.' }}
											render={({ field }) => (
													<TextArea
															{...field}
															name="Comentário"
															labelClassName='hidden'
															className={ (errors.comment ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
										)} />
										{
												errors.comment &&
														<span className='text-red-500'>{errors.comment.message}</span>
										}
										<div className='flex gap-x-2'>
											<button
													type="reset"
													onClick={ () => setIsAnswerInputOpen(false) }
													className="btn-secondary">
												Cancelar
											</button>
											<button
													type="submit"
													className="btn-primary">
												Enviar
											</button>
										</div>
									</form>
						}

					</div>

				</div>
					{
						(props.comment.responses && props.comment.responses.length > 0) &&
								<div className='flex flex-col ps-5 border-s-[1px] border-gray-500'>
									{
										props.comment.responses.map((resp: Comment, i: number) => (
												<CommentRow
														key={i}
														className='!mt-3'
														postOwner={ props.postOwner }
														onSendAnswer={ props.onSendAnswer }
														onLikeClick={ props.onLikeClick }
														onReportClick={ props.onReportClick }
														onIsUsefulClick={ props.onIsUsefulClick }
														onBanClick={ props.onBanClick }
														onExcludeClick={ props.onExcludeClick }
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
	comment: Comment;
	onLikeClick: () => void;
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
				<button
						onClick={ props.onLikeClick }
						className="cursor-pointer hover:bg-primary-dark text-primary-light flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					{
						props.comment.hasLiked ?
								<IonIcon icon={ heart } /> :
								<IonIcon icon={ heartOutline } />
					}
					<span>Curtir</span>
				</button>

				<button
						onClick={props.onAnswerClick}
						className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					<IonIcon icon={chatbubbleOutline} />
					<span>Responder</span>
				</button>

				{(props.user && (props.userIsPostOwner || props.user.role === Role.ADMIN)) &&
						<button
							onClick={props.onIsUsefulClick}
							className="cursor-pointer text-yellow-500 hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
								{
									props.comment.isUseful ?
										<IonIcon icon={star} /> :
										<IonIcon icon={starOutline} />
								}
								<span>útil</span>
						</button>
				}

				<button
						onClick={handleOptionsClick}
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
						{(props.user && [Role.ADMIN, Role.MODERATOR].includes(props.user.role)) &&
									<MenuItem onClick={props.onBanClick}>
										<ListItemIcon>
											<IonIcon icon={hammerOutline} />
										</ListItemIcon>
										<ListItemText>Banir Usuário</ListItemText>
									</MenuItem>
						}
						{(props.user && (props.userIsCommentOwner || [Role.ADMIN, Role.MODERATOR].includes(props.user.role))) &&
								<MenuItem onClick={props.onExcludeClick}>
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