import { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CurrentUser from "@models/CurrentUser";
import { IonIcon } from "@ionic/react";
import { caretDown, caretUp } from "ionicons/icons";
import logo from '/icons/logo.png';
import useCurrentUser from "@/hooks/useCurrentUser";
import { Button } from "@mui/material";
import useTailwindTheme from "@/hooks/configuration/useTailwindTheme";
import { Role } from '@/hooks/usePermission.ts';

export default function Header() {
  const downloadLink: string = 'https://github.com/Denis-Saavedra/EmuHub-Desktop/raw/refs/heads/main/Instalador/Win32/Debug/EmuHubInstaller.exe'
  const { user, logout } = useCurrentUser();

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between items-center px-6 py-1.5 bg-layout-background">
        <Link to="/" className="flex items-center gap-x-3 select-none
            hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src={ logo } className="w-40 h-12 sm:visible invisible" alt="logo" />
        </Link>
        <div className="flex items-center gap-x-2">
          <a href={ downloadLink } className="btn-r-full bg-white hover:bg-slate-300 text-primary">
             Download App
          </a>
          { 
            user && user.token !== '' ?
              <LoggedUserDropdown user={ user } logoutFn={ logout } /> :
              <LoginSignupButtons />
          }
        </div>
      </div>
      <Navbar />    
    </header>
  );
}

function LoggedUserDropdown(props: { user: CurrentUser, logoutFn: () => void }) {
  const { colors } = useTailwindTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
      <Button 
        variant="contained" 
        size="large"
        startIcon={
          <div className='w-8 h-8 overflow-hidden rounded-full'>
            <img
                className='object-cover h-full'
                alt='profile-img'
                src={ props.user.profilePic.toDisplayable() } />
          </div>
        }
        endIcon={ <IonIcon icon={ open ? caretUp : caretDown } /> }
        onClick={ handleClick }
        sx={{ 
          backgroundColor: colors['primary'],
          px: '2rem',
          py: '0.5rem'
        }}
      >
        { props.user.userName }
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}        
      >
        <MenuItem onClick={ handleClose }>
          <Link to="/profile" className="w-full h-full px-8 text-center">Perfil</Link>
        </MenuItem>
        {
          props.user.role === Role.ADMIN &&
            <MenuItem onClick={ handleClose }>
              <Link to="/admin/view-games" className="w-full h-full px-8 text-center">Admin</Link>
            </MenuItem>
        }
        <MenuItem onClick={ handleClose }>
          <Link 
            to="/log-in" 
            onClick={ props.logoutFn } 
            className="w-full h-full px-8 text-center"
          >
            Sair
          </Link>        
        </MenuItem>            
      </Menu>
    </div>
  )
}

function LoginSignupButtons() {
  const currentPath: string = useLocation().pathname
  const pathToLogin: string = "/log-in"
  const pathToSignup: string = "/sign-up"

  return(
    <>
      <Link to={ pathToLogin } aria-label="login-button" role="link"
          className={ "btn-r-md bg-primary-light hover:bg-primary-lighter " +
            (currentPath === pathToLogin ? "text-white" : "text-primary-dark") }>
        Entrar
      </Link>
      <Link to={ pathToSignup } aria-label="signup-button" role="link"
          className={ "btn-r-md bg-primary-light hover:bg-primary-lighter " + 
            (currentPath === pathToSignup ? "text-white" : "text-primary-dark") }>
        Registar-se
      </Link>
    </>
  )
}