import TextInput, { TextInputStyle } from "@apps/shared/components/formComponents/TextInput.tsx";
import React, { PropsWithoutRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { personOutline, mailOutline } from "ionicons/icons"
import { Link } from "react-router-dom";
import { AxiosError } from 'axios';
import useAuth from "@/hooks/useAuth.ts";
import FormGroup from "@apps/shared/components/formComponents/FormGroup.tsx";
import { Controller, useForm } from "react-hook-form";
import { IonIcon } from "@ionic/react";
import PasswordHiddenToggle from "@apps/main/components/PasswordHiddenToggle.tsx";
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview.tsx';
import FileInput from '@shared/components/formComponents/FileInput.tsx';
import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'
import Validation from '@libs/Validation.ts';

type SignUpLayoutProps = {
  onSuccess?: () => void,
  onError?: (message: string) => void,
  onStateChanged?: (message: string) => void,
}
interface IUserSignUpFormData {
  email: string
  username: string
  password: string
  passwordConfirm: string
  profilePic: Thumbnail
}

export default function SignUpLayout(props: PropsWithoutRef<SignUpLayoutProps>): React.ReactElement {
  const [ isPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ isPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { handleSubmit, watch, getValues, control, formState: { errors }, clearErrors } = useForm<IUserSignUpFormData>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      profilePic: new Thumbnail({ url: userImageNotFound })
    },
  });
  const fields: IUserSignUpFormData = watch();

  // ---- Initialization ----
  useLayoutEffect(() => {
    clearErrors();
    clearRequestErrors();
  }, []);

  // ---- API Calls Setup ----
  const { register } = useAuth({      
    onSuccess: () => props.onSuccess?.(),
    onError: (err: AxiosError | Error) => handleRequestError(err),
    onIsLoading: () => props.onStateChanged?.("Enviando...")
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError, clear: clearRequestErrors } = useRequestErrorHandler({
    mappings: [{ status: 400, userMessage: (resData: any) => handleBadRequestError(resData) }],
    onError: (message: string) => props.onError?.(message)
  })

  const handleBadRequestError = useCallback((resData: any): string => {
    if (resData["username"])
      return 'Nome de usuário indisponível.';
    if (resData["email"]) {
      if (resData["email"][0].includes('valid'))
        return 'Insira um email valido';
      if (resData["email"][0].includes('uso'))
        return 'Este email ja esta em uso';
    }
    if (resData['imagem_perfil'])
      return 'Arquivo de imagem enviado deve ser to tipo JPG ou PNG'
    return 'Erro desconhecido';
  }, []);

  // ---- API Executing ----
  const submitForm = useCallback((data: IUserSignUpFormData): void => {
    register({
      email: data.email,
      username: data.username,
      password: data.password,
      imagem_perfil: data.profilePic.file ?? undefined,
    });
  }, []);

  // ---- Error handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message)
      props.onError?.(formError.message);
  }, [fields]);
  
  return(
    <form onSubmit={ handleSubmit(submitForm) } className="flex flex-col gap-y-4 w-full mx-auto">
      <h1 className="text-white text-xl text-center font-bold -mb-2">Registrar-se</h1>
      <div className='flex gap-x-2'>
        <div className="flex flex-col justify-between items-center">
          <FileInputImagePreview
              thumbnail={watch('profilePic')}
              imgClassName="h-[130px] max-w-[130px]" />
          <Controller
              name="profilePic"
              control={control}
              render={({ field }) => (
                  <FileInput
                      {...field}
                      buttonText="Sua Imagem"
                      onChange={(e) => field.onChange(e ? new Thumbnail({ file: e[0] }) : undefined)}
                      error={errors.profilePic !== undefined}
                      accept="image/*" />
              )} />
        </div>
        <div className="flex flex-col gap-y-4 grow">
          <FormGroup>
            <Controller
                name="email"
                control={control}
                rules={{
                  required: "Por favor, insira seu email.",
                  validate: (value: string) =>
                      Validation.isValidEmail(value) || "O Email esta em um formato inválido"
                }}
                render={({ field }) => (
                    <TextInput {...field}
                       name="Email"
                       inputContainerClassName="bg-white"
                       styleType={TextInputStyle.LABEL_LESS}
                       endDecoration={<IonIcon icon={mailOutline} />} />
            )} />
            <Controller
                name="username"
                control={control}
                rules={{ required: 'Por favor, insira seu nome de usuário' }}
                render={({ field }) => (
                    <TextInput {...field}
                       name="Nome de Usuário"
                       inputContainerClassName="bg-white"
                       styleType={TextInputStyle.LABEL_LESS}
                       endDecoration={<IonIcon icon={personOutline} /> } />
            ) }/>
          </FormGroup>

          <FormGroup>
            <Controller
                name="password"
                control={control}
                rules={{
                  required: "Por favor, insira sua senha.",
                  validate: (value: string) =>
                      Validation.isValidPassword(value) || "A senha não esta em um formato inválido"
                }}
                render={ ({field}) => (
                    <TextInput {...field}
                        name="Senha"
                        inputContainerClassName="bg-white"
                        password={ isPasswordHidden }
                        styleType={ TextInputStyle.LABEL_LESS }
                        endDecoration={
                          <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden } />
                        } />
            ) }/>
            <Controller
                name="passwordConfirm"
                control={control}
                rules={{
                  required: "Por favor, confirme sua senha.",
                  validate: (value: string) =>
                      getValues('password') === value || "As senhas não conferem."
                }}
                render={ ({field}) => (
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
        </div>
      </div>

      <button className="btn-primary shadow-md shadow-slate-950">
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