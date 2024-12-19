import Validation from '@libs/Validation.ts';
import { suite } from 'vitest';

describe('Validation', () => {
	suite('should be false when', () => {
		let samplePassword: string = '';
		it('password is empty', () => {
			samplePassword = '';
		});

		it('password is too short', () => {
			samplePassword = 'Sampl$1';
		});

		it('has no special characters', () => {
			samplePassword = 'Sample123';
		});

		it('has no upper case characters', () => {
			samplePassword = 'sample$123';
		});

		it('has no lower case characters', () => {
			samplePassword = 'SAMPLE$123';
		});

		it('has invalid special characters', () => {
			samplePassword = 'SAMPLE<123';
		});

		afterEach(() => {
			const result: boolean = Validation.isValidPassword(samplePassword)
			expect(result).toBe(false);
		})
	});
})