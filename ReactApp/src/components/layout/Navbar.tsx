import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-center bg-slate-950">
      <ul className="flex flex-row text-white">
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <Link to="/games">Jogos</Link>
        </li>
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <Link to="/emulators">Emuladores</Link>
        </li>        
      </ul>  
    </nav>
  );
}