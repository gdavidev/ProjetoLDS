import { createContext, Context, PropsWithChildren, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import CurrentUser from '../../../models/User'
import EventHandler from '../../../libs/EventHandler';

export type MainContextProps = {
  currentUser?: CurrentUser
  setCurrentUser?: ((user: CurrentUser | undefined) => void),
  onUserAuth: EventHandler<CurrentUser | undefined>
};
const mainProps: MainContextProps = {
  currentUser: undefined,
  setCurrentUser: undefined,
  onUserAuth: new EventHandler<CurrentUser | undefined>(),
};
export const MainContext: Context<MainContextProps> = 
  createContext<MainContextProps>(mainProps);

type UserCookie = {
  token: string,
  userName: string,
  email: string,
  isAdmin: string,
}

export default function MainContextProvider({ children }: PropsWithChildren) {  
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | undefined>(undefined);

  useEffect(() => {
    if (currentUser === undefined)
      updateCurrentUserAndCookie(getUserFromCookieOrNull())
  }, [])

  function updateCurrentUserAndCookie(newUser: CurrentUser | undefined | null) {
    if (newUser) { 
      setCurrentUser(newUser);
      createUserCookie(newUser);
      mainProps.onUserAuth.trigger(newUser);  
    } else {
      setCurrentUser(undefined);
      dropUserCookie();
      mainProps.onUserAuth.trigger(undefined);
    }
  }
  
  mainProps.setCurrentUser = updateCurrentUserAndCookie
  mainProps.currentUser = currentUser

  return (
    <MainContext.Provider value={ mainProps }>
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
  if (userCookieContent === undefined) return null

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