import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import SignUpLayout from '@apps/main/pages/auth/SignUpLayout.tsx';
import useAuth from '@/hooks/useAuth.ts';

vi.mock("@/hooks/useAuth.ts");

const mockRegister = vi.fn();
const mockReset = vi.fn();
function setupMocks() {
  vi.resetAllMocks();

  vi.mocked(useAuth).mockReturnValue({
    login: vi.fn(),
    register: mockRegister,
    forgotPassword: vi.fn(),
    passwordReset: vi.fn(),
    update: vi.fn(),
    reset: mockReset,
    isLoading: false
  })
}

let emailInput: HTMLElement
let userNameInput: HTMLElement
let passInput: HTMLElement
let confirmPassInput: HTMLElement
let submitButton: HTMLElement
const mockSuccess = vi.fn();
const mockError = vi.fn();
const mockStateChanged = vi.fn();
function renderPage() {
  const mockedBrowserRouter = createBrowserRouter([{
    path: '/',
    element: <SignUpLayout onError={ mockError } onSuccess={ mockSuccess } onStateChanged={ mockStateChanged } />
  }]);
  const { getByRole } = render(
      <RouterProvider router={ mockedBrowserRouter } />
  );

  emailInput = getByRole('textbox', { name: /email/i });
  userNameInput = getByRole('textbox', { name: /nome/i })
  passInput = getByRole('textbox', { name: /^senha$/i });
  confirmPassInput = getByRole('textbox', { name: /confirmar/i })
  submitButton = getByRole('button', { name: /registrar/i });
}

beforeEach(() => {
  setupMocks()
  renderPage()
});
afterEach(() => {
  cleanup()
})

describe("SignUpLayout", () => {
  it("Correctly rendering page", () => {
    expect(emailInput).toBeInTheDocument();
    expect(userNameInput).toBeInTheDocument();
    expect(confirmPassInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe("Success cases", () => {
    it('Should call register', async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, 'Abc@1234');
      await userEvent.type(confirmPassInput, 'Abc@1234');
      await userEvent.type(userNameInput, 'UserName');

      await userEvent.click(submitButton);

      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  })

  describe("Error cases", () => {
    it("Trigger error when missing email", async () => {
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '123456789');
      await userEvent.type(userNameInput, 'Nome Usuário');

      await userEvent.click(submitButton);

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    })

    it("Trigger error when missing password", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(userNameInput, 'Nome Usuário');
      await userEvent.type(confirmPassInput, '123456789');

      await userEvent.click(submitButton);

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    });

    it("Trigger error when missing password confirmation", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(userNameInput, 'Nome Usuário');
      await userEvent.type(passInput, '123456789');

      await userEvent.click(submitButton);

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    });

    it("Trigger error when missing user name", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '123456789');

      await userEvent.click(submitButton);

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    });

    it("Trigger error when Passwords doesn't match", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '987654321');
      await userEvent.type(userNameInput, 'Nome Usuário');

      await userEvent.click(submitButton);

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    });    
  })
})