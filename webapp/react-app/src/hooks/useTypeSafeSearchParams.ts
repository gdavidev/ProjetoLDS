import { useCallback, useEffect, useState } from 'react';

type useTypeSafeSearchParamsResult<T extends Record<string, string | number | undefined>> = {
	params: T,
	setParams: (param: T | string, value: string) => void;
	clearParams: () => void;
}

export default function useTypeSafeSearchParams<T extends Record<string, string | number | undefined>>(
		defaultValue: T
): useTypeSafeSearchParamsResult<T> {
	const [ typedParams, setTypedParams ] = useState<T>(defaultValue);

	useEffect(() => {
		updateTypedParams();
	}, [window.location.search]);

	const updateTypedParams = useCallback(() => {
		const params = new URLSearchParams(window.location.search);

		let tmpTypedParams: Partial<T> = {}
		for (const key of Object.keys(defaultValue)) {
			tmpTypedParams = { ...tmpTypedParams, [key]: params.get(key) ?? defaultValue[key] };
		}

		setTypedParams(tmpTypedParams as T);
	}, []);

	const setParams = useCallback((param: T | string, value: string) => {
		const currentLocation: string = window.location.origin + window.location.pathname;

		let newParams: URLSearchParams;
		if (typeof param === 'string') {
			newParams = new URLSearchParams(window.location.search);
			newParams.set(param, value);
		} else {
			newParams = new URLSearchParams(param.toString());
		}

		const newUrl = currentLocation + '?' + newParams.toString();
		window.history.pushState({}, '', newUrl);
		updateTypedParams();
	}, []);

	const clear = useCallback(() => {
		window.history.pushState({}, '', window.location.origin + window.location.pathname);
	}, []);

	return {
		params: typedParams,
		setParams: setParams,
		clearParams: clear
	};
}