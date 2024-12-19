import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme.ts';
import { ForwardedRef, forwardRef, useState } from 'react';

export const TextFieldStyled = (props: TextFieldProps) => {
	const { theme, colors } = useTailwindTheme();

	return (
		<TextField
				{...props}
				sx={{
					color: colors.slate[950],
					backgroundColor: colors.slate[200],
					borderColor: colors.gray[200],
					boxShadow: 'none',
					borderRadius: theme.borderRadius['md']
				}} />
	);
};

type TagPickerProps = {
	name: string;
	source?: string[];
	value?: string[];
	onChange?: (value: string[]) => void;
	getOptionLabel?: (option: string) => string;
	labelClassName?: string;
}

const TagPicker =
		forwardRef((props: TagPickerProps, ref: ForwardedRef<HTMLInputElement>) => {
			const [tags, setTags] = useState<string[]>([]);

			return (
					<div className='flex flex-col'>
						<label htmlFor={props.name} className={props.labelClassName}>{props.name}:</label>
						<Autocomplete
								ref={ ref }
								multiple
								freeSolo
								options={ props.source ?? [] }
								value={ tags }
								onChange={(_: any, value) => {
									const cleanedTags = value.map((tag) =>
											tag.startsWith('Adicionar "') ? tag.slice('Adicionar "'.length, -1) : tag
									);
									props.onChange?.(cleanedTags);
									setTags(cleanedTags);
								}}
								renderInput={(params) => (
										<TextFieldStyled
												{...params}
												placeholder="Digite suas Tags"
										/>
								)}
								handleHomeEndKeys
								filterOptions={(_: any, params) =>
										params.inputValue ? [`Adicionar "${params.inputValue}"`] : []
								}
								autoCapitalize='words'
								autoSelect

						/>
					</div>
			);
		})
export default TagPicker