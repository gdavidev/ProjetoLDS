import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import React, { PropsWithoutRef, useEffect, useState } from "react";
import { AlertInfo, AlertType } from "./AuthPage.tsx";
import { personOutline, mailOutline } from "ionicons/icons"
import { Link } from "react-router-dom";
import { AxiosError } from 'axios';
import useAuth from "@/hooks/useAuth.ts";
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx";
import { Controller, useForm } from "react-hook-form";
import { IonIcon } from "@ionic/react";
import PasswordHiddenToggle from "@apps/main/components/PasswordHiddenToggle.tsx";

type SignInLayoutProps = {
  onError?: (alertData: AlertInfo) => void,
  onSuccess?: () => void,
  onStateChanged?: (alertData: AlertInfo) => void,
}
interface IUserSignInFormData {
  email: string
  username: string
  password: string
  passwordConfirm: string
}
const defaultValues: IUserSignInFormData = {
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',
}

export default function SignInLayout(props: PropsWithoutRef<SignInLayoutProps>): React.ReactElement {
  const [ isPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ isPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { handleSubmit, watch, control } = useForm<IUserSignInFormData>({
    defaultValues: defaultValues,
  });
  const fields: IUserSignInFormData = watch();

  const { register } = useAuth({      
    onSuccess: () => props.onSuccess?.(),
    onError: (err: AxiosError | Error) => props.onError?.(handleRequestError(err)),
    onIsLoading: () => props.onStateChanged?.({ message: "Enviando...", type: AlertType.PROGRESS })
  });
  
  function submitForm(data: IUserSignInFormData): void {
    register({
      email: data.email,
      username: data.username,
      password: data.password,
    });
  }

  useEffect(() => {
    const error: string | undefined = getErrorMessageIfNotValid(fields);
    if (error)
      props.onError?.({ message: error, type: AlertType.ERROR });
  }, []);
  
  return(
    <form onSubmit={ handleSubmit(submitForm) } className="flex flex-col gap-y-4 w-full mx-auto">
      <FormGroup>
        <Controller name="email" control={control} render={ ({field}) => (
          <TextInput {...field} 
              name="Email"
              inputContainerClassName="bg-white" 
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ <IonIcon icon={mailOutline} /> } />
        ) }/>
        <Controller name="username" control={control} render={ ({field}) => (
          <TextInput {...field} 
              name="Nome de Usuário"
              inputContainerClassName="bg-white" 
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ <IonIcon icon={personOutline} /> } />
        ) }/>
      </FormGroup>

      <FormGroup>
        <Controller name="password" control={control} render={ ({field}) => (          
          <TextInput {...field} 
              name="Senha"
              inputContainerClassName="bg-white" 
              password={ isPasswordHidden } 
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ 
                <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden } /> 
              } />
        ) }/>
        <Controller name="passwordConfirm" control={control} render={ ({field}) => (          
          <TextInput {...field} 
              name="Confirmar Senha" 
              inputContainerClassName="bg-white" 
              password={ isPasswordConfirmHidden } 
              styleType={ TextInputStyle.LABEL_LESS }
              endDecoration={ 
                <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordConfirmHidden } /> 
              } />
        ) }/>
      </FormGroup>

      <button className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Registrar
      </button>

      <span className="flex text-white justify-end gap-x-2">
        Já tem uma conta?
        <Link to="/log-in" className="underline  hover:text-primary">
          Entrar
        </Link>
      </span>
    </form>
  );
}

function getErrorMessageIfNotValid(data: IUserSignInFormData): string | undefined {
  if (data.email.trim() === '') 
    return "Por favor, insira um email.";
  if (data.username.trim() === '') 
    return "Por favor, insira um nome de usuário.";
  if (data.password.trim() === '') 
    return "Por favor, insira uma senha.";
  if (data.passwordConfirm.trim() === '') 
    return "Por favor, insira uma confimação da senha.";

  if (data.password !== data.passwordConfirm)
    return "A senha e a confirmação são diferentes.";
  return undefined;
}

function handleRequestError(err: AxiosError | Error): AlertInfo {  
  const isDebugMode: boolean = process.env.NODE_ENV === 'development'
  
  if (err instanceof AxiosError) {
    switch (err.response?.status) {
      case 400:
        const resData: any = err.response.data;
        if (resData["username"])
          return { message: "Nome de usuário indisponível.", type: AlertType.ERROR };
        if (resData["email"])
          return { message: "Este email ja está em uso.", type: AlertType.ERROR };
        if (isDebugMode)
          return { message: resData.status + "Erro desconhecido.", type: AlertType.ERROR }
        break;
      default:
        if (isDebugMode)
          return { message: err.message, type: AlertType.ERROR };        
    }
  } else if (isDebugMode) {
    console.log(err.stack);
    return { message: err.name +  ": " + err.message, type: AlertType.ERROR };
  }
  
  return { message: "Por favor, tente novamente mais tarde.", type: AlertType.ERROR };
}