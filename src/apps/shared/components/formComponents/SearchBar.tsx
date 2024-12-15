import TextInput from '@shared/components/formComponents/TextInput.tsx';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { FormEvent, useCallback } from 'react';

type SearchBarProps = {
	onSearch: (text: string) => void,
	onErase?: () => void,
	isLoading?: boolean,
	defaultValue?: string,
}

export default function SearchBar(props: SearchBarProps) {
	const updateSearchTerm = useCallback((e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const values = Object.fromEntries(formData.entries());

		props.onSearch(values['nome'] as string);
	}, [])

	return (
			<form
					onSubmit={ updateSearchTerm }
					className="flex justify-end mb-2 gap-2">
				<TextInput
						disabled={ props.isLoading }
						labelClassName="hidden"
						inputContainerClassName="bg-white overflow-hidden border-[1px] border-gray-200 rounded-md"
						inputClassName="w-80 border-none focus:outline-none"
						name="Nome"
						value={ props.defaultValue ?? ''  }
						endDecoration={
							<button
									type="reset"
									onClick={ props.onErase }>
								<IonIcon icon={close} />
							</button>
						} />
				<button
						type="submit"
						disabled={ props.isLoading }
						className="btn-primary">
					Pesquisar
				</button>
			</form>
	)
}