import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi, suite } from 'vitest';
import { render } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LogInLayout from '@apps/main/pages/auth/LogInLayout.tsx';
import userEvent from '@testing-library/user-event'
import useAuth from '@/hooks/useAuth.ts';

vi.mock("@/hooks/useAuth.ts");

describe("LogInLayout", () => {
  const mockLogin = vi.fn();
  const mockForgotPassword = vi.fn();
  const mockReset = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      forgotPassword: mockForgotPassword,
      passwordReset: vi.fn(),
      update: vi.fn(),
      reset: mockReset,
      isLoading: false
    })
  });

  let emailInput: HTMLInputElement
  let passInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  const mockError = vi.fn();
  const mockSuccess = vi.fn();
  const mockStateChanged = vi.fn();
  beforeEach(() => {
    const mockedBrowserRouter = createBrowserRouter([{
      path: '/',
      element:
          <LogInLayout
              onError={ mockError }
              onSuccess={ mockSuccess }
              onStateChanged={ mockStateChanged }
          />
    }]);
    const { getByRole } = render(
        <RouterProvider router={ mockedBrowserRouter } />
    );

    emailInput = getByRole('textbox', { name: /email/i }) as HTMLInputElement;
    passInput = getByRole('textbox', { name: /senha/i }) as HTMLInputElement;
    submitButton = getByRole('button', { name: /entrar/i }) as HTMLButtonElement;
  });

  it("Correctly rendering inputs", () => {
    expect(emailInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  suite("Success cases", () => {
    it("Should call login", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, 'Abc@1234');

      await userEvent.click(submitButton);

      expect(mockError).not.toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  suite("Error cases", () => {
    afterEach(async () => {
      await userEvent.click(submitButton);
      expect(mockError).toHaveBeenCalled();
      expect(mockSuccess).not.toHaveBeenCalled();
      expect(mockStateChanged).not.toHaveBeenCalled();
    });

    it("Should trigger error when missing email", async () => {
      await userEvent.type(passInput, 'Abc@1234');
    });

    it("Should trigger error when missing password", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
    });
  });
})