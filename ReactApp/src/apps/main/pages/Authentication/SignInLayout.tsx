import { useMutation } from "react-query";
import Axios, { AxiosError } from "axios";
import FormInputGroupMerge from "../../../shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "../../../shared/components/formComponents/FromGroup/TextInput.tsx";
import React, { FormEvent, useContext, useState } from "react";
import { AuthContext, AuthContextProps, AlertFeedbackType } from "./AuthPage.tsx";

type userSignInData = {
  email: string,
  userName: string,
  password: string,
  passwordConfirm: string,
}

export default function SignInLayout(): React.ReactElement {
  const authContext: AuthContextProps = useContext(AuthContext);  
  const [ userSignInData, setUserSignInData ] = useState<userSignInData>({
    email: "",
    userName: "",
    password: "",
    passwordConfirm: "",
  });
  
  const handleEmailChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, email: newValue}));
  const handleUserNameChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, userName: newValue}));
  const handlePasswordChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, password: newValue}));
  const handlePasswordConfirmChange = (newValue: string): void =>
    setUserSignInData(data => ({...data, passwordConfirm: newValue}));

  const mutation = useMutation(
    'ADD_USER',
    async (newUserSignInData: userSignInData) => {
      Axios.post('http://localhost:8080/api/register/', { 
        params: {
          email: newUserSignInData.email,
          userName: newUserSignInData.userName,
          password: newUserSignInData.password,
      }
    }).then(response => console.log(response.data));
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    let errorMessage: string = getErrorMessageIfNotValid(userSignInData);
    e.preventDefault();
    if (errorMessage !== '') {
      authContext.setAlertFeedbackData?.({ message: errorMessage, type: AlertFeedbackType.ERROR });
      return;
    }
    authContext.setAlertFeedbackData?.({ message: '', type: AlertFeedbackType.HIDDEN });

    mutation.mutate(userSignInData);
  }
 
  // if (mutation.isLoading)
  //   authContext.setAlertFeedbackData?.({ message: "Enviando...", type: AlertFeedbackType.PROGRESS });
  // else if (mutation.isError) 
  //   authContext.setAlertFeedbackData?.({ message: "Erro", type: AlertFeedbackType.ERROR });
  // else if (mutation.isSuccess)
  //   authContext.setAlertFeedbackData?.({ message: "Registrado com sucesso!", type: AlertFeedbackType.ERROR });

  return(
    <form onSubmit={ e => { handleSubmit(e) } }
       className="flex flex-col gap-y-4 w-2/3 mx-auto">      
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
  if (userSignInData.userName.trim() === '') 
    return "Por favor, insira um nome de usuário.";
  if (userSignInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  if (userSignInData.passwordConfirm.trim() === '') 
    return "Por favor, insira uma confimação da senha.";

  if (userSignInData.password !== userSignInData.passwordConfirm)
    return "A senha e a confirmação são diferentes.";
  return "";
}