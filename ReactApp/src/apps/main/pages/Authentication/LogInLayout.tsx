import React, { useContext, useState } from "react";
import Axios from "axios";
import { AuthContext, AuthContextProps, AlertFeedbackType } from "./AuthPage.tsx";
import FormInputGroupMerge from "../../../shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "../../../shared/components/formComponents/FromGroup/TextInput.tsx";

type userLogInData = {
  email: string,
  password: string,
}

export default function LogInLayout(): React.ReactElement {  
  const authContext: AuthContextProps = useContext(AuthContext);  
  const [ userLogInData, setUserLogInData ] = useState<userLogInData>({
    email: "",    
    password: "",
  });
  
  const handleEmailChange = (newValue: string): void =>
    setUserLogInData(data => ({...data, email: newValue}));
  const handlePasswordChange = (newValue: string): void =>
    setUserLogInData(data => ({...data, password: newValue}));

  const retrieveUserCredentials = () => {
    Axios.get('http://localhost:8080/api/token/', { params: userLogInData })
      .then(response => console.log(response.data));
  }

  function submitData(): void {
    let errorMessage: string = getErrorMessageIfNotValid(userLogInData);
    if (errorMessage !== '') {
      authContext.setAlertFeedbackData?.({ message: errorMessage, type: AlertFeedbackType.ERROR });
      return;
    }
    authContext.setAlertFeedbackData?.({ message: '', type: AlertFeedbackType.HIDDEN });

    retrieveUserCredentials()
  }
  
  return(
    <div className="flex flex-col gap-y-4 w-2/3 mx-auto">
      <FormInputGroupMerge>
        <TextInput name="Email" onChange={ e => handleEmailChange(e.target.value) } />
        <TextInput name="Senha" onChange={ e => handlePasswordChange(e.target.value) } />
      </FormInputGroupMerge>

      <button onClick={ submitData } 
          className="btn-r-md bg-primary hover:bg-primary-dark shadow-md shadow-slate-950">
        Entrar
      </button>
    </div>
  );
}

function getErrorMessageIfNotValid(userSignInData: userLogInData): string {
  if (userSignInData.email.trim() === '') 
    return "Por favor, insira um email.";
  if (userSignInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  return "";
}