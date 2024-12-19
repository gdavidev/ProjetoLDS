import { describe, it, expect } from "vitest";
import DateFormatter from '@libs/DateFormatter.ts';

describe('DateFormatter', () => {
	it("should return 'Agora' if the date is less than 1 minute ago", () => {
		const now = new Date();
		const justNow = new Date(now.getTime() - 30 * 1000); // 30 seconds ago

		const result = DateFormatter.relativeDate(justNow);
		expect(result).toBe("Agora");
	});

	it("should return 'Há X minutos' if the date is less than 60 minutes ago", () => {
		const now = new Date();
		const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000); // 20 minutes ago

		const result = DateFormatter.relativeDate(twentyMinutesAgo);
		expect(result).toBe("Há 20 minutos");
	});

	it("should return 'Na ultima hora' if the date is less than 2 hours ago", () => {
		const now = new Date();
		const oneHourAgo = new Date(now.getTime() - 90 * 60 * 1000); // 1 hour and 30 minutes ago

		const result = DateFormatter.relativeDate(oneHourAgo);
		expect(result).toBe("Na ultima hora");
	});

	it("should return 'Ontem' if the date is from the previous calendar day", () => {
		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Exactly 1 day ago

		const result = DateFormatter.relativeDate(yesterday);
		expect(result).toBe("Ontem");
	});

	it("should return 'Há 5 dias' if the date is within the last 5 days", () => {
		const now = new Date();
		const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days ago

		const result = DateFormatter.relativeDate(fourDaysAgo);
		expect(result).toBe("Há 4 dias");
	});

	it("should fallback to DateFormatter.dateToString for dates older than 5 days", () => {
		const now = new Date();
		const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago

		const result = DateFormatter.relativeDate(sixDaysAgo);
		expect(result).toBe(DateFormatter.dateToString(sixDaysAgo));
	});

	it("should fallback to DateFormatter.dateToString for future dates", () => {
		const now = new Date();
		const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day in the future

		const result = DateFormatter.relativeDate(tomorrow);
		expect(result).toBe(DateFormatter.dateToString(tomorrow));
	});
});