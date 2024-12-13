import { useCallback, useEffect } from 'react';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import { Controller, useForm } from 'react-hook-form';
import useCurrentUser from '@/hooks/useCurrentUser';
import Report, { ReportStatus } from '@models/Report';
import { useResolveReport } from '@/hooks/useReport.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import SelectInput, { SelectInputSource } from '@shared/components/formComponents/SelectInput.tsx';
import TextArea from '@shared/components/formComponents/TextArea.tsx';

export type ReportResolveModalProps = {
	report?: Report;
	onChange?: (resolvedReport: Report) => void;
} & ModalPopupProps;
type ReportFormData = {
	resolution: string;
	status: ReportStatus;
}

const statusSelectSource: SelectInputSource = [
	{ value: ReportStatus.DEFERRED, name: 'Deferido'  },
	{ value: ReportStatus.PENDING	,	name: 'Pendente'  },
	{ value: ReportStatus.INFERRED,	name: 'Indeferido' },
];

export default function ReportResolveModal(props: ReportResolveModalProps) {
	const { user } = useCurrentUser();
	const { notifyError, notifySuccess } = useNotification();
	const { handleSubmit, reset: setFormData, formState: { errors }, clearErrors, control } =
			useForm<ReportFormData>({
				defaultValues: {
					resolution: '',
					status: ReportStatus.PENDING,
				},
			});

	useEffect(() => {
		if (props.isOpen)
			if (props.report) {
				setFormData({
					resolution: props.report.resolution,
					status: props.report.status,
				});
			} else {
				notifyError('Erro ao carregar denuncia.');
				props.onCloseRequest?.();
			}
	}, [props.isOpen]);

	const { resolveReport, isResolveReportLoading } = useResolveReport(user!.token, {
		onSuccess: (report: Report) => {
			notifySuccess('Denuncia resolvida');
			props.onChange?.(report);
			props.onCloseRequest?.();
		},
		onError: (error: AxiosError | Error) => handleRequestError(error)
	});

	// ---- API Calls Error Handling ----
	const { handleRequestError } = useRequestErrorHandler({
		mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde.", log: true }],
		onError: (message: string) => notifyError(message)
	});

	const resetForm = useCallback(() => {
		clearErrors();
		setFormData();
	}, []);

	const onSubmit = useCallback((data: ReportFormData) => {
		if (!props.report) {
			notifyError('Erro ao carregar denuncia.')
			return props.onCloseRequest?.()
		}

		props.report.status = data.status;
		props.report.resolution = data.resolution;

		resolveReport(props.report)
	}, []);

	return (
			<ModalPopup
					title='Resolver Denuncia'
					isOpen={ props.isOpen }
					bottomText={ props.bottomText }
					topText={ props.topText }
					onCloseRequest={() => {
						resetForm();
						props.onCloseRequest?.();
					}}
					className='flex flex-col gap-y-3'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='flex min-h-full flex-col justify-between gap-y-3'>
						<Controller
								name="status"
								control={ control }
								rules={{ validate: (value) => value > -1 || 'É necessário especificar uma Categoria.' }}
								render={({ field }) => (
										<SelectInput
												{...field}
												name="Status"
												disabled={ props.report?.status !== ReportStatus.PENDING }
												source={ statusSelectSource }
												hasSelectOption
												containerClassName='flex flex-col'
												className={
														'input-text '
														+ (errors.status ? ' bg-red-100 border-red-500' : ' bg-slate-200')
												} />
								)} />
						<Controller
								name="resolution"
								control={ control }
								rules={{ required: 'É necessário especificar algum conteúdo.' }}
								render={({ field }) => (
										<TextArea
												{...field}
												name="Resolução"
												disabled={ props.report?.status !== ReportStatus.PENDING }
												className={
														'w-96 min-h-44'
														+ (errors.resolution ? ' bg-red-100 border-red-500' : ' bg-slate-200')
												} />
								)} />
					</div>
					{
						props.report?.status === ReportStatus.PENDING &&
							<input
									type='submit'
									disabled={ isResolveReportLoading }
									value='Confirmar'
									className='btn-primary mt-4 w-full'
							/>
					}
				</form>
			</ModalPopup>
	);
}
