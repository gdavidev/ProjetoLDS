import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import { IonIcon } from '@ionic/react';
import { add, createOutline, trashOutline, reloadOutline } from 'ionicons/icons';
import TableDisplay from '@apps/admin/components/TableDisplay';
import { IconButton } from '@mui/material';
import Emulator from '@models/Emulator';
import EmulatorEditModal from '../components/modal/EmulatorEditModal';
import useStatefulArray from '@/hooks/useStatefulArray';
import useEmulators, { useDeleteEmulator } from '@/hooks/useEmulators';
import useCurrentUser from '@/hooks/useCurrentUser';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import { AxiosError } from 'axios';
import useNotification from '@/hooks/feedback/useNotification.tsx';

export default function EmulatorsView() {
	const { notifyError, notifySuccess } = useNotification();
	const [ emulatorModalData	 , setEmulatorModalData 	] = useState<Emulator | undefined>(undefined);
	const [ isEmulatorModalOpen, setIsEmulatorModalOpen ] = useState<boolean>(false);
	const { user, forceLogin } = useCurrentUser();
	const emulators = useStatefulArray<Emulator>([], {
		compare: (emu1: Emulator, emu2: Emulator) => emu1.id === emu2.id,
	});

	const { refetch: reload } = useEmulators({
		onSuccess: (list: Emulator[]) => emulators.set(list.sort((prev, curr) => prev.id - curr.id)),
		onError: (err: AxiosError | Error) => handleRequestError(err),
	});
	const { mutate: deleteEmulator } = useDeleteEmulator(user?.token!, {
		onSuccess: (emulator: Emulator) => {
			notifySuccess("Emulador removido com sucesso!");
			emulators.remove(emulator);
		},
		onError: (err: AxiosError | Error) => handleRequestError(err),
	});

	// ---- API Calls Error Handling ----
	const { handleRequestError } = useRequestErrorHandler({
		mappings: [
			{ status: 401, onError: () => forceLogin('Seu login expirou, por favor entre novamente') },
			{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }
		],
		onError: (message: string) => notifyError(message)
	});

	const addEmulator = useCallback(() => {
		setEmulatorModalData(undefined);
		setIsEmulatorModalOpen(true);
	}, []);
	const editEmulator = useCallback((emulator: Emulator) => {
		setEmulatorModalData(emulator);
		setIsEmulatorModalOpen(true);
	}, []);

	const templateHeader: { colName: string; colWidth: string }[] = [
		{ colName: '#', colWidth: '30px' },
		{ colName: 'Console', colWidth: '100%' },
		{ colName: 'Empresa', colWidth: '120px' },
		{ colName: 'Abreviação', colWidth: '160px' },
		{ colName: '', colWidth: '120px' },
	];

	return (
		<>
			<div className='flex flex-col'>
				<div className='mx-5 flex items-center justify-between text-white'>
					<h2 className='font-rubik font-bold'>Lista de Emuladores</h2>
					<div className='flex gap-x-2'>
						<IconButton onClick={() => reload()}>
							<IonIcon icon={reloadOutline} />
						</IconButton>
						<button className='btn-primary' onClick={addEmulator}>
							<IonIcon icon={add} /> Novo Emulador
						</button>
					</div>
				</div>
				<TableDisplay
					headerTemplate={templateHeader}
					tableStyleObject={{
						width: '100%',
						borderSpacing: '0 3px',
					}}
					tableHeaderClassName='text-white font-rubik font-bold'
				>
					{emulators.all.map((emulator: Emulator, index: number) => {
						return (
							<EmulatorDataTableRow
								key={index}
								emulator={emulator}
								rowClassName='bg-primary-light text-white'
								cellClassName='first:rounded-s-md last:rounded-e-md'
								actions={{
									edit: editEmulator,
									delete: deleteEmulator,
								}}
							/>
						);
					})}
				</TableDisplay>
			</div>
			<EmulatorEditModal
				emulator={emulatorModalData}
				onCloseRequest={() => {
					setIsEmulatorModalOpen(false);
				}}
				isOpen={isEmulatorModalOpen}
				onChange={ (emulator: Emulator) => {
					if (emulatorModalData && emulatorModalData.id === 0)
						return emulators.append(emulator);
					emulators.update(emulator);
				}}
			/>
		</>
	);
}

type EmulatorDataTableRowProps = {
	rowClassName?: string;
	cellClassName?: string;
	emulator: Emulator;
	actions: {
		edit: (emulator: Emulator) => void;
		delete: (emulator: Emulator) => void;
	};
};
function EmulatorDataTableRow(props: EmulatorDataTableRowProps): React.ReactElement {
	return (
		<tr className={props.rowClassName}>
			<td className={props.cellClassName}>{props.emulator.id}</td>
			<td className={props.cellClassName}>{props.emulator.console}</td>
			<td className={props.cellClassName}>{props.emulator.companyName}</td>
			<td className={props.cellClassName}>{props.emulator.abbreviation}</td>
			<td className={props.cellClassName}>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<IconButton
						size='small'
						color='default'
						onClick={() => {
							props.actions.edit(props.emulator);
						}}
						sx={{ p: '10px' }}
					>
						<IonIcon style={{ color: '#FFFFFF' }} icon={createOutline} />
					</IconButton>
					<IconButton
						size='small'
						color='default'
						onClick={() => {
							props.actions.delete(props.emulator);
						}}
						sx={{ p: '10px' }}
					>
						<IonIcon style={{ color: '#FFFFFF' }} icon={trashOutline} />
					</IconButton>
				</Box>
			</td>
		</tr>
	);
}
