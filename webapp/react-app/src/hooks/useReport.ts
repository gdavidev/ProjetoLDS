import { useMutation, useQuery } from 'react-query';
import { AxiosError } from 'axios';
import ApiService from '@api/ApiService.ts';
import Report from '@models/Report.ts';
import * as DTO from '@models/data/ReportDTOs.ts'
import { useCallback } from 'react';

const endpoints = {
	get: '/api/denuncia/list/',
	post: '/api/denuncia/create/',
	resolve: '/api/denuncia/update/',
}

type useReportOptions<T> = {
	onSuccess?: (report: T) => void,
	onError?: (err: AxiosError | Error) => void,
}

export default function useSendReport(token: string, options?: useReportOptions<any>) {
	const postReport =
			useCallback(async (report: Report) => {
				return await ApiService.post<DTO.ReportGetResponseDTO>(
						endpoints.post,
						report.toCreateDTO(),
						{ headers: { 'Authorization': 'Bearer ' + token } });
			}, [token]);

	const { mutate: sendReport, isLoading: isSendReportLoading, ...rest } =
			useMutation('SEND_REPORT',
					postReport,
					{...options}
			);

	return { sendReport, isSendReportLoading, ...rest };
}

export function useReports(token: string, options?: useReportOptions<Report[]>) {
	const fetchReports = useCallback(async () => {
		const resp =
				await ApiService.get<DTO.ReportGetResponseDTO[]>(endpoints.get,
						{ headers: { 'Authorization': 'Bearer ' + token } });
		return resp.data.map((rep: DTO.ReportGetResponseDTO) => Report.fromGetDTO(rep));
	}, [token])

	const { data: reports, isLoading: isReportsLoading, refetch: reloadReports, ...rest } =
			useQuery('FETCH_REPORTS',
					fetchReports, {
					onSuccess: options?.onSuccess,
					onError: options?.onError
			});

	return { reports, isReportsLoading, reloadReports, ...rest }
}

export function useResolveReport(token: string, options?: useReportOptions<Report>) {
	const postResolveReport =
			useCallback(async (report: Report) => {
				const res = await ApiService.post<DTO.ReportGetResponseDTO>(
						endpoints.resolve,
						report.toResolveDTO(),
						{ headers: { 'Authorization': 'Bearer ' + token } });
				return Report.fromGetDTO(res.data)
			}, [token]);

	const { mutate: resolveReport, isLoading: isResolveReportLoading, ...rest } =
			useMutation('RESOLVE_REPORT',
					postResolveReport,
					{...options}
			);

	return { resolveReport, isResolveReportLoading, ...rest };
}