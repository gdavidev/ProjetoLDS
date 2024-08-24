function Sidebar() {
  return (
    <aside>
      <label id="console-select-label" htmlFor="console-select">Console:</label>
      <select id="console-select">
        <option value="Todos">Todos</option>
        <option value="PS1">PS1</option>
        <option value="PS2">PS2</option>
        <option value="PS3">PS3</option>
        <option value="PS4">PS4</option>
        <option value="NES">Nintendo</option>
        <option value="SNES">Super Nintendo</option>
      </select>

      <label htmlFor="text-filter">Pesquisar:</label>
      <input type="text" name="filter" id="filter" />
    </aside>
  );
}
export default Sidebar