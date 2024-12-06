import '@testing-library/jest-dom/vitest'
import { it, expect, describe, vi, suite } from 'vitest'
import { render } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryService, QueryServiceProvider } from 'react-query';
import LogInLayout from '@apps/main/pages/auth/LogInLayout.tsx';
import CurrentUser from '@models/CurrentUser.ts';
import { AlertInfo } from '@apps/main/pages/auth/AuthPage.tsx';
import userEvent from '@testing-library/user-event'

describe("LogInLayout", () => {
  const callbacks = {
    success: (_: CurrentUser) => console.log('succ'),
    error: (_: AlertInfo) => console.log('err'),
    stateChanged: (_: AlertInfo) => console.log('stat'),
  }
  const errorCallbackSpy = vi.spyOn(callbacks, 'error')
  const successCallbackSpy = vi.spyOn(callbacks, 'success')
  const mockedQueryService: QueryService = new QueryService();
  const mockedBrowserRouter = createBrowserRouter([{
    path: '/',
    element: <LogInLayout onError={ callbacks.error } onSuccess={ callbacks.success } />
  }]);

  let emailInput: HTMLElement
  let passInput: HTMLElement
  let submitButton: HTMLElement
  beforeEach(() => {
    const { getByRole } = render(
      <QueryServiceProvider Service={ mockedQueryService }>
        <RouterProvider router={ mockedBrowserRouter } />
      </QueryServiceProvider>
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