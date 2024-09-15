import { IonIcon } from '@ionic/react'
import { openOutline } from 'ionicons/icons'

type HGameCardProps = {
  name?: string,
  desc?: string,
  img?: string,
  emulador?: string,
  filePath?: string
}

export function HGameCard(props: HGameCardProps) {
  return (
    <div className="flex rounded-2xl bg-white text-black p-3 align-middle gap-x-2">
      <div className="overflow-hidden w-40 h-40 rounded-xl">
        <img className="h-full" src={ props.img } alt={ props.name } />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <h3 className="font-black text-3xl">{ props.name }</h3>
          <span className="text-xl">{ props.emulador }</span>
        </div>
        <span className="h-full">{ props.desc }</span>
        <a className="btn-r-full text-white w-36 gap-x-2 self-end bg-primary hover:bg-primary-dark"
            href={ props.filePath }>
          <IonIcon icon={ openOutline } /><span>JOGAR</span>
        </a>
      </div>    
    </div>
  );
}