import { useState } from "react";
import starIcon from '@apps/main/assets/icons/star.png'

type FavoriteButtonProps = {
  checked: boolean,
}

export default function FavoriteButton(props: FavoriteButtonProps) {
  const [ isChecked, setIsChecked ] = useState<boolean>(props.checked);

  return (
    <button className={"w-5 h-5 "  + (isChecked ? 
          "hover:grayscale-[30%]" : 
          "grayscale hover:grayscale-[70%]") }        
          onClick={ () => setIsChecked(!isChecked) }>
        <img src={ starIcon } />
    </button>
  );
}
