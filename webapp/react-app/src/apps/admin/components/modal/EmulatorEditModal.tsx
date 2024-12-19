import { useCallback, useEffect } from 'react';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import Emulator from '@/models/Emulator';
import { Controller, useForm } from 'react-hook-form';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useStoreEmulator } from '@/hooks/useEmulators';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useAlert from '@/hooks/feedback/useAlert.tsx';
import TextInput from '@shared/components/formComponents/TextInput.tsx';

export type EmulatorEditModalProps = {
	emulator?: Emulator;
	onChange?: (newEmulator: Emulator) => void;
} & ModalPopupProps;
interface IEmulatorFormData {
	company: string;
	console: string;
	abbreviation: string;
}

export default function EmulatorEditModal(props: EmulatorEditModalProps) {
	const { alertElement, error, info } = useAlert();
	const { notifyError, notifySuccess } = useNotification();
	const { user, forceLogin } = useCurrentUser();
	const { formState: { errors }, control, watch, handleSubmit, reset: setFormData, clearErrors } =
			useForm<IEmulatorFormData>({
				defaultValues: {
					company: '',
					console: '',
					abbreviation: '',
				},
			});

	// ---- Initialization ----
	useEffect(() => {
		if (props.emulator && props.emulator.id !== 0)
			setFormData({
				company: props.emulator.companyName,
				console: props.emulator.console,
				abbreviation: props.emulator.abbreviation,
			});
	}, [props.isOpen]);

	// ---- API Calls Setup ----
	const { mutate: storeEmulator, reset: resetStoreEmulator, isLoading: isSendingEmulator } =
			useStoreEmulator(user?.token!, {
				onSuccess: (emulator: Emulator) => {
					props.onChange?.(emulator);
					props.onCloseRequest?.();
					notifySuccess((props.emulator && props.emulator.id !== 0) ?
							'Emulador criado com sucesso' :
							'Emulador alterado com sucesso'
					);
				},
				onError: (err: AxiosError | Error) => handleRequestError(err)
			});

	// ---- API Calls Error Handling ----
	const { handleRequestError } = useRequestErrorHandler({
		mappings: [
			{ status: 401, onError: () => forceLogin('Seu login expirou, por favor entre novamente') },
			{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }
		],
		onError: (message: string) => {
			notifyError(message)
			props.onCloseRequest?.();
		}
	});

	// ---- API Calls Execution ----
	const onSubmit = useCallback((data: IEmulatorFormData) => {
		const newEmulator: Emulator = new Emulator(
				data.abbreviation,
				data.console,
				data.company,
				props.emulator ? props.emulator.id : 0,
		);
		storeEmulator(newEmulator);
	}, []);

	// ---- Form Error handling ----
	useEffect(() => {
		const formError =
				Object.values(errors).find(err => err.message !== undefined)
		if (formError && formError.message) error(formError.message);
	}, [watch()]);

	// ---- General callbacks ----
	const resetForm = useCallback(() => {
		resetStoreEmulator();
		clearErrors();
		setFormData();
	}, []);

	// ---- State Handling ----
	useEffect(() => {
		if (isSendingEmulator)
			info('Enviando...');
	}, [isSendingEmulator]);

	return (
		<ModalPopup
			title={ (props.emulator && props.emulator.id === 0) ? 'Adicionar Emulador' : 'Editar Emulador' }
			isOpen={props.isOpen}
			bottomText={props.bottomText}
			topText={props.topText}
			onCloseRequest={() => {
				resetForm();
				props.onCloseRequest?.();
			}}
			className='flex flex-col gap-y-3'>
			<form onSubmit={handleSubmit(onSubmit)}>
				{ alertElement }
				<div className='flex min-h-full flex-col justify-between gap-y-3'>
					<Controller
							name="console"
							control={ control }
							rules={{ required: 'É necessário especificar um Console.' }}
							render={ ({field}) => (
									<TextInput
											{...field}
										 name="Console"
										 inputClassName={
													'input-text' + (errors.console ? ' bg-red-100 border-red-500' : ' bg-slate-200')
											}
										 inputContainerClassName="rounded-md overflow-hidden" />
							) }/>

					<Controller
							name="company"
							control={ control }
							rules={{ required: 'É necessário especificar uma Empresa.' }}
							render={ ({field}) => (
									<TextInput
											{...field}
											name="Empresa"
											inputClassName={
													'input-text' + (errors.company ? ' bg-red-100 border-red-500' : ' bg-slate-200')
											}
											inputContainerClassName="rounded-md overflow-hidden" />
							) }/>

					<Controller
							name="abbreviation"
							control={ control }
							rules={{ required: 'É necessário especificar uma Abreviação para o console.' }}
							render={ ({field}) => (
									<TextInput
											{...field}
											name="Abreviação"
											inputClassName={
													'input-text' + (errors.abbreviation ? ' bg-red-100 border-red-500' : ' bg-slate-200')
											}
											inputContainerClassName="rounded-md overflow-hidden" />
							) }/>

				</div>
				<input
						type='submit'
						disabled={ isSendingEmulator }
						value='Confirmar'
						className='btn-primary mt-4 w-full' />
			</form>
		</ModalPopup>
	);
}
