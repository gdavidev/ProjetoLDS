import { OverlayContext } from '@shared/context/OverlayContextProvider.tsx';
import { useCallback, useContext } from 'react';
import { NotificationProps } from '@shared/components/Notification.tsx';

type MessageOrElement = string | JSX.Element | JSX.Element[];
type Severity = 'error' | 'success' | 'warning' | 'info';
type useNotification = {
	setNotification: (value: NotificationProps) => void;
	notifyError: (msg: MessageOrElement) => void;
	notifySuccess: (msg: MessageOrElement) => void;
	notifyInfo: (msg: MessageOrElement) => void;
	notifyWarning: (msg: MessageOrElement) => void;
}

export default function useNotification(): useNotification {
	const overlayContext = useContext(OverlayContext);
	if (!overlayContext)
		throw new Error('useNotification must be used within OverlayContext');

	const triggerNotification =
			useCallback((msg: MessageOrElement, severity: Severity) => {
					overlayContext.setNotificationProps({
						open: true,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right'
						},
						autoHideDuration: 3000,
						message: msg,
						severity: severity
					});
				}, []);

	return {
		setNotification: overlayContext.setNotificationProps,
		notifyError: useCallback((msg: MessageOrElement) => triggerNotification(msg, 'error'), []),
		notifySuccess: useCallback((msg: MessageOrElement) => triggerNotification(msg, 'success'), []),
		notifyInfo: useCallback((msg: MessageOrElement) => triggerNotification(msg, 'info'), []),
		notifyWarning: useCallback((msg: MessageOrElement) => triggerNotification(msg, 'warning'), []),
	}
}