import { useRef, RefObject, useState, useEffect, useContext } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Alert } from '@mui/joy';
import FileInput from '../../../shared/components/formComponents/FileInput';
import FileInputImagePreview from '../../../shared/components/formComponents/FileInputImagePreview';
import GameApiClient from '../../../../api/GameApiClient';
import { IonIcon } from '@ionic/react'
import { document } from 'ionicons/icons'
import Game from '../../../../models/Game';
import { useMutation } from 'react-query';
import { MainContext, MainContextProps } from '../../../shared/context/MainContextProvider';

type GameEditModalContentProps = {
  game?: Game,
  onChange?: (newGame: Game) => void
}

export default function GameEditModalContent(props: GameEditModalContentProps) {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const [ errorMessage, setErrorMessage ] = useState<string | undefined>(undefined);  
  const [ fileInputData, setFileInputData ] = useState<FileList | null>();
  const nameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const descInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const thumbnailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const emulatorInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  let newGame: Game | undefined = undefined;
  
  useEffect(loadFormFromGameData, []);

  function loadFormFromGameData() {
    if (!props.game) return

    if(nameInput.current)
      nameInput.current.value = props.game.name
    if(descInput.current)
      descInput.current.value = props.game.desc
    if(emulatorInput.current)
      emulatorInput.current.value = props.game?.emulator
    // if(fileInput.current && fileInput.current.files)
    //   fileInput.current.files[0] = props.game?.file!
    // if(thumbnailInput.current && thumbnailInput.current.files)
    //   thumbnailInput.current.files[0] = props.game?.thumbnail!    
  }

  function handleFormSubmit() {
    let errorMessage: string = getErrorOnValidateGameForm();
    if (errorMessage !== "") {
      setErrorMessage(errorMessage)
      return
    }
    submitGame();
  }

  const { isLoading, isSuccess, isError, error: mutateError, mutate } = 
    useMutation('query-games',
      async (game: Game) => {
        const gameApiClient: GameApiClient = new GameApiClient();
        gameApiClient.setBearerToken(mainContext.currentUser?.token!)
        return await gameApiClient.create(game)
      }, 
      {
        onSuccess: async (response) => {
          console.log("success: " + JSON.stringify(response));
          if (props.onChange && newGame)
            props.onChange(newGame);
        },
        onError: async (err: any) => { 
          console.log("err: " + JSON.stringify(err));
        }
      }
    )

  async function submitGame(): Promise<void> {    
    const gameFiles: FileList | null = fileInput.current ? fileInput.current.files : null    
    const gameThumbnailFiles: FileList | null = thumbnailInput.current ? thumbnailInput.current.files : null    

    newGame = new Game(
      props.game ? props.game.id : 0,
      nameInput.current ? nameInput.current.value : "",
      descInput.current ? descInput.current.value : "",
      emulatorInput.current ? emulatorInput.current.value : "",
      gameThumbnailFiles ? gameThumbnailFiles[0] : undefined,
      gameFiles ? gameFiles[0] : undefined      
    )
    mutate(newGame);
  }
  
  function getErrorOnValidateGameForm(): string {
    if (nameInput.current?.value === "") return "Campo nome vazío."
    if (descInput.current?.value === "") return "Campo descrição vazío."
    if (emulatorInput.current?.value === "") return "Campo emulador vazío."
    if (!(thumbnailInput.current?.files?.length! > 0)) return "Nenhuma thumbnail enviada."
    if (!(fileInput.current?.files?.length! > 0)) return "Nenhuma rom enviada." 
    return ""
  }

  function getAlert(): JSX.Element | string {
    if (errorMessage)
      return <Alert color="danger" >{ errorMessage }</Alert>
    else if (isLoading)
      return <Alert color="warning" >Enviando...</Alert>
    else if (isSuccess)
      return <Alert color="success" >Enviado com sucesso!</Alert>
    else if (isError)
      return <Alert color="danger" >{ mutateError.message }</Alert>
    return ""
  }

  return (
    <form onSubmit={ e => e.preventDefault() } className="flex flex-col gap-y-3" >
      { getAlert() }
      <div className="grid grid-cols-2 gap-x-5">
        <div className="flex flex-col min-h-full justify-between">
          <div className="flex flex-col gap-y-3">
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <input type='text' className='input-text' ref={ nameInput } />
            </FormControl>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <input type='text' className='input-text' ref={ descInput } />
            </FormControl>
            <FormControl>
              <FormLabel>Emulador</FormLabel>
              <input type='text' className='input-text' ref={ emulatorInput } />
            </FormControl>
          </div>
          <span className="truncate flex items-center gap-x-2">
              <IonIcon icon={ document } />
              { fileInputData ? fileInputData[0].name : "" }
          </span>
          <FileInput inputRef={ fileInput } onChange={ (e) => { setFileInputData(e.target.files) } }
             buttonText='Upload File' />        
        </div>
        <div className="flex flex-col gap-y-3">
          <FileInputImagePreview targetInputRef={ thumbnailInput } className="min-w-full h-64" />
          <FileInput inputRef={ thumbnailInput } buttonText='Upload Thumbnail' accept="image/*" />
        </div>
      </div>
      <input type="button" onClick={ handleFormSubmit } disabled={ isLoading }
          className={ "btn-r-md bg-primary text-white" + (isLoading ? " disabled" : "") }
          value="Confirmar" />      
    </form>
  );
}