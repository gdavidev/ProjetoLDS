import { Alert } from "@mui/material";
import { useCallback, useState } from 'react';

type UseAlertResult = {
  alertElement: JSX.Element | undefined
  success: (message: string) => void,
  error: (message: string) => void,
  warning: (message: string) => void,
  info: (message: string) => void,
  clear: () => void,
}

export default function useAlert(): UseAlertResult {
  const [ alertElement, setAlertElement ] = useState<JSX.Element | undefined>(undefined);

  const success = useCallback((message: string): void => {
    setAlertElement(<Alert severity='success'>{message}</Alert>);
  }, []);
  const error = useCallback((message: string) => {
    setAlertElement(<Alert severity='error'>{message}</Alert>);
  }, [])
  const warning = useCallback((message: string) => {
    setAlertElement(<Alert severity='warning'>{message}</Alert>);
  }, [])
  const info = useCallback((message: string) => {
    setAlertElement(<Alert severity='info'>{message}</Alert>);
  }, [])
  const clear = useCallback(() => {
    setAlertElement(undefined);
  }, [])

  return ({
    alertElement: alertElement,
    success: success,
    error: error,
    warning: warning,
    info: info,
    clear: clear,
  })
}