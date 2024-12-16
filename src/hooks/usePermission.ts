import { useCallback } from 'react';
import CurrentUser from '@models/CurrentUser.ts';

export enum Role {	ADMIN,	MODERATOR,	USER,	GUEST, BANNED_USER }
export enum ActionType {	VIEW,	CREATE,	UPDATE,	DELETE }
export enum ActionContext { ITS_OWN,	OTHER }
export enum PermissionCase {
	COMMENT,
	POST
}

type PermissionNode = {
	action: ActionType,
	context: ActionContext | ActionContext[] | 'all' | 'none'
}

type PermissionMap = Record<Role, Record<PermissionCase, PermissionNode | PermissionNode[] | 'all' | 'none'>>;

const permissionMap: PermissionMap = {
	[Role.ADMIN]: {
		[PermissionCase.COMMENT]: 'all',
		[PermissionCase.POST]: 'all',
	},
	[Role.MODERATOR]: {
		[PermissionCase.COMMENT]: { action: ActionType.VIEW, context: 'all' },
		[PermissionCase.POST]: [
			{ action: ActionType.VIEW, context: 'all' },
			{ action: ActionType.CREATE, context: ActionContext.ITS_OWN },
			{ action: ActionType.UPDATE, context: ActionContext.ITS_OWN },
			{ action: ActionType.DELETE, context: 'all' },
		]
	},
	[Role.USER]: {
		[PermissionCase.COMMENT]: [
			{ action: ActionType.VIEW, context: 'all' },
		],
		[PermissionCase.POST]: [
			{ action: ActionType.VIEW, context: 'all' },
			{ action: ActionType.CREATE, context: ActionContext.ITS_OWN },
			{ action: ActionType.UPDATE, context: ActionContext.ITS_OWN },
			{ action: ActionType.DELETE, context: 'all' },
		]
	},
	[Role.GUEST]: {
		[PermissionCase.COMMENT]: { action: ActionType.VIEW, context: 'all' },
		[PermissionCase.POST]: { action: ActionType.VIEW, context: 'all' },
	},
	[Role.BANNED_USER]: {
		[PermissionCase.COMMENT]: { action: ActionType.VIEW, context: 'all' },
		[PermissionCase.POST]: { action: ActionType.VIEW, context: 'all' },
	},
}

type UsePermissionOptions = {
	user: CurrentUser & { role: Role }
}
type UsePermissionResult = {
	hasPermission: (permissionCase: PermissionCase, action: ActionType, context: ActionContext) => boolean
}

export default function usePermission(options: UsePermissionOptions): UsePermissionResult {
	const hasPermission =
		useCallback((permissionCase: PermissionCase, action: ActionType, context: ActionContext) => {
			const holePermissions = permissionMap[options.user.role]
			if (!Object.keys(holePermissions).includes(permissionCase.toString()))
				return false;

			const permissionsInCase = holePermissions[permissionCase];
			if (permissionsInCase === 'all')
				return true;
			else if (permissionsInCase === 'none')
				return false;

			const permissionNode: PermissionNode | undefined = Array.isArray(permissionsInCase) ?
					permissionsInCase.find((node: PermissionNode) => node.action === action) :
					permissionsInCase;
			if (permissionNode === undefined)
				return false;

			return permissionNode.action === action && permissionNode.context === context;
		}, []);

	return {
		hasPermission
	}
}
