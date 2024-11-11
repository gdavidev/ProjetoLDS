import React, { PropsWithRef, useEffect, useState } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx"
import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import CurrentUser from "@models/User.ts";
import { Link } from "react-router-dom";
import PasswordResetEmailSentModal from "@apps/main/components/modal/PasswordResetEmailSentModal.tsx";
import Validation from "@libs/Validation.ts";
import { AxiosError } from 'axios';
import { Controller, useForm } from "react-hook-form";
import { IonIcon } from "@ionic/react";
import { mailOutline } from "ionicons/icons"
import PasswordHiddenToggle from "../../components/PasswordHiddenToggle.tsx";
import useAuth from "@/hooks/useAuth.ts";

type LogInLayoutProps = {
  onSuccess?: (user: CurrentUser) => void,
  onError?: (alertData: AlertInfo) => void
  onStateChanged?: (alertData: AlertInfo) => void
}
interface ILogInLayoutFormData {
  email: string;
  password: string;
}

const defaultValues: ILogInLayoutFormData = {
  email: '',
  password: '',
}

export default function LogInLayout(props: PropsWithRef<LogInLayoutProps>): React.ReactElement {  
  const [ isPasswordResetModalOpen, setIsPasswordResetModalOpen ] = useState<boolean>(false);
  const [ isPasswordHidden        , setIsPasswordHidden         ] = useState<boolean>(true);
  const { handleSubmit, watch, getValues, control } = useForm<ILogInLayoutFormData>({
    defaultValues: defaultValues,
  });
  const fields: ILogInLayoutFormData = watch();

  const { login, forgotPassword } = useAuth({
    onLogin: {
      onSuccess: (user: CurrentUser) => props.onSuccess?.(user),      
      onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err))
    },
    onForgotPassword: {      
      onSuccess: () => openEmailSentModal(),
      onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err))
    },
    onIsLoading: () => props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS })
  });

  function doLogin(data: ILogInLayoutFormData): void {    
    login({
      email: data.email,
      password: data.password
    });
  }
  function doSendEmailPasswordReset(data: ILogInLayoutFormData) {
    forgotPassword({
      email: data.email
    });
  }

  function openEmailSentModal() {
    setIsPasswordResetModalOpen(true);
    props.onStateChanged?.({ type: AlertType.HIDDEN })
  }
  
  useEffect(() => {
    const error: string | undefined = getErrorMessage(fields);
    if (error)
      props.onError?.({ message: error, type: AlertType.ERROR });
  }, []);

  return(
    <>
      <form className="flex flex-col gap-y-4 w-full mx-auto">
        <FormGroup>
          <Controller name="email" control={control} render={({field}) => (
            <TextInput {...field} 
                name="Email" 
                inputContainerClassName="bg-white"
                styleType={ TextInputStyle.LABEL_LESS }
                endDecoration={ <IonIcon icon={mailOutline} /> } />
          )}/>
          <Controller name="password" control={control} render={({field}) => (          
            <TextInput {...field} 
                name="Senha" 
                inputContainerClassName="bg-white" 
                password={ isPasswordHidden }
                styleType={ TextInputStyle.LABEL_LESS }
                endDecoration={ 
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden } /> 
                } />
          )}/>
        </FormGroup>

        <button onClick={ handleSubmit(doLogin) }
            className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
          Entrar
        </button>
        <div className="flex text-white justify-between gap-x-2">
          <a className="underline hover:text-primary select-none cursor-pointer" 
              onClick={ handleSubmit(doSendEmailPasswordReset) }>
            Esqueci minha senha.
          </a>
          <span className="flex gap-x-2">
            Não tem uma conta?
            <Link to="/sign-in" className="underline hover:text-primary">
              Registrar-se
            </Link>
          </span>
        </div>
      </form>
      <PasswordResetEmailSentModal onCloseRequest={ () => setIsPasswordResetModalOpen(false) }
          email={ getValues('email') } isOpen={ isPasswordResetModalOpen } />
    </>
  );
}

function getErrorMessage(data: ILogInLayoutFormData): string | undefined {
  if (data.email.trim() === '') return "Por favor, insira um email.";
  if (data.password.trim() === '') return "Por favor, insira uma senha.";
  if (!Validation.isValidEmail(data.email.trim())) return "O email não esta em um formato valido.";
  return undefined;
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