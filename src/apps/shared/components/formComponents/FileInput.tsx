import Button from '@mui/joy/Button';
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons';
import { forwardRef } from 'react';

type FileInputProps = {
  id?: string,
  buttonText: string,
  className?: string,
  accept?: string,
  error?: boolean,
  onChange?: (e: FileList | null) => void,
}

export const FileInput = forwardRef((props: FileInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  return (
    <Button 
        component="label" 
        role={undefined} 
        tabIndex={-1} 
        variant="outlined"
        color={ props.error ? "danger" : 'neutral' }
        startDecorator={ <IonIcon icon={ cloudUploadOutline } /> }
        className={ props.className }>
      { props.buttonText }
      <input ref={ ref } type="file" 
          id={ props.id } 
          name={ props.id } 
          accept={ props.accept }
          className="hidden" 
          onChange={ (e) => props.onChange?.(e.target.files) } />
    </Button>
  );
})
export default FileInput;