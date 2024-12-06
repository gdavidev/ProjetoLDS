export default class DateInformation {
	public static diffMinutes(from: Date, to: Date): number {
		// 60 seconds in a minute * 1000 milliseconds
		const minutesConstant: number = 60 * 1000
		const diffInMs = to.getTime() - from.getTime();

		return Math.floor(diffInMs / minutesConstant)
	}

	public static diffHours(from: Date, to: Date): number {
		// 3600 (minutes in an hour * seconds in a minute) * 1000 milliseconds
		const minutesConstant: number = 3600 * 1000
		const diffInMs = to.getTime() - from.getTime();

		return Math.floor(diffInMs / minutesConstant);
	}

	public static diffDays(from: Date, to: Date): number {
		// 24 hours * 3600 (minutes * seconds) * 1000 milliseconds
		const daysConstant: number = 24 * 3600 * 1000
		const diffInMs = to.getTime() - from.getTime();

		return Math.floor(diffInMs / daysConstant)
	}

	public static diffWeeks(from: Date, to: Date): number {
		// 24 hours * 3600 (minutes * seconds) * 1000 milliseconds * 7 days
		const weeksConstant: number = 24 * 3600 * 1000 * 7
		const diffInMs = to.getTime() - from.getTime();

		return Math.floor(diffInMs / weeksConstant);
	}

	public static diffMonths(from: Date, to: Date): number {
		// month of the year + (current year * 12)
		const monthsSinceYearZero_from: number = from.getFullYear() * 12;
		const monthsSinceYearZero_to: number = to.getFullYear() * 12;

		return (from.getMonth() + monthsSinceYearZero_to) - (to.getMonth() + monthsSinceYearZero_from);
	}

	public static diffYears(from: Date, to: Date) {
		return to.getFullYear() - from.getFullYear();
	}
}