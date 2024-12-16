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
const defaultValues: PasswordResetLayoutFormData = {
  password: '',
  confirmPassword: ''
}

export default function PasswordResetLayout(props: PasswordResetLayoutProps) {
  const { params } = useTypeSafeSearchParams<PasswordResetLayoutParams>({ token: '' });
  const [ IsPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ IsPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { handleSubmit, watch, control, reset: setFormData, clearErrors } = useForm<PasswordResetLayoutFormData>({
    defaultValues: defaultValues,
  });
  const fields: PasswordResetLayoutFormData = watch();

  // ---- Initialization ----
  useLayoutEffect(() => {
    clearErrors();
    clearRequestErrors();
    setFormData(defaultValues);
  }, []);

  // ---- API Calls Setup ----
  const { passwordReset } = useAuth({
    onPasswordReset: {
      onSuccess: (_: CurrentUser) => props.onSuccess,
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
    const message: string | undefined = getErrorMessage(fields);
    if (message)
      props.onError?.(message);
  }, [fields]);
  
  return(
    <form onSubmit={ handleSubmit(submitForm) } className="flex flex-col gap-y-4 w-full mx-auto">
      <FormGroup>
        <Controller name="password" control={control} render={({field}) => (          
          <TextInput {...field} 
              name="Nova Senha" 
              inputContainerClassName="bg-white" 
              password={ IsPasswordHidden }
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ 
                <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden } /> 
              } />
        )}/>
        <Controller name="confirmPassword" control={control} render={({field}) => (          
          <TextInput {...field} 
              name="Confirme Nova Senha" 
              inputContainerClassName="bg-white" 
              password={ IsPasswordConfirmHidden }               
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ 
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordConfirmHidden } /> 
              } />
        )}/>
      </FormGroup>

      <button className="btn-primary">
        Confirmar
      </button>
    </form>
  );
}

function getErrorMessage(data: PasswordResetLayoutFormData): string | undefined {
  if (data.password.trim() === '')
    return "Por favor, insira uma senha.";
  if (data.confirmPassword.trim() === '')
    return "Por favor, confirme sua senha.";
  if (data.confirmPassword.trim() !== data.password.trim())
    return "As senhas não são iguais.";
  return undefined;
}