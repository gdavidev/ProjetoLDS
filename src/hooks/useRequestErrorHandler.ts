import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import useEnvironment from '@/hooks/useEnvironment.ts';

type UseRequestErrorHandlerErrorMapping = {
	status: number | number[] | 'default',
	userMessage?: string | ((resData: any) => string),
	debugMessage?: string | ((resData: any) => string),
	onError?: (message: string, resData: any) => void,
	log?: boolean
}
export type UseRequestErrorHandlerOptions = {
	mappings: UseRequestErrorHandlerErrorMapping[],
	onError?: (message: string, cause: number | number[] | string, resData: any | undefined) => void,
}
export type UseRequestErrorHandlerResult = {
	handleRequestError: (err: AxiosError | Error) => void,
	message: string
	isError: boolean
	clear: () => void
	setError: (message: string) => void
}

export default function useRequestErrorHandler(options: UseRequestErrorHandlerOptions): UseRequestErrorHandlerResult {
	const [ isError, setIsError ] = useState<boolean>(false);
	const [ message, setMessage ] = useState<string>('');
	const { isDebug } = useEnvironment()

	const clear = useCallback(() => {
		setIsError(false);
		setMessage('')
	}, [])

	const setError = useCallback((message: string) => {
		setIsError(true);
		setMessage(message)
	}, [])

	const handleRequestError = useCallback((err: AxiosError | Error): string => {
		setIsError(true);

		if (err instanceof AxiosError && err.response !== undefined) {
			const matchingMapping: UseRequestErrorHandlerErrorMapping | null =
					findMapping(err.response.status, options.mappings)

			if (matchingMapping !== null) {
				const finalUserMessage = resolveMessage(matchingMapping.userMessage, err.response.data);

				if (matchingMapping.log && isDebug)
					console.error(resolveMessage(matchingMapping.debugMessage, err.response.data));

				setMessage(finalUserMessage);
				if (matchingMapping.onError) {
					matchingMapping.onError(finalUserMessage, err.response.data);
				} else if (options.onError) {
					options.onError(finalUserMessage, err.response.status, err.response.data)
				}

				return finalUserMessage;
			}
		} else if (isDebug) {
			console.error(err.stack);
			options.onError?.(err.name + ": " + err.message, 'default', undefined)
			return err.name + ": " + err.message;
		}

		return "Por favor, tente novamente mais tarde.";
	}, []);

	return {
		handleRequestError: handleRequestError,
		message: message,
		isError: isError,
		clear: clear,
		setError: setError
	}
}

function resolveMessage(message: string | ((resData: any) => string) | undefined, resData: any) {
	if (message === undefined)
		return ''

	if (typeof message === 'function') {
		return message(resData)
	} else {
		return message;
	}
}

function findMapping(targetStatus: number, mappings: UseRequestErrorHandlerErrorMapping[]): UseRequestErrorHandlerErrorMapping | null {
	let defaultMapping: UseRequestErrorHandlerErrorMapping | null = null;

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