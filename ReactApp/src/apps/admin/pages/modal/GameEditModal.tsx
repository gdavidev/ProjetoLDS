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
import { GameCreateResponseDTO } from '@models/GameDTOs';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';

export enum FormAction {
  ADD,
  EDIT,
}
export type GameEditModalProps = {
  game: Game,
  onChange?: (newGame: Game) => void
} & ModalPopupProps

export default function GameEditModal(props: GameEditModalProps) {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const [ errorMessage  , setErrorMessage ] = useState<string | undefined>(undefined);  
  const [ fileName      , setFileName     ] = useState<string>('');
  const [ previewImage  , setPreviewImage ] = useState<File | string>('');
  const nameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const descInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const emulatorInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const thumbnailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const formAction: FormAction = props.game.id === 0 ? FormAction.ADD : FormAction.EDIT;
  
  useEffect(() => {
    if (props.game.fileName) {
      setFileName(props.game.fileName);
    } else {
      setFileName("");
    }

    if (props.game.thumbnailBase64) {
      setPreviewImage(props.game.thumbnailBase64);
    } else if (props.game.thumbnail) {
      setPreviewImage(props.game.thumbnail);
    } else {
      setPreviewImage("");
    }
  }, [props.isOpen]);

  const {isLoading, isSuccess, isError, mutate, error: mutateError, reset: resetMutationResults} = 
    useMutation('query-games',
      async (game: Game) => {
        const gameApiClient: GameApiClient = new GameApiClient();
        gameApiClient.setToken(mainContext.currentUser?.token!)
        return await gameApiClient.store<GameCreateResponseDTO>(game)
      },
      {
        onSuccess: async (dto: GameCreateResponseDTO, game: Game) => {        
          triggerChanged(game, dto.id);
        },
        onError: async (err: any) => {
          console.log("err: " + JSON.stringify(err));
        },
      }
    );

  function resetForm() {
    resetMutationResults();    
    setErrorMessage('');
  }

  async function submitGame(): Promise<void> {
    setErrorMessage(getErrorOnValidateGameForm())
    if (errorMessage) 
      return
    
    const gameFiles: FileList | null = fileInput.current ? fileInput.current.files : null    
    const gameThumbnailFiles: FileList | null = thumbnailInput.current ? thumbnailInput.current.files : null

    const newGame: Game = new Game(
      props.game.id,
      nameInput.current?.value,
      descInput.current?.value,
      emulatorInput.current?.value,
      gameThumbnailFiles  ? gameThumbnailFiles[0] : undefined,
      gameFiles           ? gameFiles[0]          : undefined,
    )
    mutate(newGame);
  }

  function triggerChanged(newGame: Game, newGameId: number) {
    if (props.onChange) {
      let thumbnailInputEl: HTMLInputElement | null = thumbnailInput.current;
      if (thumbnailInputEl && thumbnailInputEl.files && thumbnailInputEl.files.length > 0) {
        newGame.thumbnail = thumbnailInputEl.files[0];
      } else {
        newGame.thumbnail = props.game.thumbnail;
        newGame.thumbnailBase64 = props.game.thumbnailBase64;              
      }      
      newGame.fileName = fileName;      

      newGame.id = newGameId;
      props.onChange(newGame);
    }
  }
  
  function getErrorOnValidateGameForm(): string | undefined {
    if (nameInput.current?.value === "") return "Campo nome vazío."
    if (descInput.current?.value === "") return "Campo descrição vazío."
    if (emulatorInput.current?.value === "") return "Campo emulador vazío."
    if (formAction === FormAction.ADD) {
      if (!(thumbnailInput.current?.files?.length! > 0)) return "Nenhuma thumbnail enviada."
      if (!(fileInput.current?.files?.length! > 0)) return "Nenhuma rom enviada." 
    }
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
        onClose={ () => { resetForm(); props.onClose?.() } }
        className="flex flex-col gap-y-3">      
      { getAlert() }
      <div className="grid grid-cols-2 gap-x-5">
        <div className="flex flex-col min-h-full justify-between">
          <div className="flex flex-col gap-y-3">
            <FormControl>              
              <FormLabel>Nome</FormLabel>             
              <input ref={ nameInput } type='text' className='input-text'
                 defaultValue={ props.game?.name } />
            </FormControl>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <input ref={ descInput } type='text' className='input-text'
                 defaultValue={ props.game?.desc } />
            </FormControl>
            <FormControl>
              <FormLabel>Emulador</FormLabel>
              <input ref={ emulatorInput } type='text' className='input-text'
                 defaultValue={ props.game?.emulator } />
            </FormControl>
          </div>
          <div className='flex justify-start items-center gap-x-2'>
            <IonIcon className='min-h-4 min-w-4' icon={ document } />
            <span className="truncate">
                { fileName }
            </span>
          </div>
          <FileInput inputRef={ fileInput } buttonText='Upload File'
              onChange={ (e) => { setFileName(e.target.files?.item(0)?.name!) } } />
        </div>
        <div className="flex flex-col gap-y-3">
          <FileInputImagePreview previewImageSource={ previewImage }
             targetInputRef={ thumbnailInput } className="w-[300px] h-64" />
          <FileInput inputRef={ thumbnailInput } buttonText='Upload Thumbnail' accept="image/*" />
        </div>
      </div>
      <input type="button" onClick={ submitGame } disabled={ isLoading }
          className={ "btn-r-md bg-primary text-white" + (isLoading ? " disabled" : "") }
          value="Confirmar" />    
    </ModalPopup>
  );
};
