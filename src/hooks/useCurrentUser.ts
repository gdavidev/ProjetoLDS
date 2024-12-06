import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import CurrentUser from "@models/CurrentUser";
import { useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom";

type UseCurrentUserOptions = {
  targetUrlWhenNotAuth?: string
}
type UseCurrentUserResult = {
  user: CurrentUser | null,
  setUser: (user: CurrentUser) => void
  logout: () => void
}

export default function useCurrentUser(options?: UseCurrentUserOptions): UseCurrentUserResult {
  const mainContext: MainContextProps = useContext(MainContext);
  const navigate = useNavigate()

  if (!mainContext)
    throw new Error('useCurrentUser must be used within an MainContextProvider');

  if (options && options.targetUrlWhenNotAuth && mainContext.getCurrentUser() === null) {
    navigate(options?.targetUrlWhenNotAuth);
  }

  const logout = useCallback(() => {
    if (mainContext.getCurrentUser() !== null) {
      mainContext.setCurrentUser(null);
    }
  }, [])

  return {
    user: mainContext.getCurrentUser(),
    setUser: mainContext.setCurrentUser,
    logout: logout
  };
}