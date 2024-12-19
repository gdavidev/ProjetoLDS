export default class DateInformation {
	public static diffMinutes(from: Date, to: Date): number {
		// Difference in minutes (60 seconds * 1000 milliseconds)
		const minutesConstant: number = 60 * 1000;
		const diffInMs: number = to.getTime() - from.getTime();

		return Math.floor(diffInMs / minutesConstant)
	}

	public static diffHours(from: Date, to: Date): number {
		// Difference in hours (3600 seconds * 1000 milliseconds)
		const hoursConstant: number = 3600 * 1000;
		const diffInMs: number = to.getTime() - from.getTime();

		return Math.floor(diffInMs / hoursConstant);
	}

	public static diffDays(from: Date, to: Date): number {
		// Difference in days (24 hours * 3600 seconds * 1000 milliseconds)
		const daysConstant: number = 24 * 3600 * 1000
		const diffInMs: number = to.getTime() - from.getTime();

		return Math.floor(diffInMs / daysConstant)
	}

	public static diffWeeks(from: Date, to: Date): number {
		// Difference in weeks (7 days * 24 hours * 3600 seconds * 1000 milliseconds)
		const weeksConstant: number = 24 * 3600 * 1000 * 7
		const diffInMs: number = to.getTime() - from.getTime();

		return Math.floor(diffInMs / weeksConstant);
	}

	public static diffMonths(from: Date, to: Date): number {
		// month of the year + (current year * 12)
		const monthsSinceYearZero_from: number = from.getFullYear() * 12;
		const monthsSinceYearZero_to: number = to.getFullYear() * 12;

		return (to.getMonth() + monthsSinceYearZero_to) - (from.getMonth() + monthsSinceYearZero_from);
	}

	public static diffYears(from: Date, to: Date) {
		return to.getFullYear() - from.getFullYear();
	}
}