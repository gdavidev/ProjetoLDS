import { useRef, RefObject, useState, useContext, useEffect } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Alert } from '@mui/joy';
import FileInput from '@shared/components/formComponents/FileInput';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview';
import GameApiClient from '@api/GameApiClient';
import { IonIcon } from '@ionic/react'
import { document } from 'ionicons/icons'
import Game from '@models/Game';
import { useMutation } from 'react-query';
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import Thumbnail from '@/models/Thumbnail';
import Emulator from '@/models/Emulator';
import EmulatorApiClient from '@/api/EmulatorApiClient';

export enum FormAction {
  ADD,
  EDIT,
}
export type EmulatorEditModalProps = {
  emulator: Emulator,
  onChange?: (newEmulator: Emulator) => void
} & ModalPopupProps

export default function EmulatorEditModal(props: EmulatorEditModalProps) {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const [ errorMessage  , setErrorMessage ] = useState<string | undefined>(undefined);  
  const nameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const consoleInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const formAction: FormAction = props.emulator.id === 0 ? FormAction.ADD : FormAction.EDIT;
  
  const {isLoading, isSuccess, isError, mutate, error: mutateError, reset: resetMutationResults} = 
    useMutation('query-games',
      async (emulator: Emulator) => {
        const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient(mainContext.currentUser?.token!);
        return await emulatorApiClient.store(emulator);
      },
      {
        onSuccess: async (_, emulator: Emulator) => props.onChange?.(emulator),
        onError: async (err: any) => {
          console.log("err: " + JSON.stringify(err));
        },
      }
    );

  function resetForm() {
    resetMutationResults();    
    setErrorMessage('');
  }

  async function submitEmulator(): Promise<void> {
    setErrorMessage(getErrorOnValidateGameForm())
    if (errorMessage) 
      return
    
    const newEmulator: Emulator = new Emulator(
      props.emulator.id,
      nameInput.current?.value,
      consoleInput.current?.value,
    );
    mutate(newEmulator);
  }
  
  function getErrorOnValidateGameForm(): string | undefined {
    if (nameInput.current?.value === "") return "Campo nome vazío."
    if (consoleInput.current?.value === "") return "Campo console vazío."
    return undefined
  }

  function getAlert(): JSX.Element | undefined {
    if (errorMessage)
      return <Alert color="danger" >{ errorMessage }</Alert>
    if (isLoading)
      return <Alert color="warning" >Enviando...</Alert>
    if (isSuccess)
      return <Alert color="success" >Enviado com sucesso!</Alert>
    if (isError)
      return <Alert color="danger" >{ mutateError.message }</Alert>
    return undefined
  }

  return (
    <ModalPopup title={ formAction === FormAction.EDIT ? "Editar Jogo" : "Adicionar Jogo" }
        isOpen={ props.isOpen } bottomText={ props.bottomText } topText={ props.topText } 
        onCloseRequest={ () => { resetForm(); props.onCloseRequest?.() } }
        className="flex flex-col gap-y-3">
      { getAlert() }
      <div className="grid grid-cols-2 gap-x-5">
        <div className="flex flex-col min-h-full justify-between">
          <div className="flex flex-col gap-y-3">
            <FormControl>              
              <FormLabel>Nome</FormLabel>             
              <input ref={ nameInput } type='text' className='input-text'
                 defaultValue={ props.emulator?.abbreviation } />
            </FormControl>
            <FormControl>
              <FormLabel>Empresa</FormLabel>
              <input ref={ consoleInput } type='text' className='input-text'
                 defaultValue={ props.emulator?.console } />
            </FormControl>
            <FormControl>
              <FormLabel>Console</FormLabel>
              <input ref={ consoleInput } type='text' className='input-text'
                 defaultValue={ props.emulator?.console } />
            </FormControl>
          </div>
        </div>
      </div>
      <input type="button" onClick={ submitEmulator } disabled={ isLoading }
          className={ "btn-r-md bg-primary text-white" + (isLoading ? " disabled" : "") }
          value="Confirmar" />
    </ModalPopup>
  );
};
