import { createContext, PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CurrentUser from '@models/CurrentUser';
import type { Config } from 'tailwindcss';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@tailwind-config';
import Notification, { NotificationProps } from '@shared/components/Notification.tsx';
import { Role } from '@/hooks/usePermission.ts';

export type MainContextProps = {
  getCurrentUser: () => CurrentUser | null,
  setCurrentUser: (user: CurrentUser | null) => void,
  setNotificationProps: (snackbarProps: NotificationProps) => void,
  tailwindConfig: Config & typeof tailwindConfig,
};
const defaultMainContextProps: MainContextProps = {
  getCurrentUser: () => null,
  setCurrentUser: () => null,
  setNotificationProps: () => null,
  tailwindConfig: resolveConfig<typeof tailwindConfig>(tailwindConfig)
};
export const MainContext = createContext<MainContextProps>(defaultMainContextProps);

type UserCookie = {
  token: string,
  userName: string,
  email: string,
  isAdmin: string,
}

export default function MainContextProvider({ children }: PropsWithChildren) {
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | null>(null);
  const [ notificationProps, setNotificationProps ] = useState<NotificationProps | null>(null);
  const [ notificationBarOpen, setNotificationBarOpen ] = useState<boolean>(false);

  useEffect(() => {
    if (notificationProps)
      setNotificationBarOpen(true)
  }, [notificationProps]);

  useLayoutEffect(() => {
    updateCurrentUserAndCookie(getUserFromCookieOrNull())
  }, []);

  function updateCurrentUserAndCookie(newUser: CurrentUser | null) {
    if (newUser) { 
      setCurrentUser(newUser);
      createUserCookie(newUser);
    } else {
      setCurrentUser(null);
      dropUserCookie();
    }
  }
  function getCurrentUser() {
    return currentUser ?? getUserFromCookieOrNull()
  }

  return (
    <MainContext.Provider 
      value={{
        getCurrentUser: getCurrentUser,
        setCurrentUser: updateCurrentUserAndCookie,
        setNotificationProps: setNotificationProps,
        tailwindConfig: defaultMainContextProps.tailwindConfig
      }}>
      { children }
      {
        notificationProps &&
          <Notification
            {...notificationProps}
            open={ notificationBarOpen }
            onClose={ () => setNotificationBarOpen(false) }
          /> }
    </MainContext.Provider>
  )
}

function createUserCookie(user: CurrentUser) {
  const userCookieObject: UserCookie = {
    token: user.token,
    userName: user.userName,
    email: user.email,
    isAdmin: String(user.role === Role.ADMIN),
  }
  Cookies.set('user', JSON.stringify(userCookieObject))
}
function getUserFromCookieOrNull(): CurrentUser | null {
  const userCookieContent: string | undefined = Cookies.get('user')
  if (userCookieContent === undefined) 
    return null

  const userCookieObject: UserCookie = JSON.parse(userCookieContent)
  const token: string = userCookieObject.token
  const userName: string = userCookieObject.userName
  const email: string = userCookieObject.email
  const isAdmin: string = userCookieObject.isAdmin

  return new CurrentUser(userName, token, email, (isAdmin === 'true' ? Role.ADMIN : Role.USER))
}
function dropUserCookie() {
  Cookies.remove('user') 
}