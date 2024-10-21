import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi, suite } from 'vitest'
import { render } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { AlertInfo } from '@apps/main/pages/authentication/AuthPage';
import userEvent from '@testing-library/user-event'
import SignInLayout from '@apps/main/pages/authentication/SignInLayout';

describe("SignInLayout", () => {
  const callbacks = {
    success: () => console.log('succ'),
    error: (_: AlertInfo) => console.log('err'),
    stateChanged: (_: AlertInfo) => console.log('stat'),
  }
  const errorCallbackSpy = vi.spyOn(callbacks, 'error')
  const successCallbackSpy = vi.spyOn(callbacks, 'success')
  const mockedQueryClient: QueryClient = new QueryClient();
  const mockedBrowserRouter = createBrowserRouter([{
    path: '/',
    element: <SignInLayout onError={ callbacks.error } onSuccess={ callbacks.success } />
  }]);

  let emailInput: HTMLElement
  let userNameInput: HTMLElement
  let passInput: HTMLElement
  let confirmPassInput: HTMLElement
  let submitButton: HTMLElement
  beforeEach(() => {
    const { getByRole } = render(
      <QueryClientProvider client={ mockedQueryClient }>
        <RouterProvider router={ mockedBrowserRouter } />
      </QueryClientProvider>
    );
    emailInput = getByRole('textbox', { name: /email/i });
    userNameInput = getByRole('textbox', { name: /nome/i })
    passInput = getByRole('textbox', { name: /^senha$/i });
    confirmPassInput = getByRole('textbox', { name: /confirmar/i })
    submitButton = getByRole('button', { name: /registrar/i });
  });
  
  it("Correctly rendering page", () => {
    expect(emailInput).toBeInTheDocument();
    expect(userNameInput).toBeInTheDocument();
    expect(confirmPassInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  suite("Correct error messages", () => {
    afterEach(async () => {
      await userEvent.click(submitButton);

      expect(errorCallbackSpy).toHaveBeenCalled();
      expect(successCallbackSpy).not.toHaveBeenCalled();
    });

    it("Missing email message", async () => {
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '123456789');
      await userEvent.type(userNameInput, 'Nome Usuário');
    })

    it("Missing password message", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(confirmPassInput, '123456789');
      await userEvent.type(userNameInput, 'Nome Usuário');
    });

    it("Missing password confimation message", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, '123456789');
      await userEvent.type(userNameInput, 'Nome Usuário');
    });

    it("Missing user name", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '123456789');
    });

    it("Passwords doesn't match message", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
      await userEvent.type(passInput, '123456789');
      await userEvent.type(confirmPassInput, '987654321');
      await userEvent.type(userNameInput, 'Nome Usuário');
    });    
  })
})