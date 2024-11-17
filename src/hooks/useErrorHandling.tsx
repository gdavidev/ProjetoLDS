import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

type UseErrorHandlingOptions = {
  onError?: (message: string) => void,
  handler: (...params: any) => string | undefined  
}
type UseErrorHandlingResult = {
  alertElement: React.ReactElement | undefined
}

export default function useErrorHandling(options: UseErrorHandlingOptions, deps?: any[]): UseErrorHandlingResult {
  const [ alertElement, setAlertElement ] = useState<React.ReactElement | undefined>(undefined);
  
  useEffect(() => {
    const result = options.handler();
    if (result !== '' && result !== undefined) {
      options.onError?.(result);
      setAlertElement(<Alert color="danger">{result}</Alert>)
    }
  }, deps);

  return ({
    alertElement: alertElement
  })
}