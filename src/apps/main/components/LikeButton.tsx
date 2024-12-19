import { IonIcon } from '@ionic/react';
import { heartOutline, heart } from 'ionicons/icons';

type LikeButtonProps = {
  onClick?: () => void,
  checked?: boolean
  disabled?: boolean
  className?: string
}

export default function LikeButton(props: LikeButtonProps) {
  return (
    <button
      disabled={ props.disabled }
      onClick={ () => props.onClick?.() }
      className={ 'text-primary w-8 h-8 ' + props.className }
    >
      <IonIcon
          className={ 'text-2xl' }
          icon={ props.checked ? heart : heartOutline } />
    </button>
  )
}