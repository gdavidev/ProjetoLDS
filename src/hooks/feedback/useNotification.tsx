import { MainContext } from '@shared/context/MainContextProvider.tsx';
import { useContext } from 'react';
import { NotificationProps } from '@shared/components/Notification.tsx';

type UseSnackbarResult = {
	setNotification: (value: NotificationProps) => void;
}

export default function useNotification(): UseSnackbarResult {
	const mainContext = useContext(MainContext);
	if (!mainContext)
		throw new Error('useNotification must be used within MainContext');

	return {
		setNotification: mainContext.setNotificationProps
	}
}