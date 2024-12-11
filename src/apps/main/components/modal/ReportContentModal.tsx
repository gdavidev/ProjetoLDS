import ModalPopup, { ModalPopupProps } from '@shared/components/ModalPopup.tsx';
import TextArea from '@shared/components/formComponents/TextArea.tsx';
import { Controller, useForm } from 'react-hook-form';
import Report, { ReportContentType } from '@models/Report.ts';
import useSendReport from '@/hooks/useReport.ts';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { useCallback } from 'react';

type ReportContentModalProps = {
	contentType: ReportContentType;
	contentId: number;
} & ModalPopupProps

type ReportContentModalFormData = {
	reportText: string
}

export default function ReportContentModal(props: ReportContentModalProps) {
	const { user } = useCurrentUser();
	const { notifySuccess, notifyError } = useNotification();
	const { handleSubmit, control } = useForm<ReportContentModalFormData>({
		defaultValues: {
			reportText: ''
		}
	});

	const { mutate: sendReport } = useSendReport(user?.token!, {
		onSuccess: () => {
			notifySuccess('Denúncia enviada com sucesso.')
			props.onCloseRequest?.()
		},
		onError: () => notifyError('Houve um erro, tente novamente mais tarde')
	});

	const submitForm = useCallback((data: ReportContentModalFormData) => {
		sendReport({
			reported_by: user!.id,
			content_type: Report.serializeContentType(props.contentType),
			content_id: props.contentId,
			reason: data.reportText,
		})
	}, [])

	return (
			<ModalPopup
					isOpen={ props.isOpen }
					title="Recuperação de Senha"
					onCloseRequest={ props.onCloseRequest }
					className='bg-layout-background'
			>
				<form onSubmit={ handleSubmit(submitForm) }>
					<Controller
							name="reportText"
							control={control}
							render={({ field }) => (
									<TextArea
											{...field}
											name='reportText'
											labelClassName='hidden'
									/>
							)} />
					<button
							type='submit'
							className='btn-r-md text-white bg-primary'
							onClick={ props.onCloseRequest }
					>
						Enviar
					</button>
				</form>
			</ModalPopup>
	)
}