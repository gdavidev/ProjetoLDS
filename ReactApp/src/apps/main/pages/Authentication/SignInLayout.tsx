import { useMutation } from "react-query";
import Axios from "axios";
import FormInputGroupMerge from "../../../shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "../../../shared/components/formComponents/FromGroup/TextInput.tsx";
import React, { RefObject, useContext, useEffect, useRef } from "react";
import { AuthContext, AuthContextProps, AlertFeedbackType } from "./AuthPage.tsx";
import { personOutline, mailOutline, eyeOutline } from "ionicons/icons"
import { Link } from "react-router-dom";

type UserSignInData = {
  email: string,
  username: string,
  password: string,
  passwordConfirm: string,
}

export default function SignInLayout(): React.ReactElement {
  const authContext: AuthContextProps = useContext(AuthContext);  
  const emailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const userNameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  const confirmPassInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
  
  const { isLoading, isSuccess, isError, error: mutationError, mutate } = useMutation(
    'ADD_USER',
    async (newUserSignInData: UserSignInData) => {
      return Axios.post('http://localhost:8080/api/register/', { 
        email: newUserSignInData.email,
        username: newUserSignInData.username,
        password: newUserSignInData.password
      })
      .then(response => console.log(response.data))
      .catch(error => console.error('Error:', error.response?.data));
    }
  );

  useEffect(() => {
    if (isLoading)
      authContext.setAlertFeedbackData?.({ message: "Enviando...", type: AlertFeedbackType.PROGRESS });
    else if (isError) 
      authContext.setAlertFeedbackData?.({ message: "Erro: " + mutationError, type: AlertFeedbackType.ERROR });
    else if (isSuccess)
      authContext.setAlertFeedbackData?.({ message: "Registrado com sucesso!", type: AlertFeedbackType.SUCCESS });
    else
      authContext.setAlertFeedbackData?.({ type: AlertFeedbackType.HIDDEN });
  }, [isLoading, isError, isSuccess])
  
  function submitData(): void {
    const userSignInData: UserSignInData = {
      email: emailInput.current?.value!,
      username: userNameInput.current?.value!,
      password: passInput.current?.value!,
      passwordConfirm: confirmPassInput.current?.value!
    }

    let errorMessage: string = getErrorMessageIfNotValid(userSignInData);
    if (errorMessage !== '') {
      authContext.setAlertFeedbackData?.({ message: errorMessage, type: AlertFeedbackType.ERROR });
      return;
    }
    authContext.setAlertFeedbackData?.({ message: '', type: AlertFeedbackType.HIDDEN });
  
    mutate(userSignInData);
  }

  return(
    <div className="flex flex-col gap-y-4 w-full mx-auto">      
      <FormInputGroupMerge>
        <TextInput ref={ emailInput } name="Email" ionIconPath={ mailOutline } />
        <TextInput ref={ userNameInput } name="Usuário" ionIconPath={ personOutline } />
      </FormInputGroupMerge>

      <FormInputGroupMerge>
        <TextInput ref={ passInput } name="Senha" ionIconPath={ eyeOutline } />
        <TextInput ref={ confirmPassInput } name="Confirmar Senha" ionIconPath={ eyeOutline } />
      </FormInputGroupMerge>

      <input type="submit" value="Registrar" onClick={ submitData }
        className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950" />

      <span className="flex text-white justify-end gap-x-2">
        Já tem uma conta?
        <Link to="/app/log-in" className="underline  hover:text-primary">
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