import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons"

interface IPasswordHiddenToggleProps {
  onChange?: (value: boolean) => void,
  initialState?: boolean
}

export default function PasswordHiddenToggle(props: IPasswordHiddenToggleProps) {
  const [ enabled, setEnabled ] = useState<boolean>(props.initialState ?? true);

  return (
    <a onClick={ () => { setEnabled(!enabled); props.onChange?.(!enabled); }}
        className="rounded-md bg-primary bg-opacity-0 hover:bg-opacity-45 p-2 -me-2 duration-150 flex items-center">
      <IonIcon icon={ enabled ? eyeOffOutline : eyeOutline } />
    </a>
  );
}