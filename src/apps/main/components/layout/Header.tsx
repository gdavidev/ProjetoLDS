import { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "@shared/components/formComponents/SearchBar";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CurrentUser from "@models/CurrentUser";
import { IonIcon } from "@ionic/react";
import { caretDown, person } from "ionicons/icons";
import logo from '/icons/logo.png';
import useCurrentUser from "@/hooks/useCurrentUser";
import { Button } from "@mui/material";

export default function Header() {
  const downloadLink: string = 'https://github.com/Denis-Saavedra/EmuHub-Desktop/raw/refs/heads/main/Instalador/Win32/Debug/EmuHubInstaller.exe'
  const { user, setUser } = useCurrentUser();

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between items-center px-6 py-1.5 bg-layout-backgroud">
        <Link to="/" className="flex items-center gap-x-3 select-none
            hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src={ logo } className="w-40 h-12 sm:visible invisible" alt="logo" />
        </Link>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">          
          <a href={ downloadLink } className="btn-r-full bg-white hover:bg-slate-300 text-primary">
             Download App
          </a>
          { 
            user && user.isAuth() ?
              <LoggedUserDropdown user={ user } logoutFn={ () => setUser(undefined) } /> :
              <LoginSigninButtons />
          }
        </div>
      </div>
      <Navbar />    
    </header>
  );
}

function LoggedUserDropdown(props: { user: CurrentUser, logoutFn: () => void }) {  
  const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>(false);
  
  return (
    <div>
      <Button variant="contained" size="large"
          startIcon={ <IonIcon icon={ person } /> }
          endIcon={ <IonIcon icon={ caretDown } /> }
          onClick={ () => setIsMenuOpen(open => !open) }>
        { props.user.userName }
      </Button>
      <Menu open={ isMenuOpen }>
        <MenuItem sx={{padding: '0'}}>
          <Link to="/profile" className="w-full h-full px-8 text-center">Perfil</Link>
        </MenuItem>
        {
          // TODO add way to set an admin in the backend
          true ?
            <MenuItem sx={{padding: '0'}}>
              <Link to="/admin/view-games" className="w-full h-full px-8 text-center">Admin</Link>
            </MenuItem> :
            ""
        }
        <MenuItem sx={{padding: '0'}}>
          <Link to="/log-in" onClick={ props.logoutFn } className="w-full h-full px-8 text-center">
            Sair
          </Link>        
        </MenuItem>            
      </Menu>
    </div>
  )
}

function LoginSigninButtons() {
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