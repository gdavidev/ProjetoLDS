import { useEffect, useLayoutEffect, useState } from 'react';
import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import { AxiosError } from 'axios';
import PasswordHiddenToggle from "@apps/main/components/PasswordHiddenToggle.tsx";
import { Controller, useForm } from "react-hook-form";
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx";
import CurrentUser from '@models/CurrentUser.ts';
import useAuth from '@/hooks/useAuth.ts';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import Validation from '@libs/Validation.ts';

type PasswordResetLayoutProps = {
  onSuccess?: () => void
  onError?: (message: string) => void
  onStateChanged?: (message: string) => void
}
type PasswordResetLayoutFormData = {
  password: string;
  confirmPassword: string;
}
type PasswordResetLayoutParams = {
  token: string;
}

export default function PasswordResetLayout(props: PasswordResetLayoutProps) {
  const { params } = useTypeSafeSearchParams<PasswordResetLayoutParams>({ token: '' });
  const [ IsPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ IsPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { handleSubmit, watch, formState: { errors }, control, reset: setFormData, clearErrors, getValues } =
      useForm<PasswordResetLayoutFormData>({
        defaultValues: {
          password: '',
          confirmPassword: ''
        },
      });
  const fields: PasswordResetLayoutFormData = watch();

  // ---- Initialization ----
  useLayoutEffect(() => {
    clearErrors();
    clearRequestErrors();
    setFormData();
  }, []);

  // ---- API Calls Setup ----
  const { passwordReset } = useAuth({
    onPasswordReset: {
      onSuccess: (_: CurrentUser) => props.onSuccess?.(),
      onError: (err: AxiosError | Error) => handleRequestError(err)
    },
    onIsLoading: () => props.onStateChanged?.('Enviando...')
  })

  // ---- API Calls Error Handling ----
  const { handleRequestError, clear: clearRequestErrors } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
    onError: props.onError
  });

  // ---- API Executing ----
  function submitForm(data: PasswordResetLayoutFormData): void {
    passwordReset({
      newPassword: data.password,
      token: params.token
    });
  }

  // ---- Error handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message)
      props.onError?.(formError.message);
  }, [fields]);
  
  return(
      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-y-4 w-full mx-auto">
        <h1 className="text-white text-xl text-center font-bold -mb-2">Recuperar Senha</h1>
        <FormGroup>
          <Controller
              name="password"
              control={control}
              rules={{
                required: "Por favor, insira uma senha.",
                validate: (value: string) =>
                    Validation.isValidPassword(value) || "A senha não esta em um formato inválido"
              }}
              render={({ field }) => (
                  <TextInput {...field}
                             name="Nova Senha"
                             inputContainerClassName="bg-white"
                             password={IsPasswordHidden}
                             styleType={TextInputStyle.LABEL_LESS}
                             endDecoration={
                               <PasswordHiddenToggle initialState={true} onChange={setIsPasswordHidden} />
                             } />
              )} />
          <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Por favor, confirme sua senha.",
                validate: (value: string) =>
                    getValues('password') === value || "As senhas não conferem."
              }}
              render={({ field }) => (
                  <TextInput {...field}
                             name="Confirme Nova Senha"
                             inputContainerClassName="bg-white"
                             password={IsPasswordConfirmHidden}
                             styleType={TextInputStyle.LABEL_LESS}
                             endDecoration={
                               <PasswordHiddenToggle initialState={true} onChange={setIsPasswordConfirmHidden} />
                             } />
              )} />
        </FormGroup>

        <button
            type='submit'
            className="btn-primary">
          Confirmar
        </button>
      </form>
  );
}