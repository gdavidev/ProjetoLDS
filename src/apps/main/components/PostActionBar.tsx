import CurrentUser from '@models/CurrentUser.ts';
import { IonIcon } from '@ionic/react';
import {
	chatbubbleOutline,
	ellipsisHorizontal,
	flagOutline,
	hammerOutline,
	heart,
	heartOutline,
	trashOutline,
} from 'ionicons/icons';
import { Role } from '@/hooks/usePermission.ts';
import React, { useCallback, useState } from 'react';
import { ListItemIcon, ListItemText, MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import useDeviceWidth, { DeviceWidthBreakpoints } from '@/hooks/configuration/useDeviceWidth.ts';

type PostActionBarProps = {
	userIsPostOwner: boolean;
	user: CurrentUser | null;
	isLiked: boolean;
	likeCount: number;
	commentCount: number;
	onLikeClick: () => void;
	onAnswerClick: () => void;
	onReportClick: () => void;
	onBanClick: () => void;
	onExcludeClick: () => void;
	className?: string;
}

export default function PostActionBar(props: PostActionBarProps) {
	const { breakpoint } = useDeviceWidth()

	const complementaryActionsProps: PostComplementaryActions = {
		user: props.user,
		userIsPostOwner: props.userIsPostOwner,
		onReportClick: props.onReportClick,
		onBanClick: props.onBanClick,
		onExcludeClick: props.onExcludeClick,
	}

	return (
			<div className={'flex gap-x-2 w-full justify-start ' + props.className}>
				<button
						onClick={ props.onLikeClick }
						className="cursor-pointer hover:bg-primary-dark text-primary-light flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					{
						props.isLiked ?
								<IonIcon icon={ heart } /> :
								<IonIcon icon={ heartOutline } />
					}
					<span>{ props.likeCount }</span>
				</button>

				<button
						onClick={props.onAnswerClick}
						className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					<IonIcon icon={ chatbubbleOutline } />
					<span>{ props.commentCount }</span>
				</button>
				{
					breakpoint >= DeviceWidthBreakpoints.XL ?
						<PostActionsSpread {...complementaryActionsProps} /> :
						<PostActionsAsMenu {...complementaryActionsProps} />
				}
			</div>
	);
}

type PostComplementaryActions = {
	user: CurrentUser | null;
	userIsPostOwner: boolean;
	onReportClick: () => void;
	onBanClick: () => void;
	onExcludeClick: () => void;
}

function PostActionsSpread(props: PostComplementaryActions) {
	return (
			<>
				<button
						onClick={props.onReportClick}
						className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
					<IonIcon icon={ flagOutline } />
					<span>Denunciar</span>
				</button>

				{
					(props.user && [Role.ADMIN, Role.MODERATOR].includes(props.user.role)) &&
							<button
								onClick={props.onBanClick}
								className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
								<IonIcon icon={ hammerOutline } />
								<span>Banir Usuário</span>
							</button>
				}
				{
					(props.user && (props.userIsPostOwner || [Role.ADMIN, Role.MODERATOR].includes(props.user.role))) &&
							<button
								onClick={props.onExcludeClick}
								className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
								<IonIcon icon={ trashOutline } />
								<span>Apagar</span>
							</button>
				}
			</>
	);
}

function PostActionsAsMenu(props: PostComplementaryActions) {
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
			<>
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
							<MenuItem onClick={ props.onReportClick }>
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
							{ (props.user && (props.userIsPostOwner || [Role.ADMIN, Role.MODERATOR].includes(props.user.role))) &&
										<MenuItem onClick={ props.onExcludeClick }>
											<ListItemIcon>
												<IonIcon icon={trashOutline} />
											</ListItemIcon>
											<ListItemText>Apagar</ListItemText>
										</MenuItem>
							}
						</MenuList>
					</Menu>
			</>
	)
}