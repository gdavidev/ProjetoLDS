import Button from '@mui/material/Button';
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons';
import { forwardRef } from 'react';
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme';

type FileInputProps = {
  id?: string,
  buttonText: string,
  className?: string,
  accept?: string,
  error?: boolean,
  onChange?: (e: FileList | null) => void,
}

export const FileInput = forwardRef((props: FileInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const { colors } = useTailwindTheme()

  return (
    <Button 
      component="label" 
      tabIndex={-1} 
      variant="contained"
      color={ props.error ? "error" : 'primary' }
      startIcon={ <IonIcon icon={ cloudUploadOutline } /> }
      className={ props.className }
      sx={{
        backgroundColor: colors['secondary']
      }}
    >
      { props.buttonText }
      <input 
        ref={ ref } 
        type="file" 
        id={ props.id } 
        name={ props.id } 
        accept={ props.accept }
        className="hidden" 
        onChange={ (e) => props.onChange?.(e.target.files) } 
      />
    </Button>
  );
})
export default FileInput;