import React, { PropsWithoutRef, useContext, useCallback, useEffect } from 'react';
import SignUpLayout from "@apps/main/pages/auth/SignUpLayout.tsx";
import LogInLayout from "@/apps/main/pages/auth/LogInLayout";
import logo from '/icons/logo.png'
import CurrentUser from "@/models/CurrentUser";
import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import { useLocation, useNavigate } from 'react-router-dom';
import PasswordResetLayout from "./PasswordResetLayout";
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useNotification from '@/hooks/feedback/useNotification.tsx';

export enum AuthPageMode {
  LOGIN,
  SIGNUP,
  RESET_PASSWORD,
}
export type AuthPageProps = {
  mode: AuthPageMode
}

export default function AuthPage(props: PropsWithoutRef<AuthPageProps>): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const mainContext: MainContextProps = useContext(MainContext);
  const { notifySuccess } = useNotification()
  const { alertElement, info, error, clear: clearAlert } = useAlert()

  useEffect(() => {
    clearAlert()
  }, [location.pathname]);

  const loginSuccess = useCallback((user: CurrentUser) => {
    notifySuccess("Logado com sucesso!")
    mainContext.setCurrentUser?.(user)
    if (location.state && location.state.from)
      return navigate(location.state.from, { replace: true });
    navigate("/");
  }, []);
  const registeredSuccess = useCallback(() => {
    clearAlert();
    notifySuccess("Registrado com sucesso! Você pode fazer seu login agora.");
    navigate("/log-in");
  }, []);
  const passwordResetSuccess = useCallback(() => {
    clearAlert();
    notifySuccess("Senha alterada com sucesso! Você pode fazer seu login agora.");
    navigate("/log-in");
  }, []);

  return(
    <div className="flex flex-col gap-y-4 xl:w-1/2 md:w-3/4 w-5/6 max-w-[120ch] mx-auto mt-0 justify-center items-center">
      <img src={ logo } alt="logo" className="w-96" />    
      <div className='w-full'>
        { alertElement }
      </div>
      {
        {
          [AuthPageMode.LOGIN]:
            <LogInLayout onError={ error } onSuccess={ loginSuccess } onStateChanged={ info } />,
          [AuthPageMode.SIGNUP]:
            <SignUpLayout onError={ error } onSuccess={ registeredSuccess } onStateChanged={ info } />,
          [AuthPageMode.RESET_PASSWORD]:
            <PasswordResetLayout onError={ error } onSuccess={ passwordResetSuccess } onStateChanged={ info } />,
        }[props.mode]
      }
    </div>
  );
}