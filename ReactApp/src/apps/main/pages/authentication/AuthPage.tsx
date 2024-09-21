import React, { useState, PropsWithoutRef, useContext } from "react";
import { Alert, ColorPaletteProp } from "@mui/joy";
import SignInLayout from "@apps/main/pages/authentication/SignInLayout";
import LogInLayout from "@apps/main/pages/authentication/LogInLayout";
import logo from '/icons/logo.png'
import CurrentUser from "@/models/User";
import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";

export enum AlertType { ERROR, SUCCESS, PROGRESS, HIDDEN }
export type AlertInfo = {
  message?: string,
  type: AlertType,
}

export enum AuthPageMode {
  LOGIN,
  REGISTER,
}
export type AuthPageProps = {
  mode: AuthPageMode
}

export default function AuthPage(props: PropsWithoutRef<AuthPageProps>): React.ReactElement {
  const mainContext: MainContextProps = useContext(MainContext)
  const [ alertInfo, setAlertInfo ] = useState<AlertInfo>({
    message: '',
    type: AlertType.HIDDEN
  });

  const loginUser = (user: CurrentUser) => {
    setAlertInfo({ message: "Logado com sucesso!", type: AlertType.SUCCESS })
    mainContext.setCurrentUser?.(user)
    setTimeout(() => { window.location.replace("/") }, 500);
  }
  const registeredSuccess = () => {
    setAlertInfo({ message: "Registrado com sucesso!", type: AlertType.SUCCESS});
  }  

  return(
    <div className="flex flex-col gap-y-4 w-1/2 mx-auto mt-0 justify-center items-center">
      <img src={ logo } alt="logo" className="w-96" />    
      { 
        alertInfo.type !== AlertType.HIDDEN ?
          getAlert(alertInfo) :
          <></>
      }
      {
        props.mode === AuthPageMode.LOGIN ?
          <LogInLayout onError={ setAlertInfo } onSuccess={ loginUser } /> :
          <SignInLayout onError={ setAlertInfo } onSuccess={ registeredSuccess } />
      }
    </div>
  );
}

function getAlert(alertFeedbackData: AlertInfo): React.ReactElement {
  let style: ColorPaletteProp;
  switch (alertFeedbackData.type) {
    case AlertType.ERROR:     style = 'danger' ;  break;
    case AlertType.SUCCESS:   style = 'success';  break;
    case AlertType.PROGRESS:  style = 'warning';  break;
    default: style = 'neutral'; break;
  }

  return (
    <Alert color={ style } sx={{width: '100%'}} >
      { alertFeedbackData.message }
    </Alert>
  )
}