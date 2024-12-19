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
		const currentDate: Date = new Date();
		const diffMinutes: number = DateInformation.diffMinutes(date, currentDate);
		const diffHours: number = DateInformation.diffHours(date, currentDate);
		const diffDays: number = DateInformation.diffDays(date, currentDate);

		if (currentDate.getTime() < date.getTime()) // Date is in the future
			return DateFormatter.dateToString(date)

		if (diffMinutes < 1)
			return 'Agora';
		if (diffMinutes < 60)
			return `Há ${diffMinutes} minutos`;
		if (diffHours < 2)
			return 'Na ultima hora';
		if (date.getDate() === currentDate.getDate())
			return 'Hoje';
		if (date.getDate() === (currentDate.getDate() - 1))
			return 'Ontem';
		if (diffDays === 1)
			return `Há 1 dia`;
		if (diffDays < 5)
			return `Há ${diffDays} dias`;

		return DateFormatter.dateToString(date)
	}
}