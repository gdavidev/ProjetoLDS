import { PropsWithRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx";
import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import CurrentUser from "@models/CurrentUser.ts";
import { Link } from 'react-router-dom';
import PasswordResetEmailSentModal from "@apps/main/components/modal/PasswordResetEmailSentModal.tsx";
import { AxiosError } from 'axios';
import { Controller, useForm } from "react-hook-form";
import { IonIcon } from "@ionic/react";
import { mailOutline } from "ionicons/icons";
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

export default function LogInLayout(props: PropsWithRef<LogInLayoutProps>) {
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
      { status: 400, userMessage: "Usuário ou senha incorretos." },
      { status: 401, userMessage: (resData: any) => handleUnauthorizedRequestError(resData) },
      { status: 'default', userMessage: "Por favor tente novamente mais tarde." }
    ],
    onError: props.onError
  });

  const handleUnauthorizedRequestError = useCallback((resData: any) => {
    if (resData['erro']) {
      if (resData['erro'].includes('banido'))
        return "Conta banida";
      if (resData['erro'].includes('inativo'))
        return "Conta inativada";
    }
    return "Usuário ou senha incorretos.";
  }, [])

  // ---- API Executing ----
  const doLogin = useCallback((data: ILogInLayoutFormData) => {
    const emailMessage: string = validateEmail(data.email);
    const passwordMessage: string = validatePassword(data.password);
    if (emailMessage)
      return props.onError?.(emailMessage);
    if (passwordMessage)
      return props.onError?.(passwordMessage);

    login({ email: data.email, password: data.password })
  }, []);  
  const doSendEmailPasswordReset = useCallback((data: ILogInLayoutFormData) => {
    const emailMessage: string | undefined = validateEmail(data.email);
    if (emailMessage)
      return props.onError?.(emailMessage)

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

  const validateEmail = useCallback((value: string) => {
    if (!value) return "Por favor, insira seu email."
    if (!Validation.isValidEmail(value)) return "O Email esta em um formato inválido"
    return ''
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) return "Por favor, insira sua senha."
    return ''
  }, [])

  return(
    <>
      <form className="flex flex-col gap-y-4 w-full mx-auto">
        <h1 className='text-white text-xl text-center font-bold -mb-2'>Entrar</h1>
        <FormGroup>
          <Controller
              name="email"
              control={ control }
              render={({field}) => (
                <TextInput {...field}
                    name="Email"
                    inputContainerClassName="bg-white"
                    styleType={ TextInputStyle.LABEL_LESS }
                    endDecoration={ <IonIcon icon={mailOutline} /> } />
              )}/>
          <Controller
              name="password"
              control={ control }
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
            className="btn-primary shadow-md shadow-slate-950">
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
      <PasswordResetEmailSentModal
          onCloseRequest={ () => setIsPasswordResetModalOpen(false) }
          email={ getValues('email') }
          isOpen={ isPasswordResetModalOpen }
      />
    </>
  );
}