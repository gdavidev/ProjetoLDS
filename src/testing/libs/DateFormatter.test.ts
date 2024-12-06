import DateFormatter from '@libs/DateFormatter.ts';
import { suite } from 'vitest';

describe("DateFormatter", () => {
	suite('relativeDate function', () => {
		it('Should return \'Agora\' to less than a minute date diff', () => {
			const minuteInMs: number = 60 * 1000;
			const secondInMs: number = 1000;
			const date1: Date = new Date(new Date().getTime() + (minuteInMs - secondInMs));

			const result: string = DateFormatter.relativeDate(date1)

			expect(result).toBe('Agora');
		})

		it('Should return \'Ultima hora\' to more than one minute and less than a hour date diff', () => {
			const hourInMs: number = 3600 * 1000;
			const minuteInMs: number = 60 * 1000;
			const date1: Date = new Date(new Date().getTime() + (hourInMs - minuteInMs));

			const result: string = DateFormatter.relativeDate(date1)

			expect(result).toBe('Ultima hora');
		})
	})
})