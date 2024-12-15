import { useCallback, useContext } from 'react';
import { MainContext } from '@shared/context/MainContextProvider.tsx';
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
	const mainContext = useContext(MainContext);
	if (!mainContext)
		throw new Error('useMessageBox must be used within a MainContextProvider');

	const openMessageBox = useCallback((params: OpenMessageBoxParams) => {
		mainContext.setMessageBoxProps({
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