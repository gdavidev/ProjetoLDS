import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import CurrentUser from "@models/CurrentUser";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

type UseCurrentUserOptions = {
  targetUrlWhenNotAuth?: string
}
type UseCurrentUserResult = {
  user: CurrentUser | null,
  setUser: (user: CurrentUser | null) => void
}

export default function useCurrentUser(options?: UseCurrentUserOptions): UseCurrentUserResult {
  const mainContext: MainContextProps = useContext(MainContext);

  if (!mainContext)
    throw new Error('useCurrentUser must be used within an MainContextProvider');

  const navigate = useNavigate()
  if (mainContext.getCurrentUser() === null) {
    navigate(options?.targetUrlWhenNotAuth ?? '/login');
  }

  return {
    user: mainContext.getCurrentUser(),
    setUser: mainContext.setCurrentUser
  };
}