import { Alert, Snackbar } from '@mui/material';

export type NotificationProps = {
	severity: 'info' | 'warning' | 'success' | 'error',
	message: string,
	anchorOrigin?: {
		vertical: 'top' | 'bottom',
		horizontal: 'left' | 'right',
	},
	autoHideDuration: number,
	open?: boolean,
	onClose?: () => void,
}

export default function Notification(props: NotificationProps) {
	return (
		<Snackbar
				open={ props.open }
				onClose={ props.onClose }
				anchorOrigin={props.anchorOrigin}>
			<Alert
					onClose={ props.onClose }
					severity={ props.severity }
					variant="filled"
					sx={{ width: '100%' }}>
				{ props.message }
			</Alert>
		</Snackbar>
	)
}