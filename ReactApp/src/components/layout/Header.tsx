import { useContext } from "react";
import SearchBar from "../formComponents/SearchBar";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { MainContext, MainProps } from "../../MainContextProvider";

export default function Header() {
  const mainContext: MainProps = useContext(MainContext)

  return (
    <header className="fixed w-screen flex flex-col z-50">
      <div className="flex justify-between px-6 py-2 bg-layout-backgroud">
        <a className="hover:scale-110 active:scale-95 transition duration-100 ease-in-out">
          <img src="https://placehold.co/160x30" className="sm:visible invisible" alt="logo" />
        </a>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">
        <a className="btn-r-full bg-primary hover:bg-primary-dark text-white">Download App</a>
        { 
          mainContext.currentUser.isAuth() ?
            [<a key={0} href="#">abs</a>,
            <a key={1} href="#">aaaa</a>]                   
            :            
            [<Link key={0} className="btn-r-md bg-teal-300 hover:bg-teal-400 text-white" to="/log-in">Login</Link>,
            <Link key={1} className="btn-r-md bg-teal-300 hover:bg-teal-400 text-white" to="/sign-in">Sign-in</Link>]              
        }
        </div>
      </div>
      <Navbar />    
    </header>
  );
}