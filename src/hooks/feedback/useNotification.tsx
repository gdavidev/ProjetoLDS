import { MainContext } from '@shared/context/MainContextProvider.tsx';
import { useCallback, useContext } from 'react';
import { NotificationProps } from '@shared/components/Notification.tsx';

const useNotificationDefaults: NotificationProps = {
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
	notifyError: (msg: string | JSX.Element | JSX.Element[]) => void;
	notifySuccess: (msg: string | JSX.Element | JSX.Element[]) => void;
	notifyWarning: (msg: string | JSX.Element | JSX.Element[]) => void;
}

export default function useNotification(): useNotification {
	const mainContext = useContext(MainContext);
	if (!mainContext)
		throw new Error('useNotification must be used within MainContext');

	const notifyError = useCallback((msg: string | JSX.Element | JSX.Element[]) => {
		mainContext.setNotificationProps({
			...useNotificationDefaults,
			message: msg,
		});
	}, []);
	const notifySuccess = useCallback((msg: string | JSX.Element | JSX.Element[]) => {
		mainContext.setNotificationProps({
			...useNotificationDefaults,
			message: msg,
			severity: 'success',
		});
	}, []);
	const notifyWarning = useCallback((msg: string | JSX.Element | JSX.Element[]) => {
		mainContext.setNotificationProps({
			...useNotificationDefaults,
			message: msg,
			severity: 'warning',
		});
	}, []);

	return {
		setNotification: mainContext.setNotificationProps,
		notifyError: notifyError,
		notifySuccess: notifySuccess,
		notifyWarning: notifyWarning,
	}
}