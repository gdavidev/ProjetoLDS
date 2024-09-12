import { useContext, useEffect, useState } from "react";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import SearchBar from "../../../shared/components/formComponents/SearchBar";
import { Link } from "react-router-dom";
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
    mainContext.onUserAuth.subscribe(setCurrentUser)
  }, []);

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between items-center px-6 py-2 bg-layout-backgroud">
        <a className="flex items-center gap-x-3 select-none
            hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src={ logo } className="w-8 h-6 sm:visible invisible" alt="logo" />
          <span className="font-black text-white text-2xl">EmuHub</span>
        </a>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"
             className="btn-r-full bg-primary hover:bg-primary-dark text-white">Download App</a>
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
          <Link to="/app/log-in" onClick={ logout } className="w-full h-full px-8 text-center">
            Sair
          </Link>        
        </MenuItem>            
      </Menu>
    </Dropdown>
  )
}

const LoginSigninButtonContainer = () =>
  <>
    <Link to="/app/log-in" className="btn-r-md bg-teal-300 hover:bg-teal-400 text-white">
      Login
    </Link>
    <Link to="/app/sign-in" className="btn-r-md bg-teal-300 hover:bg-teal-400 text-white">
      Sign-in
    </Link>
  </>