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
import SelectInput from '@/apps/shared/components/formComponents/SelectInput';
import Emulator from '@/models/Emulator';
import EmulatorApiClient from '@/api/EmulatorApiClient';
import CategoryApiClient from '@/api/CategoryApiClient';
import Category from '@/models/Category';
import FileUtil from '@/libs/FileUtil';
import StringFormatter from '@/libs/StringFormatter';

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
  const [ errorMessage         , setErrorMessage         ] = useState<string | undefined>(undefined);  
  const [ fileName             , setFileName             ] = useState<string>('');
  const [ previewImage         , setPreviewImage         ] = useState<File | string>('');
  const [ emulatorSelectSource , setEmulatorSelectSource ] = useState<[number, string][]>([]);
  const [ emulatorList         , setEmulatorList         ] = useState<Emulator[]>([]);
  const [ categorySelectSource , setCategorySelectSource ] = useState<[number, string][]>([]);
  const [ categoryList         , setCategoryList         ] = useState<Category[]>([]);
  const nameInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const descInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const emulatorSelect: RefObject<HTMLSelectElement> = useRef<HTMLSelectElement>(null);
  const categorySelect: RefObject<HTMLSelectElement> = useRef<HTMLSelectElement>(null);  
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const thumbnailInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const formAction: FormAction = props.game.id === 0 ? FormAction.ADD : FormAction.EDIT;
  
  useEffect(() => {
    fetchEmulatorData();
    fectchCategoryData();
  }, [props.isOpen]);

  async function fetchEmulatorData(): Promise<void> {
    const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient();
    const emulatorList: Emulator[] = await emulatorApiClient.getAll();
    setEmulatorList(emulatorList);
    setEmulatorSelectSource(emulatorList.map(em => [em.id, em.console]))
  }

  async function fectchCategoryData(): Promise<void> {
    const categoryApiCliente: CategoryApiClient = new CategoryApiClient();
    const categoryList: Category[] = await categoryApiCliente.getAll();
    setCategoryList(categoryList);
    setCategorySelectSource(categoryList.map(cat => [cat.id, cat.name]))
  }

  useEffect(() => {
    if (props.game.file) {
      setFileName(props.game.file.name);
    } else {
      setFileName("");
    }

    if (props.game.thumbnail) {
      if (props.game.thumbnail.base64) {
        setPreviewImage(props.game.thumbnail.base64);
      } else if (props.game.thumbnail.file) {
        setPreviewImage(props.game.thumbnail.file);
      }
    } else {
      setPreviewImage("");
    }
  }, [props.isOpen]);

  const {isLoading, isSuccess, isError, mutate, error: mutateError, reset: resetMutationResults} = 
    useMutation('query-games',
      async (game: Game) => {
        const gameApiClient: GameApiClient = new GameApiClient(mainContext.currentUser?.token!);
        return await gameApiClient.store(game);
      },
      {
        onSuccess: async (_, game: Game) => {        
          triggerChanged(game, game.id);
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
    
    let gameFile: File | null = fileInput.current && fileInput.current.files ?
        fileInput.current.files[0] : null;
    let thumbnailFile: Thumbnail | null = thumbnailInput.current && thumbnailInput.current.files ?
        new Thumbnail(thumbnailInput.current.files[0]) : null;
    let emulator: Emulator = emulatorList.find((value: Emulator) => Number(emulatorSelect.current?.value!) === value.id)!;
    let category: Category = categoryList.find((value: Category) => Number(categorySelect.current?.value!) === value.id)!;

    if (thumbnailFile && nameInput.current)
      thumbnailFile.renameFile((new StringFormatter(nameInput.current.value)).toUrlSafe());
    if (gameFile && nameInput.current)
      gameFile = FileUtil.renamed(gameFile, (new StringFormatter(nameInput.current.value)).toUrlSafe());

    const newGame: Game = new Game(
      props.game.id,
      nameInput.current?.value,
      descInput.current?.value,
      emulator,
      thumbnailFile,
      gameFile,
      category,
    )
    mutate(newGame);
  }

  function triggerChanged(newGame: Game, newGameId: number) {
    if (props.onChange) {
      let thumbnailInputEl: HTMLInputElement | null = thumbnailInput.current;
      if (thumbnailInputEl && thumbnailInputEl.files && thumbnailInputEl.files.length > 0) {
        newGame.thumbnail = new Thumbnail(thumbnailInputEl.files[0]);
      } else {
        newGame.thumbnail = props.game.thumbnail;
      }
      newGame.file = new File([], fileName);

      newGame.id = newGameId;
      props.onChange(newGame);
    }
  }
  
  function getErrorOnValidateGameForm(): string | undefined {
    if (nameInput.current?.value === "") return "Campo nome vazío."
    if (descInput.current?.value === "") return "Campo descrição vazío."
    if (emulatorSelect.current?.value === "") return "Campo emulador vazío."
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
        onCloseRequest={ () => { resetForm(); props.onCloseRequest?.() } }
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
              <FormLabel>Console</FormLabel>
              <SelectInput ref={ emulatorSelect } defaultValue={ props.game.emulator?.id }
                  source={ emulatorSelectSource } className='input-text' />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <SelectInput ref={ categorySelect } defaultValue={ props.game.category?.id }
                  source={ categorySelectSource } className='input-text' />
            </FormControl>
          </div>
          <div className='flex justify-start items-center gap-x-2'>
            <IonIcon className='min-h-4 min-w-4 mb-2 mt-4' icon={ document } />
            <span className="truncate">
                { fileName }
            </span>
          </div>
          <FileInput inputRef={ fileInput } buttonText='Upload File'
              onChange={ (e) => { setFileName(e.target.files?.item(0)?.name!) } } />
        </div>
        <div className="flex flex-col justify-between">
          <FileInputImagePreview previewImageSource={ previewImage }
             targetInputRef={ thumbnailInput } className="min-w-[300px] h-72" />
          <FileInput inputRef={ thumbnailInput } buttonText='Upload Thumbnail' accept="image/*" />
        </div>
      </div>
      <input type="button" onClick={ submitGame } disabled={ isLoading }
          className={ "btn-r-md bg-primary text-white" + (isLoading ? " disabled" : "") }
          value="Confirmar" />    
    </ModalPopup>
  );
};
