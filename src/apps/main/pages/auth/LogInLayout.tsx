import React, { PropsWithRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx"
import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import CurrentUser from "@models/CurrentUser.ts";
import { Link } from "react-router-dom";
import PasswordResetEmailSentModal from "@apps/main/components/modal/PasswordResetEmailSentModal.tsx";
import { AxiosError } from 'axios';
import { Controller, useForm } from "react-hook-form";
import { IonIcon } from "@ionic/react";
import { mailOutline } from "ionicons/icons"
import PasswordHiddenToggle from "@apps/main/components/PasswordHiddenToggle.tsx";
import useAuth from "@/hooks/useAuth.ts";
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import Validation from '@libs/Validation.ts';

type LogInLayoutProps = {
  onSuccess?: (user: CurrentUser) => void,
  onError?: (message: string) => void
  onStateChanged?: (message: string) => void
}
interface ILogInLayoutFormData {
  email: string;
  password: string;
}

export default function LogInLayout(props: PropsWithRef<LogInLayoutProps>): React.ReactElement {  
  const [ isPasswordResetModalOpen, setIsPasswordResetModalOpen ] = useState<boolean>(false);
  const [ isPasswordHidden        , setIsPasswordHidden         ] = useState<boolean>(true);
  const { handleSubmit, watch, getValues, control, formState: { errors }, clearErrors } =
    useForm<ILogInLayoutFormData>({
      defaultValues: {
        email: '',
        password: '',
      },
    });
  const fields: ILogInLayoutFormData = watch()

  // ---- Initialization ----
  useLayoutEffect(() => {
    clearErrors();
    clearRequestErrors();
  }, []);

  // ---- API Calls Setup ----
  const { login, forgotPassword } = useAuth({
    onLogin: {
      onSuccess: (user: CurrentUser) => props.onSuccess?.(user),      
      onError: (err: AxiosError | Error) => handleRequestError(err)
    },
    onForgotPassword: {      
      onSuccess: () => openEmailSentModal(),
      onError: (err: AxiosError | Error) => handleRequestError(err)
    },
    onIsLoading: () => props.onStateChanged?.("Enviando...")
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError, clear: clearRequestErrors } = useRequestErrorHandler({
    mappings: [
      { status: [400, 401], userMessage: "Usuário ou senha incorretos." },
      { status: 'default', userMessage: "Por favor tente novamente mais tarde." }
    ],
    onError: props.onError
  });

  // ---- API Executing ----
  const doLogin = useCallback((data: ILogInLayoutFormData) => {
    login({ email: data.email, password: data.password })
  }, []);  
  const doSendEmailPasswordReset = useCallback((data: ILogInLayoutFormData) => {
    forgotPassword({ email: data.email })
  }, []);
 
  // ---- Error handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message)
      props.onError?.(formError.message);
  }, [fields]);

  // ---- General callbacks ----
  const openEmailSentModal = useCallback(() => {
    setIsPasswordResetModalOpen(true);
    props.onStateChanged?.('Email enviado.')
  }, []);

  return(
    <>
      <form className="flex flex-col gap-y-4 w-full mx-auto">
        <FormGroup>
          <Controller
              name="email"
              control={control}
              rules={{
                required: "Por favor, insira seu email.",
                validate: (value: string) =>
                    Validation.isValidEmail(value) || "O Email esta em um formato inválido"
              }}
              render={({field}) => (
                <TextInput {...field}
                    name="Email"
                    inputContainerClassName="bg-white"
                    styleType={ TextInputStyle.LABEL_LESS }
                    endDecoration={ <IonIcon icon={mailOutline} /> } />
              )}/>
          <Controller
              name="password"
              control={control}
              rules={{ required: "Por favor, insira sua senha." }}
              render={({field}) => (
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

        <button
            type='submit'
            onClick={ handleSubmit(doLogin) }
            className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
          Entrar
        </button>
        <div className="flex text-white justify-between gap-x-2">
          <button
              type='submit'
              onClick={ handleSubmit(doSendEmailPasswordReset) }
              className="underline hover:text-primary select-none cursor-pointer">
            Esqueci minha senha.
          </button>
          <span className="flex gap-x-2">
            Não tem uma conta?
            <Link to="/sign-up" className="underline hover:text-primary">
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