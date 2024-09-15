import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const currentPath: string = useLocation().pathname
  const pathToHome: string = "/app/"
  const pathToGames: string = "/app/games"

  return (
    <nav className="flex justify-center mt-1">
      <ul className="flex flex-row text-white gap-x-2">
        <li className={ "navbar-item " +
            (currentPath === pathToHome ? "text-primary-light" : "text-white") }>
          <Link to={ pathToHome }>Home</Link>
        </li>
        <li className={ "navbar-item " +
            (currentPath === pathToGames ? "text-primary-light" : "text-white") }>
          <Link to={ pathToGames }>Jogos</Link>
        </li>      
      </ul>  
    </nav>
  );
}