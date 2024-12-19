import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { useCallback } from 'react';
import ApiService from '@api/ApiService.ts';

const endpoints = {
	ban: '/api/denuncia/banned/',
	unBan: '/api/denuncia/unbanned/',
}

type UseBanOptions<T> = {
	onSuccess?: (banned: T) => void,
	onError?: (err: AxiosError | Error) => void,
}

export default function useBan(token: string, options?: UseBanOptions<boolean>) {
	const postBan = useCallback(async (userId: number) => {
		const res = await ApiService.get(
				endpoints.ban, {
					params: { user_id: userId },
					headers:  { 'Authorization': 'Bearer ' + token }
				});
		return res.data;
	}, [token]);

	const { mutate: ban, isLoading: isBanLoading, ...rest } = useMutation('BAN_USER', postBan, {...options});
	return { ban, isBanLoading, ...rest };
}