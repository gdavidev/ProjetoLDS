import { createContext, Context, PropsWithChildren } from 'react'
import User from './models/User'

export type MainProps = {
  currentUser: User
}
const defaultMainProps: MainProps = {
  currentUser: new User()
}

export const MainContext: Context<MainProps> = createContext<MainProps>(defaultMainProps);

export default function MainContextProvider({ children }: PropsWithChildren) {
  return (
    <MainContext.Provider value={ defaultMainProps }>
      { children }
    </MainContext.Provider>
  )
}