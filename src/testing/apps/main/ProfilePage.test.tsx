import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import useAuth from '@/hooks/useAuth.ts';
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import ProfilePage from '@apps/main/pages/ProfilePage.tsx';
import CurrentUser from '@models/CurrentUser.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'
import { Role } from '@/hooks/usePermission.ts';

vi.mock('@/hooks/useAuth.ts');
vi.mock('@/hooks/feedback/useAlert.tsx');
vi.mock('@/hooks/useCurrentUser.tsx');
vi.mock('@/hooks/useEmergencyExit.ts');
vi.mock('@/hooks/feedback/useAlert.tsx');

const sampleCurrentUser = new CurrentUser(
		16,
		'Gabriel',
		'RandomLongStringForToken',
		'gabriel@gmail.com',
		Role.USER,
		new Thumbnail({ fallbackUrl: userImageNotFound })
);

const mockUpdate = vi.fn();
const mockAlertError = vi.fn();
const mockAlertSuccess = vi.fn();
const mockExitFn = vi.fn();
function setupMocks() {
	vi.resetAllMocks();

	vi.mocked(useAuth).mockReturnValue({
		login: vi.fn(),
		register: vi.fn(),
		forgotPassword: vi.fn(),
		passwordReset: vi.fn(),
		update: mockUpdate,
		reset: vi.fn(),
		isLoading: false
	});

	vi.mocked(useAlert).mockReturnValue({
		alertElement: <></>,
		success: mockAlertSuccess,
		error: mockAlertError,
		warning: vi.fn(),
		info: vi.fn(),
		clear: () => vi.fn(),
	});

	vi.mocked(useCurrentUser).mockReturnValue({
		user: sampleCurrentUser,
		setUser: vi.fn(),
		logout: vi.fn(),
		askToLogin: vi.fn(),
		forceLogin: vi.fn()
	});

	vi.mocked(useEmergencyExit).mockReturnValue({
		exit: mockExitFn,
	});
}

let emailInput: HTMLElement
let userNameInput: HTMLElement
let passInput: HTMLElement
let confirmPassInput: HTMLElement
let submitButton: HTMLElement
function renderPage() {
	const { getByRole } = render( <ProfilePage />	);

	userNameInput = getByRole('textbox', { name: /nome/i })
	passInput = getByRole('textbox', { name: /^senha$/i });
	confirmPassInput = getByRole('textbox', { name: /confirmar/i })
	emailInput = getByRole('textbox', { name: /email/i });
	submitButton = getByRole('button', { name: /atualizar/i });
}

beforeEach(() => {
	setupMocks()
	renderPage()
});
afterEach(() => {
	cleanup()
})

describe("ProfilePage", () => {
	it("Correctly rendering page", () => {
		expect(emailInput).toBeInTheDocument();
		expect(userNameInput).toBeInTheDocument();
		expect(confirmPassInput).toBeInTheDocument();
		expect(passInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
	});

	it("Elements correctly loaded from CurrentUser", () => {
		expect(emailInput).toHaveValue(sampleCurrentUser.email);
		expect(userNameInput).toHaveValue(sampleCurrentUser.userName);
		expect(passInput).toHaveValue('');
		expect(confirmPassInput).toHaveValue('');
	});

	it("Exit page when entering as a guest", () => {
		vi.mocked(useCurrentUser).mockReturnValueOnce({
			user: null,
			setUser: vi.fn(),
			logout: vi.fn(),
			askToLogin: vi.fn(),
			forceLogin: vi.fn()
		});

		expect(mockExitFn).toBeCalledTimes(1)
	})

	describe("Success cases", () => {
		it('Should call update without password', async () => {
			await userEvent.type(emailInput, 'gabriel@outlook.com');
			await userEvent.type(userNameInput, 'UserName');

			await userEvent.click(submitButton);

			expect(mockAlertError).not.toHaveBeenCalled();
			expect(mockUpdate).toHaveBeenCalledTimes(1);
		});

		it('Should call update with password', async () => {
			await userEvent.type(emailInput, 'gabriel@outlook.com');
			await userEvent.type(passInput, 'Abc@1234');
			await userEvent.type(confirmPassInput, 'Abc@1234');
			await userEvent.type(userNameInput, 'UserName');

			await userEvent.click(submitButton);

			expect(mockAlertError).not.toHaveBeenCalled();
			expect(mockUpdate).toHaveBeenCalledTimes(1);
		});
	})

	describe("Error cases", () => {
		it("Trigger error when missing email", async () => {
			await userEvent.clear(emailInput);

			await userEvent.click(submitButton);

			expect(mockAlertError).toHaveBeenCalledTimes(1);
			expect(mockAlertSuccess).not.toHaveBeenCalled();
			expect(mockUpdate).not.toHaveBeenCalled();
		})

		it("Trigger error when password informed, but no confirmation", async () => {
			await userEvent.type(passInput, 'Abc@123456');

			await userEvent.click(submitButton);

			expect(mockAlertError).toHaveBeenCalledTimes(1);
			expect(mockAlertSuccess).not.toHaveBeenCalled();
			expect(mockUpdate).not.toHaveBeenCalled();
		});

		it("Trigger error when Passwords doesn't match", async () => {
			await userEvent.type(passInput, 'Abc@123456');
			await userEvent.type(confirmPassInput, 'Abc@9876');

			await userEvent.click(submitButton);

			expect(mockAlertError).toHaveBeenCalledTimes(1);
			expect(mockAlertSuccess).not.toHaveBeenCalled();
			expect(mockUpdate).not.toHaveBeenCalled();
		});

		it("Trigger error when missing user name", async () => {
			await userEvent.clear(userNameInput);

			await userEvent.click(submitButton);

			expect(mockAlertError).toHaveBeenCalledTimes(1);
			expect(mockAlertSuccess).not.toHaveBeenCalled();
			expect(mockUpdate).not.toHaveBeenCalled();
		});
	});
});