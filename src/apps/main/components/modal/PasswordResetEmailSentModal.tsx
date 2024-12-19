import UserApiService from "@/api/CurrentUserApiService"
import ModalPopup, { ModalPopupProps } from "@/apps/shared/components/ModalPopup"
import Timer from "@/apps/shared/components/Timer"
import ellipse from '@apps/main/assets/appearence/ellipse.png'
import yoshi from '@apps/main/assets/appearence/yoshi.png'
import { useState } from "react"

export type PasswordResetEmailSentModalProps = {
  email: string,  
} & ModalPopupProps

export default function PasswordResetEmailSentModal(props: PasswordResetEmailSentModalProps) {
  const totalWaitTime: number = 15;  

  function sendEmail() {
    UserApiService.forgotPassword({ email: props.email })
  } 
  
  return (
    <ModalPopup isOpen={ props.isOpen } title="Recuperação de Senha"
       onCloseRequest={ props.onCloseRequest }>
      <div className="flex mr-72">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-y-1.5 text-3xl mb-5">
            <span>E-mail de redefinição de senha enviado!</span>
            <span>Verifique na sua caixa de entrada</span>            
          </div>
          <div className="flex gap-x-1.5 flex-wrap">
            <span>Não recebeu?</span>
            <SendAgainButton totalWaitTime={ totalWaitTime } onSendAgainClick={ sendEmail } />
          </div>         
        </div>
        <div className="grid items-center justify-items-center">
          <img className="absolute min-w-48 ms-60 col-start-1 row-start-1 z-10" src={yoshi} alt="yoshi" />
          <img className="absolute min-w-48 ms-60 col-start-1 row-start-1 z-0" src={ellipse} alt="ellipse" />
        </div>
      </div>      
    </ModalPopup>
  )
}

type SendAgainButtonProps = {
  totalWaitTime: number
  onSendAgainClick: () => void
}
function SendAgainButton(props: SendAgainButtonProps) {
  const [ isSendAgainShown, setIsSendAgainShown ] = useState<boolean>(false);

  return (
    isSendAgainShown ?
      <a className="underline hover:text-primary select-none cursor-pointer" 
          onClick={ () => { setIsSendAgainShown(false); props.onSendAgainClick } }>
        Enviar novamente
      </a>
      :
      <span>
        Envie novamente em <Timer startTime={ props.totalWaitTime } onStop={ () => { setIsSendAgainShown(true) } } /> segundos
      </span> 
  )
}