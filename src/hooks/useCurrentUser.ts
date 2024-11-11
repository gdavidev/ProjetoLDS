import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import CurrentUser from "@/models/User";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

type UseCurrentUserResult = {
  user: CurrentUser | undefined,
  setUser: (user: CurrentUser) => void
}

export default function useCurrentUser(): UseCurrentUserResult {
  const mainContext: MainContextProps = useContext(MainContext);
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | undefined>()

  useLayoutEffect(() => {
    mainContext.onUserAuth.subscribe(setCurrentUser);
  }, []);
  useEffect(() => {
    setCurrentUser(mainContext.currentUser);
    return mainContext.onUserAuth.remove(setCurrentUser) // Cleanup code
  }, []);

  return {
    user: currentUser,
    setUser: mainContext.setCurrentUser!
  };
}