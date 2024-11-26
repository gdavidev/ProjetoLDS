import { useSearchParams } from 'react-router-dom';

export default function useTypeSafeSearchParams<T>() {
	const [ params, setParams ] = useSearchParams();

	let result: T = {} as T;
	result = Object.keys({o: result}).map(key => {
		const keyName: string = key.toString();
		return {
			[keyName]: params.get(keyName)
		}
	}) as T;
	
	return {
		params: result,
		setParams: setParams
	};
}