import { RefObject } from 'react';
import Button from '@mui/joy/Button';
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons';

type FileInputProps = {
  id?: string,
  buttonText: string,
  className?: string,
  inputRef?: RefObject<HTMLInputElement>,
  accept?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function FileInput(props: FileInputProps) {
  return (
    <Button component="label" role={undefined} tabIndex={-1} variant="outlined"
        color="neutral" startDecorator={ <IonIcon icon={ cloudUploadOutline } />  }
        className={ props.className }>
      { props.buttonText }
      <input ref={ props.inputRef } className="hidden" type="file" accept={ props.accept }
        onChange={ props.onChange } id={ props.id } name={ props.id } />
    </Button>
  );
}