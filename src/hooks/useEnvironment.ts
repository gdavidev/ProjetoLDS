type UseEnvironmentResult = {
	isDebug: boolean,
}

export default function useEnvironment(): UseEnvironmentResult {
	return {
		isDebug: process.env.NODE_ENV === 'development',
	}
}