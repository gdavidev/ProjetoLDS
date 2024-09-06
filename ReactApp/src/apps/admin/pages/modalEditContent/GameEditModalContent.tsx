import { useRef, RefObject, useState, useEffect } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { Alert } from '@mui/joy';
import FileInput from '../../../shared/components/formComponents/FileInput';
import FileInputImagePreview from '../../../shared/components/formComponents/FileInputImagePreview';
import GameApiClient from '../../../../api/GameApiClient';
import { IonIcon } from '@ionic/react'
import { document } from 'ionicons/icons'
import Game from '../../../../models/Game';
import { useMutation } from 'react-query';

export default function GameEditModalContent(props: { game?: Game }) {
  const [ errorMessage, setErrorMessage ] = useState<string | undefined>(undefined);  
  const [ fileInputData, setFileInputData ] = useState<FileList | null>();
  const nameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const descInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const thumbnailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const emulatorInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  
  useEffect(loadFormFromGameData, []);

  function loadFormFromGameData() {
    if (!props.game) return

    if(nameInput.current)
      nameInput.current.value = props.game.name
    if(descInput.current)
      descInput.current.value = props.game.desc
    if(emulatorInput.current)
      emulatorInput.current.value = props.game?.emulator
    if(fileInput.current && fileInput.current.files)
      fileInput.current.files[0] = props.game?.file!
    if(thumbnailInput.current && thumbnailInput.current.files)
      thumbnailInput.current.files[0] = props.game?.thumbnail!    
  }

  function handleFormSubmit() {
    let errorMessage: string = getErrorOnValidateGameForm();
    if (errorMessage !== "") {
      setErrorMessage(errorMessage)
      return
    }
    submitGame();
  }

  const { isLoading, mutate } = useMutation('query-games',
    async (game: Game) => {
      const gameApiClient: GameApiClient = new GameApiClient();
      return await gameApiClient.create(game)
    }, 
    {
      onSuccess: async (res) => {
        console.log("success: " + JSON.stringify(res));
      },
      onError: async (err: any) => { 
        console.log("err: " + JSON.stringify(err));
      }
    }
  )

  async function submitGame(): Promise<void> {    
    const gameFiles: FileList | null = fileInput.current ? fileInput.current.files : null    
    const gameThumbnailFiles: FileList | null = thumbnailInput.current ? thumbnailInput.current.files : null    

    const game: Game = new Game(
      props.game ? props.game.id : 0,
      nameInput.current?.value!,
      descInput.current?.value!,
      emulatorInput.current?.value!,
      gameThumbnailFiles ? gameThumbnailFiles[0] : undefined,
      gameFiles ? gameFiles[0] : undefined      
    )
    mutate(game);
  }

  function getErrorOnValidateGameForm(): string {
    if (nameInput.current?.value === "") return "Campo nome vazío."
    if (descInput.current?.value === "") return "Campo descrição vazío."
    if (emulatorInput.current?.value === "") return "Campo emulador vazío."
    if (!(thumbnailInput.current?.files?.length! > 0)) return "Nenhuma thumbnail enviada."
    if (!(fileInput.current?.files?.length! > 0)) return "Nenhuma rom enviada." 
    return ""
  }

  return (
    <form onSubmit={ e => e.preventDefault() } className="flex flex-col gap-y-3" >
      {
        errorMessage ? <Alert color="danger" >{ errorMessage }</Alert> : ""
      }
      <div className="grid grid-cols-2 gap-x-5">
        <div className="flex flex-col min-h-full justify-between">
          <div className="flex flex-col gap-y-3">
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input ref={ nameInput } />
            </FormControl>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Input ref={ descInput } />
            </FormControl>
            <FormControl>
              <FormLabel>Emulador</FormLabel>
              <Input ref={ emulatorInput } />
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
          className="btn-r-md bg-primary text-white" value="Confirmar" />      
    </form>
  );
}