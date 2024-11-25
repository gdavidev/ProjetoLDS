import { createContext, PropsWithChildren, useState, useLayoutEffect } from 'react'
import Cookies from 'js-cookie'
import CurrentUser from '@models/CurrentUser'
import type { Config } from 'tailwindcss'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@tailwind-config'

export type MainContextProps = {
  getCurrentUser: () => CurrentUser | null,
  setCurrentUser: (user: CurrentUser | null) => void,
  tailwindConfig: Config & typeof tailwindConfig,
};
const defaultMainContextProps: MainContextProps = {
  getCurrentUser: () => null,
  setCurrentUser: () => null,
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
          tailwindConfig: defaultMainContextProps.tailwindConfig
        }}>
      { children }
    </MainContext.Provider>
  )
}

function createUserCookie(user: CurrentUser) {
  const userCookieObject: UserCookie = {
    token: user.token!,
    userName: user.userName!,
    email: user.email!,
    isAdmin: String(user.isAdmin!),
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

  return new CurrentUser(userName, email, '', token, (isAdmin === 'true'))
}
function dropUserCookie() {
  Cookies.remove('user') 
}