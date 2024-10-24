import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi, suite } from 'vitest'
import { render } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import LogInLayout from '@apps/main/pages/authentication/LogInLayout';
import CurrentUser from '@/models/User';
import { AlertInfo } from '@apps/main/pages/authentication/AuthPage';
import userEvent from '@testing-library/user-event'

describe("LogInLayout", () => {
  const callbacks = {
    success: (_: CurrentUser) => console.log('succ'),
    error: (_: AlertInfo) => console.log('err'),
    stateChanged: (_: AlertInfo) => console.log('stat'),
  }
  const errorCallbackSpy = vi.spyOn(callbacks, 'error')
  const successCallbackSpy = vi.spyOn(callbacks, 'success')
  const mockedQueryClient: QueryClient = new QueryClient();
  const mockedBrowserRouter = createBrowserRouter([{
    path: '/',
    element: <LogInLayout onError={ callbacks.error } onSuccess={ callbacks.success } />
  }]);

  let emailInput: HTMLElement
  let passInput: HTMLElement
  let submitButton: HTMLElement
  beforeEach(() => {
    const { getByRole } = render(
      <QueryClientProvider client={ mockedQueryClient }>
        <RouterProvider router={ mockedBrowserRouter } />
      </QueryClientProvider>
    );
    emailInput = getByRole('textbox', { name: /email/i });
    passInput = getByRole('textbox', { name: /senha/i });
    submitButton = getByRole('button', { name: /entrar/i });
  });
  
  it("Correctly rendering page", () => {
    expect(emailInput).toBeInTheDocument();
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
    })
  
    it("Missing password message", async () => {
      await userEvent.type(emailInput, 'gabriel@gmail.com');
    });
  })
})