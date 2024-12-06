import { useMutation, useQuery } from 'react-query';
import { AxiosError } from 'axios';
import ApiService from '@api/ApiService.ts';
import Report from '@models/Report.ts';
import * as DTO from '@models/data/ReportDTOs.ts'

const endpoints = {
	get: '/denuncia/list/',
	post: '/denuncia/create/',
}

type useReportOptions<T> = {
	onSuccess?: (report: T) => void,
	onError?: (err: AxiosError | Error) => void,
}

export default function useSendReport(token: string, options?: useReportOptions<Report>) {
	return useMutation('SEND_REPORT',
			async (report: Report) => {
				const resp =
						await ApiService.post<DTO.ReportCreateResponseDTO>(endpoints.post,
								report.toCreateDTO(),
								{ headers: { 'Authorization': 'Bearer ' + token } });
				report.id = resp.data.id;
				return report;
			}, {
				onSuccess: options?.onSuccess,
				onError: options?.onError
			});
}

export function useReports(token: string, options?: useReportOptions<Report[]>) {
	return useQuery('FETCH_REPORT',
			async () => {
				const resp =
						await ApiService.get<DTO.ReportGetResponseDTO[]>(endpoints.get,
								{ headers: { 'Authorization': 'Bearer ' + token } });
				return resp.data.map((rep: DTO.ReportGetResponseDTO) => Report.fromGetDTO(rep));
			}, {
				onSuccess: options?.onSuccess,
				onError: options?.onError
			});
}