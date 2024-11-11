import UserApiClient from '@/api/UserApiClient';
import { UserForgotPasswordDTO, UserLoginDTO, UserRegisterDTO, UserResetPasswordDTO, UserUpdateDTO } from '@models/data/UserDTOs';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

type UseAuthEvents = {
  onSuccess: (data: any, variables: any) => void
  onError: (err: AxiosError | Error) => void
}
type UseAuthOptionsEvents = {
  onIsLoading?: () => void,
} & UseAuthEvents

type UseAuthOptions = {
  onLogin?: UseAuthEvents
  onRegister?: UseAuthEvents
  onForgotPassword?: UseAuthEvents
  onPasswordReset?: UseAuthEvents
  onUpdate?: UseAuthEvents
  onIsLoading?: () => void
}
type UseAuthResult = {
  login: (data: UserLoginDTO) => void
  register: (data: UserRegisterDTO) => void
  forgotPassword: (data: UserForgotPasswordDTO) => void
  passwordReset: (data: UserResetPasswordDTO & {token: string}) => void
  update: (data: UserUpdateDTO & {token: string}) => void
  reset: () => void
  isLoading: boolean
}

export default function useAuth(options?: UseAuthOptions | UseAuthOptionsEvents): UseAuthResult {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const mutationFn: UseAuthOptionsEvents | undefined = isUseAuthOptionsEvents(options) ? {
    onSuccess: (data: any, dto: any) => options?.onSuccess?.(data, dto),      
    onError: (err: AxiosError | Error) => options?.onError?.(err)
  } : undefined;

  const loginMutation = useMutation('LOGIN_USER',
    async (dto: UserLoginDTO) => {
      const userApiClient: UserApiClient = new UserApiClient();
      return userApiClient.login(dto);
    }, 
    mutationFn ?? (options as UseAuthOptions)?.onLogin
  );

  const forgotPasswordMutation = useMutation('FORGOT_PASS',
    async (data: {email: string}) => {
      const userApiClient = new UserApiClient()
      return userApiClient.forgotPassword(data)
    }, 
    mutationFn ?? (options as UseAuthOptions)?.onForgotPassword
  );

  const registerMutation = useMutation('REGISTER_USER',
    async (dto: UserRegisterDTO) => {
      const userApiClient: UserApiClient = new UserApiClient();
      return userApiClient.register(dto);
    },
    mutationFn ?? (options as UseAuthOptions)?.onRegister   
  );

  const passwordResetMutation = useMutation('RESET_USER_PASSWORD',
    async (dto: UserResetPasswordDTO & {token: string}) => {
      const userApiClient: UserApiClient = new UserApiClient()
      return userApiClient.resetPassword(dto, dto.token);      
    }, 
    mutationFn ?? (options as UseAuthOptions)?.onPasswordReset
  );

  const updateUserMutation = useMutation('UPDATE_USER', 
    async (dto: UserUpdateDTO & { token: string }) => {
      const userApiClient: UserApiClient = new UserApiClient();
      return userApiClient.update(dto, dto.token!)
    }, 
    mutationFn ?? (options as UseAuthOptions)?.onPasswordReset
  );

  useEffect(() => {
    const newState: boolean = (
      loginMutation.isLoading ||
      forgotPasswordMutation.isLoading ||
      registerMutation.isLoading ||
      passwordResetMutation.isLoading ||
      updateUserMutation.isLoading
    );
    setIsLoading(newState);
    if (newState)
      options?.onIsLoading?.()
  }, [loginMutation.isLoading, forgotPasswordMutation.isLoading, registerMutation.isLoading, passwordResetMutation.isLoading]);

  const reset = (): void => {
    loginMutation.reset()
    forgotPasswordMutation.reset()
    registerMutation.reset()
    passwordResetMutation.reset()
    updateUserMutation.reset()
  }

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    passwordReset: passwordResetMutation.mutate,
    update: updateUserMutation.mutate,
    reset: reset,
    isLoading: isLoading
  }
}

// Type guard to check if an object implements IUseAuthEvents
const isUseAuthOptionsEvents = (obj: any): obj is UseAuthEvents => (
  obj &&
  typeof obj.onIsLoading === 'function' &&
  typeof obj.onSuccess === 'function' &&
  typeof obj.onError === 'function'
);