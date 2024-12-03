import { CircularProgress } from '@mui/material';

type LoadingProps = {
	className?: string;
}

export default function Loading(props: LoadingProps) {
	return (
		<div className={ 'w-full h-full flex justify-center items-center ' + props?.className }>
			<CircularProgress color="primary" />
		</div>
	)
}