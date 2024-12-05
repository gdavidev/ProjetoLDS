import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme.ts';
import { ForwardedRef, forwardRef } from 'react';

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
	source: string[];
	defaultValue?: string[];
	onChange?: (value: string) => void;
	getOptionLabel?: (option: string) => string;
	labelClassName?: string;
}

const TagPicker =
		forwardRef((props: TagPickerProps, ref: ForwardedRef<HTMLInputElement>) => {
	return (
		<div className='flex flex-col'>
			<label htmlFor={props.name} className={props.labelClassName}>{props.name}:</label>
			<Autocomplete
					multiple
					ref={ ref }
					id={props.name}
					options={props.source}
					getOptionLabel={(data => data)}
					defaultValue={props.defaultValue}
					filterSelectedOptions
					renderInput={(params) => (
							<TextFieldStyled
									{...params}
									placeholder={props.name}
							/>
					)}
			/>
		</div>
	);
})
export default TagPicker