import { useContext } from "react";
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
import { ListItemDecorator } from "@mui/joy";

export default function Header() {
  const mainContext: MainContextProps = useContext(MainContext)

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between items-center px-6 py-2 bg-layout-backgroud">
        <a className="hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src="https://placehold.co/160x30" className="sm:visible invisible" alt="logo" />
        </a>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">
          <a className="btn-r-full bg-primary hover:bg-primary-dark text-white">Download App</a>
          { 
            mainContext.currentUser?.isAuth() ?
              <LoggedUserDropdown user={ mainContext.currentUser } /> :
              <LoginSigninButtonContainer />
          }
        </div>
      </div>
      <Navbar />    
    </header>
  );
}

const LoggedUserDropdown = (props: { user: CurrentUser }) => {
  function logout() {
    const mainContext: MainContextProps = useContext(MainContext)
    mainContext.setCurrentUser?.(undefined)
  }
  
  return (
    <Dropdown>
      <MenuButton variant="plain" size="lg"
          startDecorator={ <IonIcon icon={ person } /> }
          endDecorator={ <IonIcon icon={ caretDown } /> }>
        { props.user.userName }
      </MenuButton>
      <Menu variant="plain" size="lg">
        <MenuItem>
          <Link to="/app/log-in">Perfil</Link>
        </MenuItem>
        {
          // TODO add way to set an admin in the backend
          true ? //props.user.isAdmin !== undefined && props.user.isAdmin ?
            <MenuItem>
              <Link to="/admin/view-games">Admin</Link>
            </MenuItem> :
            <></>
        }
        <MenuItem>
          <ListItemDecorator />
          <Link to="/app/log-in" onClick={ logout }>
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