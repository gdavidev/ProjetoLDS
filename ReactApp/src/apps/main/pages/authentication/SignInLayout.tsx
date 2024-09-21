import { useMutation } from "react-query";
import FormInputGroupMerge from "@shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "@shared/components/formComponents/FromGroup/TextInput.tsx";
import React, { PropsWithoutRef, RefObject, useEffect, useRef } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import { personOutline, mailOutline, eyeOutline } from "ionicons/icons"
import { Link } from "react-router-dom";
import UserApiClient from "@/api/UserApiClient.ts";
import { UserRegisterDTO } from "@/models/UserDTOs.ts";

type UserSignInData = {
  email: string,
  username: string,
  password: string,
  passwordConfirm: string,
}

type SignInLayoutProps = {
  onError?: (alertData: AlertInfo) => void,
  onSuccess?: () => void,
  onStateChanged?: (alertData: AlertInfo) => void,
}

export default function SignInLayout(props: PropsWithoutRef<SignInLayoutProps>): React.ReactElement {
  const emailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const userNameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const confirmPassInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  
  const { isLoading, isError, error: mutationError, mutate } = useMutation(
    'ADD_USER',
    async (dto: UserRegisterDTO) => {
      const userApiClient: UserApiClient = new UserApiClient();
      userApiClient.register(dto);
    },
    {      
      onSuccess: () => {
        props.onSuccess?.()
      },
      onError: (err) => {
        props.onError?.({ message: JSON.stringify(err), type: AlertType.ERROR })
      }
    }    
  );

  useEffect(() => {
    if (isLoading)
      props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS });
    else if (isError) 
      props.onError?.({ message: "Erro: " + mutationError, type: AlertType.ERROR });
  }, [isLoading, isError])
  
  function submitData(): void {
    const userRegisterDTO: UserRegisterDTO = {
      email: emailInput.current?.value!,
      username: userNameInput.current?.value!,
      password: passInput.current?.value!,
    }    
    
    let errorMessage: string = getErrorMessageIfNotValid({
      email: userRegisterDTO.email!,
      username: userRegisterDTO.username!,
      password: userRegisterDTO.password!,
      passwordConfirm: confirmPassInput.current?.value!
    });

    if (errorMessage !== '') {
      props.onError?.({ message: errorMessage, type: AlertType.ERROR });
      return;
    }  
    mutate(userRegisterDTO);
  }
  
  return(
    <div className="flex flex-col gap-y-4 w-full mx-auto">      
      <FormInputGroupMerge>
        <TextInput ref={ emailInput } name="Email" ionIconPath={ mailOutline } />
        <TextInput ref={ userNameInput } name="Nome de Usuário" ionIconPath={ personOutline } />
      </FormInputGroupMerge>

      <FormInputGroupMerge>
        <TextInput ref={ passInput } name="Senha" ionIconPath={ eyeOutline } />
        <TextInput ref={ confirmPassInput } name="Confirmar Senha" ionIconPath={ eyeOutline } />
      </FormInputGroupMerge>

      <button onClick={ submitData }
          className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Registrar
      </button>

      <span className="flex text-white justify-end gap-x-2">
        Já tem uma conta?
        <Link to="/log-in" className="underline  hover:text-primary">
          Entrar
        </Link>
      </span>
    </div>
  );
}

function getErrorMessageIfNotValid(userSignInData: UserSignInData): string {
  if (userSignInData.email.trim() === '') 
    return "Por favor, insira um email.";
  if (userSignInData.username.trim() === '') 
    return "Por favor, insira um nome de usuário.";
  if (userSignInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  if (userSignInData.passwordConfirm.trim() === '') 
    return "Por favor, insira uma confimação da senha.";

  if (userSignInData.password !== userSignInData.passwordConfirm)
    return "A senha e a confirmação são diferentes.";
  return "";
}