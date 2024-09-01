import React, { createContext, Context, useState } from "react";
import { Alert, ColorPaletteProp } from "@mui/joy";
import { useLocation } from "react-router-dom";
import SignInLayout from "./SignInLayout";
import LogInLayout from "./LogInLayout";

export enum AlertFeedbackType { ERROR, SUCCESS, PROGRESS, HIDDEN }
export type AlertFeedbackData = {
  message: string,
  type: AlertFeedbackType,
}

export type AuthContextProps = {
  setAlertFeedbackData: ((data: AlertFeedbackData) => void ) | undefined
}
const defaultAuthContextProps: AuthContextProps = {
  setAlertFeedbackData: undefined
}
export const AuthContext: Context<AuthContextProps> = 
  createContext<AuthContextProps>(defaultAuthContextProps);

export default function AuthPage(): React.ReactElement {
  const isLoginState = useLocation().pathname === '/log-in' ? true : false;
  const [ alertFeedbackData, setAlertFeedbackData ] = useState<AlertFeedbackData>({
    message: '',
    type: AlertFeedbackType.HIDDEN
  });
  defaultAuthContextProps.setAlertFeedbackData = setAlertFeedbackData

  return(
    <AuthContext.Provider value={ defaultAuthContextProps }>
      <div className="flex flex-col gap-y-4 w-1/2 mx-auto">      
        { 
          alertFeedbackData.type !== AlertFeedbackType.HIDDEN ?
            getAlert(alertFeedbackData) :
            <></>
        }
        {
          isLoginState ?
            <LogInLayout /> :
            <SignInLayout /> 
        }
      </div>
    </AuthContext.Provider>
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
    <Alert color={ style } >
      { alertFeedbackData.message }
    </Alert>
  )
}