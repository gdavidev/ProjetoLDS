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

		const searchText: string = values['nome'] as string;
		if (searchText === props.defaultValue)
			return;
		if (searchText === '')
			return props.onErase?.();
		return props.onSearch(searchText);
	}, [])

	return (
			<form
					onSubmit={ updateSearchTerm }
					className="flex justify-end mb-2 gap-2">
				<TextInput
						disabled={ props.isLoading ?? false }
						labelClassName="hidden"
						inputContainerClassName="bg-white has-[:disabled]:bg-gray-300 overflow-hidden border-[1px] border-gray-200 rounded-md"
						inputClassName="w-80 border-none disabled:bg-gray-300 focus:outline-none"
						name="Nome"
						defaultValue={ props.defaultValue ?? ''  }
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