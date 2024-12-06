import React, { PropsWithoutRef, useContext, useCallback, useEffect } from 'react';
import SignInLayout from "@/apps/main/pages/auth/SignInLayout";
import LogInLayout from "@/apps/main/pages/auth/LogInLayout";
import logo from '/icons/logo.png'
import CurrentUser from "@/models/CurrentUser";
import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import { useNavigate } from "react-router-dom";
import PasswordResetLayout from "./PasswordResetLayout";
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useNotification, { useNotificationDefaults } from '@/hooks/feedback/useNotification.tsx';

export enum AuthPageMode {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
}
export type AuthPageProps = {
  mode: AuthPageMode
}

export default function AuthPage(props: PropsWithoutRef<AuthPageProps>): React.ReactElement {
  const navigate = useNavigate();
  const mainContext: MainContextProps = useContext(MainContext);
  const { setNotification } = useNotification()
  const { alertElement, info, error, clear: clearAlert } = useAlert()

  useEffect(() => {
    clearAlert()
  }, []);

  const loginUser = useCallback((user: CurrentUser) => {
    setNotification({
      ...useNotificationDefaults,
      message: "Logado com sucesso!",
      severity:'success',
    })
    mainContext.setCurrentUser?.(user)
    navigate("/");
  }, []);
  const registeredSuccess = useCallback(() => {
    setNotification({
      ...useNotificationDefaults,
      message: "Registrado com sucesso!",
      severity:'success',
    })
  }, []);
  const passwordResetSuccess = useCallback(() => {
    setNotification({
      ...useNotificationDefaults,
      message: "Senha alterada com sucesso!",
      severity:'success',
    })
  }, []);

  return(
    <div className="flex flex-col gap-y-4 w-1/2 mx-auto mt-0 justify-center items-center">
      <img src={ logo } alt="logo" className="w-96" />    
      <div className='w-full'>
        { alertElement }
      </div>
      {
        {
          [AuthPageMode.LOGIN]:
            <LogInLayout onError={ error } onSuccess={ loginUser } onStateChanged={ info } />,
          [AuthPageMode.REGISTER]:
            <SignInLayout onError={ error } onSuccess={ registeredSuccess } onStateChanged={ info } />,
          [AuthPageMode.RESET_PASSWORD]:
            <PasswordResetLayout onError={ error } onSuccess={ passwordResetSuccess } onStateChanged={ info } />,
        }[props.mode]
      }
    </div>
  );
}