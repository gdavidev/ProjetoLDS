import React, { PropsWithRef, RefObject, useEffect, useRef } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import FormInputGroupMerge from "@/apps/shared/components/formComponents/FormGroup/FormInputGroupMerge.tsx"
import TextInput from "@/apps/shared/components/formComponents/FormGroup/TextInput.tsx";
import { useMutation } from "react-query";
import UserApiClient from "@api/UserApiClient.ts";
import { UserResetPasswordDTO } from "@models/data/UserDTOs.ts";
import { mailOutline, eyeOutline } from "ionicons/icons"
import { useSearchParams } from "react-router-dom";
import { AxiosError } from 'axios';

type PasswordResetLayoutProps = {
  onSuccess?: () => void,
  onError?: (alertData: AlertInfo) => void
  onStateChanged?: (alertData: AlertInfo) => void
}
type PasswordResetLayoutParams = {
  token: string
}
type UserResetPasswordFormData = {
  password: string,
  confirmPassword: string,
}

export default function PasswordResetLayout(props: PropsWithRef<PasswordResetLayoutProps>): React.ReactElement {
  const [ params, _ ] = useSearchParams();
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const passConfirmInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const { isLoading, mutate } = useMutation('LOGIN_USER',
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
    if (isLoading)
      props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS });
  }, [isLoading]);

  function submitData(): void {
    const userDTO: UserResetPasswordFormData = {
      password: passInput.current!.value,
      confirmPassword: passConfirmInput.current!.value
    }

    let errorMessage: string = getErrorMessageIfNotValid(userDTO);
    if (errorMessage !== '') {
      props.onError?.({ message: errorMessage, type: AlertType.ERROR });
      return;
    }

    mutate({ newPassword: userDTO.password });
  }
  
  return(
    <div className="flex flex-col gap-y-4 w-full mx-auto">
      <FormInputGroupMerge>
        <TextInput ref={ passInput } name="Nova Senha" ionIconPath={ eyeOutline } />
        <TextInput ref={ passConfirmInput } name="Confirme Nova Senha" ionIconPath={ mailOutline } />
      </FormInputGroupMerge>

      <button onClick={ submitData }
          className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Confirmar
      </button>
    </div>
  );
}

function getErrorMessageIfNotValid(userPasswordRecoveryData: UserResetPasswordFormData): string {
  if (userPasswordRecoveryData.password.trim() === '')
    return "Por favor, insira uma senha.";
  if (userPasswordRecoveryData.confirmPassword.trim() === '')
    return "Por favor, confirme sua senha.";
  if (userPasswordRecoveryData.confirmPassword.trim() !== userPasswordRecoveryData.password.trim())
    return "As senhas não são iguais.";
  return "";
}

function handleRequestError(err: AxiosError | Error): AlertInfo {
  return { message: JSON.stringify(err), type: AlertType.ERROR }
}