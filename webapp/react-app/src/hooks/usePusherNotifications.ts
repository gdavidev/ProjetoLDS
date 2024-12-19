import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import CurrentUser from '@models/CurrentUser.ts';

type NotificationDTO = {
	id_content: string;
	message: string;
}
type Notification = {
	contentType: 'Post' | 'Comment';
	contentId: string;
	message: string;
}

type UsePusherNotificationsOptions = {
	user: CurrentUser | null;
}

export default function usePusherNotifications(options: UsePusherNotificationsOptions) {
	const [ notification, setNotification ] = useState<Notification | null>(null);

	useEffect(() => {
		if (options.user) {
			// Initialize Pusher
			const pusher = new Pusher('c2af53527e653bf225b9', {
				cluster: 'mt1',
			});

			const channel = pusher.subscribe("like-channel-" + options.user.id);

			// Listen to events
			channel.bind("like-event", (data: NotificationDTO) => {
				setNotification({
					contentType: data.message.endsWith('Topico') ? 'Post' : 'Comment',
					contentId: data.id_content,
					message: data.message,
				});
			});
		}
	}, [options.user]);

	return notification;
};