import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import CurrentUser from "@models/CurrentUser";
import { useCallback, useContext } from 'react';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { Link, useNavigate } from 'react-router-dom';

type UseCurrentUserResult = {
  user: CurrentUser | null,
  setUser: (user: CurrentUser) => void
  logout: () => void,
  askToLogin: (message: string) => void,
  forceLogin: (message: string) => void,
}

export default function useCurrentUser(): UseCurrentUserResult {
  const navigate = useNavigate();
  const mainContext: MainContextProps = useContext(MainContext);
  const { notifyWarning } = useNotification();

  if (!mainContext)
    throw new Error('useCurrentUser must be used within an MainContextProvider');

  const logout = useCallback(() => {
    if (mainContext.getCurrentUser() !== null) {
      mainContext.setCurrentUser(null);
    }
  }, [])

  const askToLogin = useCallback((message: string) => {
    notifyWarning(
      <span>
          { message }
          <Link to='/log-in' className='underline cursor-pointer ms-1'>Entrar</Link>
      </span>
    )
  }, []);

  const forceLogin = useCallback((message?: string) => {
    logout();
    notifyWarning(message ?? "Por favor faça login novamente");
    navigate('/log-in', { replace: true, state: { from: window.location.pathname } });
  }, []);

  return {
    user: mainContext.getCurrentUser(),
    setUser: mainContext.setCurrentUser,
    logout: logout,
    askToLogin: askToLogin,
    forceLogin: forceLogin
  };
}