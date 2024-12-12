import StringFormatter from '@libs/StringFormatter.ts';

describe('StringFormatter', () => {
	it('should replaceAll pipes', () => {
		const sample = '  Example|20|15 ';

		const result = StringFormatter.replaceAll(sample, '|', '')

		expect(result).not.toContain('|')
	});
})