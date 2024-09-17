import { useContext, useEffect, useState } from "react";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import SearchBar from "../../../shared/components/formComponents/SearchBar";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { MainContext, MainContextProps } from "../../../shared/context/MainContextProvider";
import CurrentUser from "../../../../models/User";
import { IonIcon } from "@ionic/react";
import { caretDown, person } from "ionicons/icons";
import logo from '/icons/logo.png'

export default function Header() {
  const mainContext: MainContextProps = useContext(MainContext)
  const [ currentUser, setCurrentUser ] = useState<CurrentUser | undefined>(undefined);

  useEffect(() => {
    if (mainContext.currentUser)
      setCurrentUser(mainContext.currentUser)
    mainContext.onUserAuth.subscribe(setCurrentUser)
  }, []);

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between items-center px-6 py-1.5 bg-layout-backgroud">
        <Link to="/" className="flex items-center gap-x-3 select-none
            hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src={ logo } className="w-40 h-12 sm:visible invisible" alt="logo" />
        </Link>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"
             className="btn-r-full bg-white hover:bg-slate-300 text-primary">Download App</a>
          { 
            currentUser && currentUser.isAuth() ?
              <LoggedUserDropdown user={ currentUser } /> :
              <LoginSigninButtonContainer />
          }
        </div>
      </div>
      <Navbar />    
    </header>
  );
}

const LoggedUserDropdown = (props: { user: CurrentUser }) => {
  const mainContext: MainContextProps = useContext(MainContext)  
  const logout = () => {
    mainContext.setCurrentUser?.(undefined)
  }
  
  return (
    <Dropdown>
      <MenuButton variant="solid" size="lg"
          startDecorator={ <IonIcon icon={ person } /> }
          endDecorator={ <IonIcon icon={ caretDown } /> }>
        { props.user.userName }
      </MenuButton>
      <Menu size="lg" sx={{border: 'none'}}>
        {
          // TODO add way to set an admin in the backend
          true ? //props.user.isAdmin !== undefined && props.user.isAdmin ?
            <MenuItem sx={{padding: '0'}}>
              <Link to="/admin/view-games" className="w-full h-full px-8 text-center">Admin</Link>
            </MenuItem> :
            ""
        }
        <MenuItem sx={{padding: '0'}}>
          <Link to="/log-in" onClick={ logout } className="w-full h-full px-8 text-center">
            Sair
          </Link>        
        </MenuItem>            
      </Menu>
    </Dropdown>
  )
}

const LoginSigninButtonContainer = () => {
  const currentPath: string = useLocation().pathname
  const pathToLogin: string = "/log-in"
  const pathToSignin: string = "/sign-in"

  return(
    <>
      <Link to={ pathToLogin } aria-label="login-button" role="link"
          className={ "btn-r-md bg-primary-light hover:bg-primary-lighter " +
            (currentPath === pathToLogin ? "text-white" : "text-primary") }>
        Login
      </Link>
      <Link to={ pathToSignin } aria-label="signin-button" role="link"
          className={ "btn-r-md bg-primary-light hover:bg-primary-lighter " + 
            (currentPath === pathToSignin ? "text-white" : "text-primary") }>
        Sign-in
      </Link>
    </>
  )
}