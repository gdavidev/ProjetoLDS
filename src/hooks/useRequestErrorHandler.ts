import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import useEnvironment from '@/hooks/useEnvironment.ts';

type useRequestErrorHandlerErrorMapping = {
	status: number | number[] | 'default',
	userMessage?: string | ((resData: any) => string),
	debugMessage?: string | ((resData: any) => string),
	onError?: (message: string, resData: any) => void,
	log?: boolean
}
type useRequestErrorHandlerOptions = {
	mappings: useRequestErrorHandlerErrorMapping[],
	onError?: (message: string, cause: number | number[] | string, resData: any | undefined) => void,
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
				const finalUserMessage = resolveMessage(matchingMapping.userMessage, err.response.data);

				if (matchingMapping.log && isDebug)
					console.error(resolveMessage(matchingMapping.debugMessage, err.response.data));

				setMessage(finalUserMessage);
				matchingMapping.onError?.(finalUserMessage, err.response.data)
				options.onError?.(finalUserMessage, matchingMapping.status, err.response.data)
				return finalUserMessage;
			}
		} else if (isDebug) {
			console.error(err.stack);
			options.onError?.(err.message, 'default', undefined)
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

function resolveMessage(message: string | ((resData: any) => string) | undefined, resData: any) {
	if (message === undefined)
		return ''

	if (typeof message === 'function') {
		return message(resData)
	} else {
		return message;
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