import { createContext, Context, PropsWithChildren, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import CurrentUser from '../../../models/User'

export type MainContextProps = {
  currentUser?: CurrentUser
  setCurrentUser?: ((user: CurrentUser | undefined) => void)
};
const defaultMainProps: MainContextProps = {
  currentUser: undefined,
  setCurrentUser: undefined,
};
export const MainContext: Context<MainContextProps> = 
  createContext<MainContextProps>(defaultMainProps);

export default function MainContextProvider({ children }: PropsWithChildren) {  
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | undefined>(undefined);
  
  useEffect(() => {
    updateCurrentUserAndCookie(getUserFromCookieOrNull())
  }, [])

  function updateCurrentUserAndCookie(newUser: CurrentUser | undefined | null) {
    if (newUser) { 
      setCurrentUser(newUser);
      createUserCookie(newUser)
    } else {
      setCurrentUser(undefined);
      dropUserCookie();
    }
  }
  
  defaultMainProps.setCurrentUser = updateCurrentUserAndCookie
  defaultMainProps.currentUser = currentUser

  return (
    <MainContext.Provider value={ defaultMainProps }>
      { children }
    </MainContext.Provider>
  )
}

function createUserCookie(user: CurrentUser) {
  const cookie = Cookies.withAttributes({ 
    path: '',
    expires: 0.04, // 4% of a day aka 15min
  }) 
  cookie.set('token', user.token!) 
  cookie.set('userName', user.userName!)
  cookie.set('email', user.email!)
  cookie.set('isAdmin', String(user.isAdmin!))
}
function getUserFromCookieOrNull(): CurrentUser | null {
  const token: string | undefined = Cookies.get('token')
  const userName: string | undefined = Cookies.get('userName')
  const email: string | undefined = Cookies.get('email')
  const isAdmin: string | undefined = Cookies.get('isAdmin')
  if (token && userName && email && isAdmin !== undefined) {
    return new CurrentUser(userName, email, '', token, (isAdmin === 'true'))
  }
  return null
}
function dropUserCookie() {
  Cookies.remove('token', { path: '' }) 
  Cookies.remove('userName', { path: '' })
  Cookies.remove('email', { path: '' })
  Cookies.remove('isAdmin', { path: '' })  
}