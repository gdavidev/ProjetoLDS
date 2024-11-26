import useNotification from '@/hooks/feedback/useNotification.tsx';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

type UseEmergencyExitResult = {
	exit: (location: string, reason: string) => void;
};

export default function useEmergencyExit(): UseEmergencyExitResult {
	const navigate = useNavigate();
	const { setNotification } = useNotification()

	const exit = useCallback((location: string, reason: string) => {
		setNotification({
			severity: 'error',
			message: reason,
			autoHideDuration: 500,
			anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
		})
		navigate(location);
	}, [])

	return {
		exit: exit
	}
}