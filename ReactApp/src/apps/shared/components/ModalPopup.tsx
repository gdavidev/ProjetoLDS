import { useContext, useState } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';
import { AdminContext, AdminContextProps } from '@apps/admin/AdminApp';

export type ModalPopupData = {
  title?: string,
  topDescription?: string,
  bottomDescription?: string,
  modalContentEl?: JSX.Element | JSX.Element[],
  modalClassName?: string
}

export default function ModalPopup() {
  const adminContext: AdminContextProps = useContext(AdminContext)
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ modalData, setModalData] = useState<ModalPopupData | undefined>(undefined);
  adminContext.setModalIsOpen = setIsOpen
  adminContext.setModalData = setModalData

  return (
    <>      
      <Modal className={ modalData?.modalClassName } open={ isOpen }
          onClose={ () => setIsOpen(false) }>
        <ModalDialog>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <DialogTitle>{ modalData?.title || "Warning" }</DialogTitle>
          { 
            modalData?.topDescription ? 
              <DialogContent>{ modalData?.topDescription }</DialogContent> :
              <></>
          }
          { modalData?.modalContentEl }
          { 
            modalData?.bottomDescription ? 
              <DialogContent>{ modalData?.bottomDescription }</DialogContent> :
              <></>
          }          
        </ModalDialog>
      </Modal>
    </>
  )
}

/* <Button variant="solid" color="danger" onClick={ () => setIsOpen(true) }  
    className={ props.buttonClassName }>
  { props.buttonContentEl }
</Button> */