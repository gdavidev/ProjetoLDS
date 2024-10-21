import { PropsWithChildren } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';

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
    <>      
      <Modal className={ props.className } open={ props.isOpen } >
        <ModalDialog>
          <ModalClose variant="plain" sx={{ m: 1 }} onClick={ () => props.onCloseRequest?.() } />
          <DialogTitle>{ props.title || "Warning" }</DialogTitle>
          { 
            props.topText ? 
              <DialogContent>{ props.topText }</DialogContent> :
              <></>
          }
          { props.children }
          { 
            props.bottomText ? 
              <DialogContent>{ props.bottomText }</DialogContent> :
              <></>
          }          
        </ModalDialog>
      </Modal>
    </>
  )
};
