import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-center mt-1">
      <ul className="flex flex-row text-white gap-x-2">
        <li className="navbar-item">
          <Link to="/app/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/app/games">Jogos</Link>
        </li>
        <li className="navbar-item">
          <Link to="/app/emulators">Emuladores</Link>
        </li>        
      </ul>  
    </nav>
  );
}