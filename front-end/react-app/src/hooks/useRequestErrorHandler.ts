import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import useEnvironment from '@/hooks/useEnvironment.ts';

type useRequestErrorHandlerErrorMapping = {
	status: number | number[] | 'default',
	userMessage?: string,
	debugMessage?: string,
	log?: boolean
}
type useRequestErrorHandlerOptions = {
	mappings: useRequestErrorHandlerErrorMapping[],
	onError?: (message: string) => void,
}
type useRequestErrorHandlerResult = {
	handleRequestError: (err: AxiosError | Error) => void,
	message: string
	isError: boolean
	clear: () => void
}

export default function useRequestErrorHandler(options?: useRequestErrorHandlerOptions): useRequestErrorHandlerResult {
	const [ isError, setIsError ] = useState<boolean>(false);
	const [ message, setMessage ] = useState<string>('');
	const { isDebug } = useEnvironment()

	const clear = useCallback(() => {
		setIsError(false);
	}, [])

	const handleRequestError = useCallback((err: AxiosError | Error): string => {
		setIsError(true);
		if (options === undefined)
			return '';

		if (err instanceof AxiosError && err.response !== undefined) {
			const matchingMapping: useRequestErrorHandlerErrorMapping | null =
					findMapping(err.response.status, options.mappings)

			if (matchingMapping !== null) {
				const finalUserMessage = matchingMapping.userMessage || ''
				if (matchingMapping.log && isDebug)
					console.error(matchingMapping.debugMessage);

				setMessage(finalUserMessage);
				options.onError?.(finalUserMessage)
				return finalUserMessage;
			}
		} else if (isDebug) {
			console.error(err.stack);
			options.onError?.(err.message)
			return err.name + ": " + err.message;
		}

		return "Por favor, tente novamente mais tarde.";
	}, [])

	return {
		handleRequestError,
		message,
		isError,
		clear
	}
}

function findMapping(targetStatus: number, mappings: useRequestErrorHandlerErrorMapping[]): useRequestErrorHandlerErrorMapping | null {
	let defaultMapping: useRequestErrorHandlerErrorMapping | null = null;

	for (const map of mappings) {
		if (map.status === 'default') {
			defaultMapping = map;
			continue;
		}

		if (Array.isArray(map.status) && map.status.includes(targetStatus)) {
			return map;
		} else if (map.status === targetStatus) {
			return map;
		}
	}

	return defaultMapping;
}