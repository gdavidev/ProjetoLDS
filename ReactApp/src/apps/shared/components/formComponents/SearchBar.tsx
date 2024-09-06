import { IonIcon } from '@ionic/react'
import { searchOutline } from 'ionicons/icons'

type SearchBarArgs = {
  className?: string
}

export default function SearchBar(args: SearchBarArgs) {
  return (
    <div id="search-bar" className={ "flex p-0 h-fit w-fit bg-slate-200 rounded-full overflow-hidden " + args.className }>
      <IonIcon icon={ searchOutline } className="p-2 w-8 z-index-1" />
      <input type="text" className="pr-4 pl-0 py-2 h-8 align-self-middle border-none bg-slate-200 focus:outline-none" placeholder="Pesquisar..." name="search" id="search" />
    </div>
  );
}