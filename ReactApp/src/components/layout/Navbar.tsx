function Navbar() {
  return (
    <nav className="flex justify-center bg-slate-950">
      <ul className="flex flex-row text-white">
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <a href="#">Home</a>
        </li>
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <a href="#">Jogos</a>
        </li>
        <li className="hover:bg-slate-800 bg-transparent py-2 px-3 m-0 w-32 text-center transition duration-150 ease-in-out">
          <a href="#">Biblioteca</a>
        </li>        
      </ul>  
    </nav>
  );
}
export default Navbar