import { MainContext } from '@shared/context/MainContextProvider.tsx';
import { useContext } from 'react';
import { NotificationProps } from '@shared/components/Notification.tsx';

export const useNotificationDefaults: NotificationProps = {
	open: true,
	message: "Erro",
	severity:'error',
	anchorOrigin: {
		vertical: 'bottom',
		horizontal: 'right'
	},
	autoHideDuration: 3000,
}

type useNotification = {
	setNotification: (value: NotificationProps) => void;
}

export default function useNotification(): useNotification {
	const mainContext = useContext(MainContext);
	if (!mainContext)
		throw new Error('useNotification must be used within MainContext');

	return {
		setNotification: mainContext.setNotificationProps
	}
}