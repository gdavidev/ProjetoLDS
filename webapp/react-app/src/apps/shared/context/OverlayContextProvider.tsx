import Notification, { NotificationProps } from '@shared/components/Notification.tsx';
import MessageBox, { MessageBoxProps } from '@shared/components/MessageBox.tsx';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import usePusherNotifications from '@/hooks/usePusherNotifications.ts';
import { IonIcon } from '@ionic/react';
import { notifications as notificationBell } from 'ionicons/icons';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';

export type OverlayContextProps = {
	setNotificationProps: (snackbarProps: NotificationProps) => void,
	setMessageBoxProps: (messageBoxProps: MessageBoxProps) => void,
};

const defaultMainContextProps: OverlayContextProps = {
	setNotificationProps: () => null,
	setMessageBoxProps: () => null,
};
export const OverlayContext =
		createContext<OverlayContextProps>(defaultMainContextProps);

export default function OverlayContextProvider({ children }: PropsWithChildren) {
	const { user } = useCurrentUser();
	const notification = usePusherNotifications({ user: user });
	const [ pusherNotification  		, setPusherNotification   		] = useState<NotificationProps | null>(null);
	const [ isPusherNotificationOpen, setIsPusherNotificationOpen ] = useState<boolean>(false);
	const [ notificationProps , setNotificationProps  ] = useState<NotificationProps | null>(null);
	const [ isNotificationOpen, setIsNotificationOpen ] = useState<boolean>(false);
	const [ messageBoxProps , setMessageBoxProps  ] = useState<MessageBoxProps | null>(null);
	const [ isMessageBoxOpen, setIsMessageBoxOpen ] = useState<boolean>(false);

	useEffect(() => {
		if (notification) {
			setIsPusherNotificationOpen(true);
			setPusherNotification({
				severity: 'info',
				message: notification.message,
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
				autoHideDuration: 5000,
				icon: <IonIcon icon={ notificationBell } />
			});
		}
	}, [notification]);

	useEffect(() => {
		if (notificationProps)
			setIsNotificationOpen(true);
	}, [notificationProps]);

	useEffect(() => {
		if (messageBoxProps)
			setIsMessageBoxOpen(true);
	}, [messageBoxProps]);

	return (
			<OverlayContext.Provider
					value={{
						setNotificationProps: setNotificationProps,
						setMessageBoxProps: setMessageBoxProps,
					}}>
				{ children }
				{
						notificationProps &&
								<Notification
										{...notificationProps}
										open={ isNotificationOpen }
										onClose={ () => setIsNotificationOpen(false) }
								/>
				}
				{
						pusherNotification &&
								<Notification
										{...pusherNotification}
										open={ isPusherNotificationOpen }
										onClose={ () => setIsPusherNotificationOpen(false) }
								/>
				}
				{
						messageBoxProps &&
								<MessageBox
													{...messageBoxProps}
									isOpen={ isMessageBoxOpen }
									onCloseRequest={ () => setIsMessageBoxOpen(false) }
								/>
				}
			</OverlayContext.Provider>
	)
}