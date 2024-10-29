import React, { PropsWithRef, RefObject, useEffect, useRef, useState } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import FormInputGroupMerge from "@/apps/shared/components/formComponents/FormGroup/FormInputGroupMerge.tsx"
import TextInput from "@/apps/shared/components/formComponents/FormGroup/TextInput.tsx";
import { useMutation } from "react-query";
import UserApiClient from "@api/UserApiClient.ts";
import { UserLoginDTO } from "@models/data/UserDTOs.ts";
import CurrentUser from "@models/User.ts";
import { mailOutline, eyeOutline } from "ionicons/icons"
import { Link } from "react-router-dom";
import PasswordResetEmailSentModal from "@/apps/main/components/modal/PasswordResetEmailSentModal.tsx";
import Validation from "@/libs/Validation.ts";
import { AxiosError } from 'axios';

type LogInLayoutProps = {
  onSuccess?: (user: CurrentUser) => void,
  onError?: (alertData: AlertInfo) => void
  onStateChanged?: (alertData: AlertInfo) => void
}

// TODO: Simplify component
export default function LogInLayout(props: PropsWithRef<LogInLayoutProps>): React.ReactElement {  
  const [ isPasswordReserModalOpen, setIsPasswordResetModalOpen ] = useState<boolean>(false);
  const emailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);  

  const { isLoading: loginIsLoading, mutate: loginMutate } = useMutation('LOGIN_USER',
    async (dto: UserLoginDTO) => {
      const userApiClient: UserApiClient = new UserApiClient()
      return userApiClient.login(dto)
    }, {
      onSuccess: (user: CurrentUser) => props.onSuccess?.(user),      
      onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err))
    }
  );

  const { isLoading: forgotPasswordIsLoading, mutate: forgotPasswordMutate } = useMutation('FORGOT_PASS',
    async (email: string) => {
      const userApiClient = new UserApiClient()
      return userApiClient.forgotPassword({ email: email })
    }, {      
      onSuccess: () => openPasswordResetEmailSentModal(),      
      onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err))
    }
  );

  useEffect(() => {
    if (loginIsLoading || forgotPasswordIsLoading)
      props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS });
  }, [loginIsLoading, forgotPasswordIsLoading]);

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

    loginMutate(userDTO);
  }

  function sendEmailPasswordReset() {
    if (emailInput.current) {
      if (emailInput.current.value.trim() === '') {
        props.onError?.({message: "Para recuperar sua senha, insira o email da sua conta.", type: AlertType.ERROR})
        return;
      } else if (Validation.isValidEmail(emailInput.current.value))
        forgotPasswordMutate(emailInput.current.value)
    }
  }
  function openPasswordResetEmailSentModal() {
    setIsPasswordResetModalOpen(true);
    props.onStateChanged?.({ type: AlertType.HIDDEN })
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
      <div className="flex text-white justify-between gap-x-2">
        <a className="underline hover:text-primary select-none cursor-pointer" 
            onClick={ sendEmailPasswordReset }>
          Esqueci minha senha.
        </a>
        <span className="flex gap-x-2">
          Não tem uma conta?
          <Link to="/sign-in" className="underline hover:text-primary">
            Registrar-se
          </Link>
        </span>
      </div>
      <PasswordResetEmailSentModal onCloseRequest={ () => setIsPasswordResetModalOpen(false) }
          email={ emailInput.current ? emailInput.current.value : "" }
          isOpen={ isPasswordReserModalOpen } />
    </div>
  );
}

function getErrorMessageIfNotValid(userLogInData: UserLoginDTO): string {
  if (userLogInData.email.trim() === '')
    return "Por favor, insira um email.";
  if (userLogInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  return "";
}

function handleRequestError(err: AxiosError | Error): AlertInfo {  
  if (err instanceof AxiosError) {
    switch (err.response?.status) {
      case 401:
      case 400:
        return { message: "Usuário ou senha incorretos.", type: AlertType.ERROR };
      default:
        if (process.env.NODE_ENV === 'development')
          return { message: err.message, type: AlertType.ERROR };        
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(err.stack);
    return { message: err.name +  ": " + err.message, type: AlertType.ERROR };
  }
  
  return { message: "Por favor, tente novamente mais tarde.", type: AlertType.ERROR };
}
