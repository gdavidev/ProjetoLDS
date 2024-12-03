import Validation from '@libs/Validation.ts';

describe('Validation', () => {
	it('should return false if password is too short', () => {
		const samplePassword: string = 'sample';

		const result: boolean = Validation.isValidPassword(samplePassword)

		expect(result).toBe(false);
	})
})