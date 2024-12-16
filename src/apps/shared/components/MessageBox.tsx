import ModalPopup, { ModalPopupProps } from '@shared/components/ModalPopup.tsx';

export enum MessageBoxType {
	OK,
	OK_CANCEL,
	YES_NO,
	YES_NO_CANCEL
}

export enum MessageBoxResult {
	OK,
	CANCEL,
	YES,
	NO
}

export type MessageBoxProps = {
	message: string | JSX.Element | JSX.Element[];
	type: MessageBoxType;
	onClick: (result: MessageBoxResult) => void;
} & ModalPopupProps

export default function MessageBox(props: MessageBoxProps) {
	return (
			<ModalPopup
					title={ props.title }
					isOpen={ props.isOpen }
					bottomText={ props.bottomText }
					topText={ props.topText }
					className='max-w-[80%] min-w-96'
					onCloseRequest={ props.onCloseRequest }>
				{ props.message }
				<div className='mt-10 flex gap-x-3 w-full justify-end items-center'>
					<MessageBoxButtonRow
							type={ props.type }
							onClick={ (result: MessageBoxResult) => {
								props.onClick(result);
								props.onCloseRequest?.();
							}} />
				</div>
			</ModalPopup>
	)
}

function MessageBoxButtonRow(props: Pick<MessageBoxProps, 'type' | 'onClick'>) {
	return ({
		[MessageBoxType.OK]:
				<button className='btn-primary' onClick={ () => props.onClick(MessageBoxResult.OK) }>
					OK
				</button>,
		[MessageBoxType.OK_CANCEL]:
				<>
					<button className='btn-primary' onClick={ () => props.onClick(MessageBoxResult.OK) }>
						OK
					</button>
					<button className='btn-secondary' onClick={ () => props.onClick(MessageBoxResult.CANCEL) }>
						Cancelar
					</button>
				</>,
		[MessageBoxType.YES_NO]:
				<>
					<button className='btn-primary' onClick={ () => props.onClick(MessageBoxResult.YES) }>
						Sim
					</button>
					<button className='btn-secondary' onClick={ () => props.onClick(MessageBoxResult.NO) }>
						Não
					</button>
				</>,
		[MessageBoxType.YES_NO_CANCEL]:
				<>
					<button className='btn-primary' onClick={ () => props.onClick(MessageBoxResult.YES) }>
						Sim
					</button>
					<button className='btn-secondary' onClick={ () => props.onClick(MessageBoxResult.NO) }>
						Não
					</button>
					<button className='btn-secondary' onClick={ () => props.onClick(MessageBoxResult.CANCEL) }>
						Cancelar
					</button>
				</>,
	}[props.type])
}