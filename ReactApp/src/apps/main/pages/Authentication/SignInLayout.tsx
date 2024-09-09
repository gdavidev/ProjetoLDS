import { useMutation } from "react-query";
import Axios from "axios";
import FormInputGroupMerge from "../../../shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "../../../shared/components/formComponents/FromGroup/TextInput.tsx";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextProps, AlertFeedbackType } from "./AuthPage.tsx";

type userSignInData = {
  email: string,
  username: string,
  password: string,
  passwordConfirm: string,
}

export default function SignInLayout(): React.ReactElement {
  const authContext: AuthContextProps = useContext(AuthContext);  
  const [ userSignInData, setUserSignInData ] = useState<userSignInData>({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  
  const handleEmailChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, email: newValue}));
  const handleUserNameChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, username: newValue}));
  const handlePasswordChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, password: newValue}));
  const handlePasswordConfirmChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, passwordConfirm: newValue}));

  const { isLoading, isSuccess, isError, error: mutationError, mutate } = useMutation(
    'ADD_USER',
    async (newUserSignInData: userSignInData) => {
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
  
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    let errorMessage: string = getErrorMessageIfNotValid(userSignInData);
    if (errorMessage !== '') {
      authContext.setAlertFeedbackData?.({ message: errorMessage, type: AlertFeedbackType.ERROR });
      return;
    }
    authContext.setAlertFeedbackData?.({ message: '', type: AlertFeedbackType.HIDDEN });
  
    mutate(userSignInData);
  }

  return(
    <form onSubmit={ e => { handleSubmit(e) } }
       className="flex flex-col gap-y-4 w-full mx-auto">      
      <FormInputGroupMerge>
        <TextInput name="Email" onChange={ e => handleEmailChange(e.target.value) } />
        <TextInput name="Usuário" onChange={ e => handleUserNameChange(e.target.value) } />
      </FormInputGroupMerge>

      <FormInputGroupMerge>
        <TextInput name="Senha" onChange={ e => handlePasswordChange(e.target.value) } />
        <TextInput name="Confirmar Senha" onChange={ e => handlePasswordConfirmChange(e.target.value) } />
      </FormInputGroupMerge>

      <input type="submit" value="Registrar"
        className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950" />
    </form>
  );
}

function getErrorMessageIfNotValid(userSignInData: userSignInData): string {
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