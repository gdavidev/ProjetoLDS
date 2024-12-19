import { createContext, PropsWithChildren, useCallback, useLayoutEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CurrentUser from '@models/CurrentUser';
import type { Config } from 'tailwindcss';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@tailwind-config';
import { Role } from '@/hooks/usePermission.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';

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
export const MainContext =
    createContext<MainContextProps>(defaultMainContextProps);

type UserCookie = {
  id: number
  token: string,
  userName: string,
  email: string,
  isAdmin: string,
}

export default function MainContextProvider({ children }: PropsWithChildren) {
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | null>(null);

  useLayoutEffect(() => {
    if (!currentUser)
      updateCurrentUserAndCookie(getUserFromStorageOrNull())
  }, [currentUser]);

  const updateCurrentUserAndCookie = useCallback((newUser: CurrentUser | null) => {
    if (newUser) {
      setCurrentUser(newUser);
      saveCurrentUserToStorage(newUser);
    } else {
      setCurrentUser(null);
      dropStoredCurrentUser();
    }
  }, []);

  const getCurrentUser = useCallback(() => {
    return currentUser ?? getUserFromStorageOrNull()
  }, []);

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

function saveCurrentUserToStorage(user: CurrentUser) {
  const userCookieObject: UserCookie = {
    id: user.id,
    token: user.token,
    userName: user.userName,
    email: user.email,
    isAdmin: String(user.role === Role.ADMIN),
  };
  Cookies.set('user', JSON.stringify(userCookieObject));

  user.profilePic.getBase64()
      .then((image: string | null) => {
        if (image) localStorage.setItem('userProfilePic', image);
      })
}

function getUserFromStorageOrNull(): CurrentUser | null {
  const userCookieContent: string | undefined = Cookies.get('user')
  if (userCookieContent === undefined) 
    return null

  const userCookieObject: UserCookie = JSON.parse(userCookieContent)
  const userProfilePicBase64: string | null = localStorage.getItem('userProfilePic')

  return new CurrentUser(
      userCookieObject.id,
      userCookieObject.userName,
      userCookieObject.token,
      userCookieObject.email,
      (userCookieObject.isAdmin === 'true' ? Role.ADMIN : Role.USER),
      userProfilePicBase64 ?
          new Thumbnail({ base64: userProfilePicBase64 }) :
          undefined
  );
}

function dropStoredCurrentUser() {
  Cookies.remove('user')
  localStorage.removeItem('userProfilePic')
}