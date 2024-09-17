import React, { useState, PropsWithoutRef } from "react";
import { Alert, ColorPaletteProp } from "@mui/joy";
import SignInLayout from "@apps/main/pages/authentication/SignInLayout";
import LogInLayout from "@apps/main/pages/authentication/LogInLayout";
import logo from '/icons/logo.png'

export enum AlertFeedbackType { ERROR, SUCCESS, PROGRESS, HIDDEN }
export type AlertFeedbackData = {
  message?: string,
  type: AlertFeedbackType,
}

export enum AuthPageMode {
  LOGIN,
  REGISTER,
}

export type AuthPageProps = {
  mode: AuthPageMode
}

export default function AuthPage(props: PropsWithoutRef<AuthPageProps>): React.ReactElement {
  const [ alertFeedbackData, setAlertFeedbackData ] = useState<AlertFeedbackData>({
    message: '',
    type: AlertFeedbackType.HIDDEN
  });

  return(
    <div className="flex flex-col gap-y-4 w-1/2 mx-auto mt-0 justify-center items-center">
      <img src={ logo } alt="logo" className="w-96" />    
      { 
        alertFeedbackData.type !== AlertFeedbackType.HIDDEN ?
          getAlert(alertFeedbackData) :
          <></>
      }
      {
        props.mode === AuthPageMode.LOGIN ?
          <LogInLayout onStateUpdate={ setAlertFeedbackData } /> :
          <SignInLayout onStateUpdate={ setAlertFeedbackData } /> 
      }
    </div>
  );
}

function getAlert(alertFeedbackData: AlertFeedbackData): React.ReactElement {
  let style: ColorPaletteProp;
  switch (alertFeedbackData.type) {
    case AlertFeedbackType.ERROR:     style = 'danger' ;  break;
    case AlertFeedbackType.SUCCESS:   style = 'success';  break;
    case AlertFeedbackType.PROGRESS:  style = 'warning';  break;
    default: style = 'neutral'; break;
  }

  return (
    <Alert color={ style } sx={{width: '100%'}} >
      { alertFeedbackData.message }
    </Alert>
  )
}