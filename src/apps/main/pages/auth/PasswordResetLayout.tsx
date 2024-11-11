import React, { PropsWithoutRef, useEffect, useState } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import { useMutation } from "react-query";
import UserApiClient from "@api/UserApiClient.ts";
import { UserResetPasswordDTO } from "@models/data/UserDTOs.ts";
import { useSearchParams } from "react-router-dom";
import { AxiosError } from 'axios';
import PasswordHiddenToggle from "@apps/main/components/PasswordHiddenToggle.tsx";
import { Controller, useForm } from "react-hook-form";
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx";

interface IPasswordResetLayoutProps {
  onSuccess?: () => void
  onError?: (alertData: AlertInfo) => void
  onStateChanged?: (alertData: AlertInfo) => void
}
interface IPasswordResetLayoutFormData {
  password: string;
  confirmPassword: string;
}
const defaultValues: IPasswordResetLayoutFormData = {
  password: '',
  confirmPassword: ''
}

export default function PasswordResetLayout(props: PropsWithoutRef<IPasswordResetLayoutProps>): React.ReactElement {
  const [ params, _ ] = useSearchParams();
  const [ IsPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ IsPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { handleSubmit, watch, control } = useForm<IPasswordResetLayoutFormData>({
    defaultValues: defaultValues,
  });
  const fields: IPasswordResetLayoutFormData = watch();

  const mutation = useMutation('LOGIN_USER',
    async (dto: UserResetPasswordDTO) => {
      const token: string | null = params.get('token')
      if (token) {
        const userApiClient: UserApiClient = new UserApiClient()
        return userApiClient.resetPassword(dto, token);
      }
    }, {      
      onSuccess: () => props.onSuccess?.(),
      onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err))
    }
  )

  useEffect(() => {
    if (mutation.isLoading)
      props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS });
  }, [mutation.isLoading]);
  
  useEffect(() => {
    const error: string | undefined = getErrorMessage(fields);
    if (error)
      props.onError?.({ message: error, type: AlertType.ERROR });
  }, [])

  function submitForm(data: IPasswordResetLayoutFormData): void {
    mutation.mutate({ newPassword: data.password });
  }
  
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

      <button className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Confirmar
      </button>
    </form>
  );
}

function getErrorMessage(data: IPasswordResetLayoutFormData): string | undefined {
  if (data.password.trim() === '')
    return "Por favor, insira uma senha.";
  if (data.confirmPassword.trim() === '')
    return "Por favor, confirme sua senha.";
  if (data.confirmPassword.trim() !== data.password.trim())
    return "As senhas não são iguais.";
  return undefined;
}

function handleRequestError(err: AxiosError | Error): AlertInfo {
  return { message: JSON.stringify(err), type: AlertType.ERROR }
}