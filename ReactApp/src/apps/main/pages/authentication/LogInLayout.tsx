import React, { PropsWithRef, RefObject, useEffect, useRef } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import FormInputGroupMerge from "@shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "@shared/components/formComponents/FromGroup/TextInput.tsx";
import { useMutation } from "react-query";
import UserApiClient from "@api/UserApiClient.ts";
import { UserLoginDTO } from "@models/UserDTOs.ts";
import CurrentUser from "@models/User.ts";
import { mailOutline, eyeOutline } from "ionicons/icons"
import { Link } from "react-router-dom";

type LogInLayoutProps = {
  onSuccess?: (user: CurrentUser) => void,
  onError?: (alertData: AlertInfo) => void
  onStateChanged?: (alertData: AlertInfo) => void
}

export default function LogInLayout(props: PropsWithRef<LogInLayoutProps>): React.ReactElement {  
  const emailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);  

  const { isLoading, isError, error: mutationError, mutate } = useMutation(
    'LOGIN_USER',
    async (dto: UserLoginDTO) => {
      const userApiClient: UserApiClient = new UserApiClient()
      return userApiClient.login(dto)
    },
    {      
      onSuccess: (user: CurrentUser) => {
        props.onSuccess?.(user)
      },
      onError: (err) => {
        props.onError?.({ message: JSON.stringify(err), type: AlertType.ERROR })
      }
    }
  )

  useEffect(() => {
    if (isLoading)
      props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS });
    else if (isError)
      props.onError?.({ message: "Erro: " + mutationError, type: AlertType.ERROR });
  }, [isLoading, isError]);

  function submitData(): void {
    const userDTO: UserLoginDTO = {
      email: emailInput.current ? emailInput.current.value : "",
      password: passInput.current ? passInput.current.value : ""
    }

    let errorMessage: string = getErrorMessageIfNotValid(userDTO);
    if (errorMessage !== '') {
      props.onError?.({ message: errorMessage, type: AlertType.ERROR });
      return;
    }

    mutate(userDTO);
  }
  
  return(
    <div className="flex flex-col gap-y-4 w-full mx-auto">
      <FormInputGroupMerge>
        <TextInput ref={ emailInput } name="Email" ionIconPath={ mailOutline } />
        <TextInput ref={ passInput } name="Senha" ionIconPath={ eyeOutline } />
      </FormInputGroupMerge>

      <button onClick={ submitData }
          className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Entrar
      </button>
      <span className="flex text-white justify-end gap-x-2">
        Não tem uma conta?
        <Link to="/sign-in" className="underline  hover:text-primary">
          Registrar-se
        </Link>
      </span>
    </div>
  );
}

function getErrorMessageIfNotValid(userSignInData: UserLoginDTO): string {
  if (userSignInData.email.trim() === '') 
    return "Por favor, insira um email.";
  if (userSignInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  return "";
}