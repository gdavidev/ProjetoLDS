import { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Alert } from '@mui/material';
import { UseMutationResult } from 'react-query';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import Emulator from '@/models/Emulator';
import { FormState, useForm } from 'react-hook-form';
import FileUtil from '@/libs/FileUtil';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useStoreEmulator } from '@/hooks/useEmulators';

export type EmulatorEditModalProps = {
	emulator: Emulator;
	onChange?: (newEmulator: Emulator) => void;
} & ModalPopupProps;
interface IEmulatorFormData {
	company: string;
	console: string;
	abbreviation: string;
	file?: FileList;
}

const defaultValues: IEmulatorFormData = {
	company: '',
	console: '',
	abbreviation: '',
	file: undefined,
};

export default function EmulatorEditModal(props: EmulatorEditModalProps) {
	const { user } = useCurrentUser();
	const {
		register,
		handleSubmit,
		reset: setFormData,
		clearErrors,
	} = useForm<IEmulatorFormData>({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		if (props.emulator.id !== 0)
			setFormData({
				company: props.emulator.companyName,
				console: props.emulator.console,
				abbreviation: props.emulator.abbreviation,
				file: FileUtil.createFileList(props.emulator.file),
			});
	}, [props.isOpen]);

	const {
		mutate: storeEmulator,
		reset: resetStoreEmulator,
		isLoading: isSendingEmulator,
	} = useStoreEmulator(user?.token!, {
		onSuccess: (emulator: Emulator) => props.onChange?.(emulator),
		onError: (err: any) => console.log('err: ' + JSON.stringify(err)),
	});

	const resetForm = () => {
		resetStoreEmulator();
		clearErrors();
		setFormData();
	};

	function onSubmit(data: IEmulatorFormData) {
		const emulatorFile: File | undefined = data.file instanceof FileList ? data.file[0] : data.file;
		const newEmulator: Emulator = new Emulator(
			props.emulator.id,
			data.abbreviation,
			data.console,
			data.company,
			emulatorFile
		);
		storeEmulator(newEmulator);
	}

	return (
		<ModalPopup
			title={props.emulator.id === 0 ? 'Adicionar Jogo' : 'Editar Jogo'}
			isOpen={props.isOpen}
			bottomText={props.bottomText}
			topText={props.topText}
			onCloseRequest={() => {
				resetForm();
				props.onCloseRequest?.();
			}}
			className='flex flex-col gap-y-3'>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* { getAlert(formState, emulatorService) } */}
				<div className='flex min-h-full flex-col justify-between gap-y-3'>
					<FormControl>
						<FormLabel>Console</FormLabel>
						<input {...register('console', { required: true })} className='input-text' />
					</FormControl>
					<FormControl>
						<FormLabel>Empresa</FormLabel>
						<input {...register('company', { required: true })} className='input-text' />
					</FormControl>
					<FormControl>
						<FormLabel>Abreviação</FormLabel>
						<input {...register('abbreviation', { required: true })} className='input-text' />
					</FormControl>
				</div>
				<input
					type='submit'
					disabled={isSendingEmulator}
					value='Confirmar'
					className={'btn-r-md mt-4 w-full bg-primary text-white' + (isSendingEmulator ? ' disabled' : '')}
				/>
			</form>
		</ModalPopup>
	);
}

function getAlert(
	formState: FormState<IEmulatorFormData>,
	emulatorService: UseMutationResult<any, any, any, any>
): JSX.Element | undefined {
	if (formState.errors.console) return <Alert color='error'>Campo console vazío.</Alert>;
	if (formState.errors.company) return <Alert color='error'>Campo empresa vazío.</Alert>;
	if (formState.errors.abbreviation) return <Alert color='error'>Campo nome vazío.</Alert>;
	if (emulatorService.isLoading) return <Alert color='warning'>Enviando...</Alert>;
	if (emulatorService.isSuccess) return <Alert color='success'>Enviado com sucesso!</Alert>;
	if (emulatorService.isError) return <Alert color='error'>{emulatorService.error.message}</Alert>;
	return undefined;
}
