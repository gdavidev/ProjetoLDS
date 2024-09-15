import React, { RefObject, useContext, useEffect, useRef } from "react";
import { AuthContext, AuthContextProps, AlertFeedbackType } from "./AuthPage.tsx";
import FormInputGroupMerge from "../../../shared/components/formComponents/FromGroup/FormInputGroupMerge.tsx"
import TextInput from "../../../shared/components/formComponents/FromGroup/TextInput.tsx";
import { useMutation } from "react-query";
import UserApiClient from "../../../../api/UserApiClient.ts";
import { UserLoginDTO } from "../../../../models/UserDTOs.ts";
import { MainContext, MainContextProps } from "../../../shared/context/MainContextProvider.tsx";
import CurrentUser from "../../../../models/User.ts";
import { mailOutline, eyeOutline } from "ionicons/icons"
import { Link } from "react-router-dom";

export default function LogInLayout(): React.ReactElement {  
  const emailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const passInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const mainContext: MainContextProps = useContext(MainContext)
  const authContext: AuthContextProps = useContext(AuthContext);

  const { isLoading, isSuccess, isError, error: mutationError, mutate } = useMutation(
    'LOGIN_USER',
    async (dto: UserLoginDTO) => {
      const userApiClient: UserApiClient = new UserApiClient()
      return userApiClient.login(dto)
    },
    {      
      onSuccess: (user: CurrentUser) => {
        mainContext.setCurrentUser?.(user)
        window.location.replace('http://localhost:5173/app/')
      },
      onError: (err) => {
        console.log(err)
      }
    }
  )

  useEffect(() => {
    if (isLoading)
      authContext.setAlertFeedbackData?.({ message: "Enviando...", type: AlertFeedbackType.PROGRESS });
    else if (isError) 
      authContext.setAlertFeedbackData?.({ message: "Erro: " + mutationError, type: AlertFeedbackType.ERROR });
    else if (isSuccess)
      authContext.setAlertFeedbackData?.({ message: "Logado com sucesso!", type: AlertFeedbackType.SUCCESS });
    else
      authContext.setAlertFeedbackData?.({ type: AlertFeedbackType.HIDDEN });
  }, [isLoading, isError, isSuccess])

  function submitData(): void {
    const userDTO: UserLoginDTO = {
      email: emailInput.current ? emailInput.current.value : "",
      password: passInput.current ? passInput.current.value : ""
    }

    let errorMessage: string = getErrorMessageIfNotValid(userDTO);
    if (errorMessage !== '') {
      authContext.setAlertFeedbackData?.({ message: errorMessage, type: AlertFeedbackType.ERROR });
      return;
    }
    authContext.setAlertFeedbackData?.({ message: '', type: AlertFeedbackType.HIDDEN });

    mutate(userDTO);
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
      <span className="flex text-white justify-end gap-x-2">
        Não tem uma conta?
        <Link to="/app/sign-in" className="underline  hover:text-primary">
          Registrar-se
        </Link>
      </span>
    </div>
  );
}

function getErrorMessageIfNotValid(userSignInData: UserLoginDTO): string {
  if (userSignInData.email.trim() === '') 
    return "Por favor, insira um email.";
  if (userSignInData.password.trim() === '') 
    return "Por favor, insira uma senha.";
  return "";
}