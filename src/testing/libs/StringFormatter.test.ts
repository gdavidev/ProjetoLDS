import StringFormatter from '@libs/StringFormatter.ts';

describe('StringFormatter', () => {
	it('should replaceAll pipes', () => {
		const formatter: StringFormatter = new StringFormatter('  Example|20|15 ');

		formatter.replaceAll('|', '')

		expect(formatter.toString()).not.toContain('|')
	});
})