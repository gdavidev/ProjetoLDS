import { PropsWithChildren } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

export type ModalPopupProps = {
  title?: string,
  topText?: string,
  bottomText?: string,
  className?: string,
  isOpen: boolean,
  onCloseRequest?: () => void
}

export default function ModalPopup(props: PropsWithChildren<ModalPopupProps>) {
  return (
    <Modal open={ props.isOpen }>
        <Box className={ 'centered w-fit h-fit bg-white px-4 pt-2 pb-4 rounded-md ' + props.className }>
          <div className='flex justify-between'>
            <Typography variant="h6" component="h2">{ props.title || "Warning" }</Typography>
            <IconButton onClick={ () => props.onCloseRequest?.() }>
              <IonIcon icon={ closeOutline } />
            </IconButton>
          </div>
          { 
            props.topText &&
              <div>{ props.topText }</div>
          }
          { props.children }
          { 
            props.bottomText &&
              <div>{ props.bottomText }</div>
          }          
        </Box>
    </Modal>
  )
};
