import SearchBar from "../FormComponents/SearchBar";
import Navbar from "./Navbar";

type HeaderArgs = {
  isUserAuth: boolean
}

function Header(args: HeaderArgs) {
  return (
    <header className="fixed w-screen flex flex-col px-6 pt-2 bg-slate-950 z-50 border-b-2 border-b-red-600 ">
      <div className="flex justify-between">
        <a><img src="https://placehold.co/160x30" className="sm:visible invisible" alt="logo" /></a>        
        <SearchBar className="fixed flex inset-x-1/2 w-60 -translate-x-1/2" />        
        <div className="flex gap-x-2">
        <a className="px-5 py-1.5 bg-red-600 hover:bg-red-500 cursor-pointer select-none text-white rounded-full transition duration-150 ease-in-out">Download App</a>
        { 
          args.isUserAuth === false ?
              <>
                <a className="px-5 py-1.5 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition duration-150 ease-in-out" href="#">Login</a>
                <a className="px-5 py-1.5 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition duration-150 ease-in-out" href="#">Sign-in</a>
              </>
              :            
              <>
                <a href="#">abs</a>
                <a href="#">aaaa</a>            
              </>
        }
        </div>
      </div>
      <div className="">
        <Navbar />          
      </div>   
    </header>
  );
}
export default Header