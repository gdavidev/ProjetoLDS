import { useCallback, useContext } from 'react';
import { OverlayContext } from '@shared/context/OverlayContextProvider.tsx';
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';

type OpenMessageBoxParams = {
	title?: string,
	message?: string,
	type?: MessageBoxType
	onClick: (result: MessageBoxResult) => void
}

type UseMessageBoxResult = {
	openMessageBox: (params: OpenMessageBoxParams) => void
}

export default function useMessageBox(): UseMessageBoxResult {
	const overlayContext = useContext(OverlayContext);
	if (!overlayContext)
		throw new Error('useNotification must be used within OverlayContext');

	const openMessageBox = useCallback((params: OpenMessageBoxParams) => {
		overlayContext.setMessageBoxProps({
			title: params.title ?? 'Aviso',
			message: params.message ?? 'Você tem certeza?',
			type: params.type ?? MessageBoxType.YES_NO,
			onClick: params.onClick,
			isOpen: true
		});
	}, [])

	return {
		openMessageBox: openMessageBox
	}
}