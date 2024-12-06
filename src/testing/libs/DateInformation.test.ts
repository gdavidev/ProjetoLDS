import DateInformation from '@libs/DateInformation.ts';

describe('DateInformation', () => {
	it('Should return the correct date diff in minutes', () => {
		const date1 = new Date('2024-06-15T12:10:00.000Z');
		const date2 = new Date('2024-06-15T12:20:00.000Z');

		const minutes = DateInformation.diffMinutes(date1, date2);

		expect(minutes).toEqual(10)
	})

	it('Should return the correct date diff in days', () => {
		const date1 = new Date('2024-06-15T12:10:00.000Z');
		const date2 = new Date('2024-06-20T12:10:00.000Z');

		const days = DateInformation.diffDays(date1, date2);

		expect(days).toEqual(5)
	})

	it('Should return the correct date diff in months', () => {
		const date1 = new Date('2024-06-15T12:10:00.000Z');
		const date2 = new Date('2024-08-15T12:10:00.000Z');

		const months = DateInformation.diffMonths(date1, date2);

		expect(months).toEqual(-2)
	})

	it('Should return the correct date diff in years', () => {
		const date1 = new Date('2024-06-15T12:10:00.000Z');
		const date2 = new Date('2020-06-15T12:10:00.000Z');

		const years = DateInformation.diffYears(date1, date2);

		expect(years).toEqual(-4)
	})
})