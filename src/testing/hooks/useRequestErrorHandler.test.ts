import { vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import useRequestErrorHandler, { UseRequestErrorHandlerResult } from '@/hooks/useRequestErrorHandler.ts';
import { AxiosError } from 'axios';
import useEnvironment from '@/hooks/useEnvironment.ts';

vi.mock('@/hooks/useEnvironment.ts')

const expectedMessages = {
	existentProp_error: 'existentProp error',
	non_existentProp_error: 'non-existentProp error',
	bad_request: 'bad request',
	unauthorized_or_not_found: 'unauthorized or not found',
	server_error: 'server error',
	friendly_bad_gateway: 'friendly bad gateway',
	bad_gateway: 'bad gateway',
	generic_error: 'generic error'
}

let result: { current: UseRequestErrorHandlerResult }
const mockOnError = vi.fn((message: string) => message);
const mockSpecificOnError = vi.fn();
function renderHooks() {
	const { result: renderHookResult } = renderHook(() => useRequestErrorHandler({
		mappings: [
			{
				status: 400,
				userMessage: (resData: any) => {
					if (resData['existentProp'])
						return expectedMessages.existentProp_error;
					if (resData['non-existentProp'])
						return expectedMessages.non_existentProp_error;
					return expectedMessages.bad_request;
				}
			},
			{ status: [401, 404], userMessage: expectedMessages.unauthorized_or_not_found },
			{ status: 500, userMessage: expectedMessages.server_error },
			{
				status: 504,
				userMessage: expectedMessages.friendly_bad_gateway,
				debugMessage: expectedMessages.bad_gateway
			},
			{ status: 200, onError: mockSpecificOnError },
			{ status: 'default', userMessage: expectedMessages.generic_error },
		],
		onError: mockOnError,
	}));
	result = renderHookResult
}

function setupMocks() {
	vi.mocked(useEnvironment).mockReturnValue({
		isDebug: false
	})
}

beforeEach(() => {
	vi.resetAllMocks();
	setupMocks();
	renderHooks();
})
afterEach(() => {
	cleanup();
});

describe('useRequestErrorHandler', () => {
	it('Should set isError to true when error', () => {
		const sampleAxiosError: AxiosError = createAxiosErrorSample('Bad Request', 401);

		act(() => {
			result.current.handleRequestError(sampleAxiosError);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.message).not.toBe('');
	});

	it('Should clear errors and message', () => {
		const sampleAxiosError: AxiosError = createAxiosErrorSample('Bad Request', 401);

		expect(result.current.isError).toBe(false);
		expect(result.current.message).toBe('');

		act(() => {
			result.current.handleRequestError(sampleAxiosError);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.message).not.toBe('');

		act(() => {
			result.current.clear();
		});

		expect(result.current.isError).toBe(false);
		expect(result.current.message).toBe('');
	});

	it('Should set error', () => {
		act(() => {
			result.current.setError('Error');
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.message).not.toBe('');
	})

	it('Should call onError with defined userMessage', () => {
		const sampleAxiosError: AxiosError = createAxiosErrorSample('Server Error', 500);

		act(() => {
			result.current.handleRequestError(sampleAxiosError);
		});

		expect(mockOnError).toHaveBeenCalledTimes(1);
		expect(mockOnError).toHaveBeenLastCalledWith(expectedMessages.server_error, 500, undefined);
	});

	describe('Should evaluate function in userMessage', () => {
		it('Call onError with message of existent props in the response object', () => {
			const resData: any = { existentProp: 'I\'m existing' };
			const sampleAxiosError: AxiosError = createAxiosErrorSample('Bad Request', 400, resData)

			act(() => {
				result.current.handleRequestError(sampleAxiosError);
			});

			expect(mockOnError).toHaveBeenCalledTimes(1);
			expect(mockOnError).toHaveBeenLastCalledWith(
					expectedMessages.existentProp_error,
					sampleAxiosError.status,
					sampleAxiosError.response?.data
			);
		});

		it('Call onError with default message because neither checked prop is in the response object', () => {
			const resData: any = { unknownProp: 'I\'m not existing' };
			const sampleAxiosError: AxiosError = createAxiosErrorSample('Bad Request', 400, resData)

			act(() => {
				result.current.handleRequestError(sampleAxiosError);
			});

			expect(mockOnError).toHaveBeenCalledTimes(1);
			expect(mockOnError).toHaveBeenLastCalledWith(
					expectedMessages.bad_request,
					sampleAxiosError.status,
					sampleAxiosError.response?.data
			);
		});
	});

	it('Call onError when status in array', () => {
		const sampleAxiosError1: AxiosError = createAxiosErrorSample('Bad Request', 401);
		const sampleAxiosError2: AxiosError = createAxiosErrorSample('Not Found', 404);

		act(() => {
			result.current.handleRequestError(sampleAxiosError1);
		});

		expect(mockOnError).toHaveBeenCalledTimes(1);
		expect(mockOnError).toHaveBeenLastCalledWith(expectedMessages.unauthorized_or_not_found, 401, undefined);

		act(() => {
			result.current.handleRequestError(sampleAxiosError2);
		});

		expect(mockOnError).toHaveBeenCalledTimes(2);
		expect(mockOnError).toHaveBeenLastCalledWith(expectedMessages.unauthorized_or_not_found, 404, undefined);
	});

	it('Should call specific onError when defined', () => {
		const sampleAxiosError: AxiosError = createAxiosErrorSample('Failed Successfully', 200);

		act(() => {
			result.current.handleRequestError(sampleAxiosError);
		});

		expect(mockOnError).not.toHaveBeenCalled();
		expect(mockSpecificOnError).toHaveBeenCalled();
	});
});

function createAxiosErrorSample(message: string, statusCode: number, data?: any) {
	return new AxiosError(
			message,
			statusCode.toString(),
			undefined,
			{ thing: 'thing' },
			{
				// @ts-ignore
				config: {},
				headers: {},
				request: { thing: 'thing' },
				statusText: message,
				data: data,
				status: statusCode
			}
	);
}