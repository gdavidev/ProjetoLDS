import DateInformation from '@libs/DateInformation.ts';

export default class DateFormatter {
	static dateTimeToString(date: Date, overrideLocalization?: string): string {
		const formatter = new Intl.DateTimeFormat(overrideLocalization ?? 'pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZone: 'UTC',
		});
		return formatter.format(date);
	}

	static dateToString(date: Date, overrideLocalization?: string): string {
		const formatter = new Intl.DateTimeFormat(overrideLocalization ?? 'pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		return formatter.format(date);
	}

	static relativeDate(date: Date): string {
		if (DateInformation.diffMinutes(new Date(), date) < 5)
			return 'Agora'
		if (DateInformation.diffHours(new Date(), date) < 1)
			return 'Ultima hora'
		if (DateInformation.diffDays(new Date(), date) < 1)
			return 'Hoje'
		return DateFormatter.dateToString(date)
	}
}