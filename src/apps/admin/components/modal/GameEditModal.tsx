import { useCallback, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import FileInput from '@shared/components/formComponents/FileInput';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview';
import { IonIcon } from '@ionic/react';
import { document } from 'ionicons/icons';
import Game from '@models/Game';
import ModalPopup, { ModalPopupProps } from '@apps/shared/components/ModalPopup';
import Thumbnail from '@models/utility/Thumbnail';
import SelectInput, { SelectInputSource } from '@apps/shared/components/formComponents/SelectInput';
import Emulator from '@models/Emulator';
import Category from '@models/Category';
import useEmulators from '@/hooks/useEmulators';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useStoreGame } from '@/hooks/useGames';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import StringFormatter from '@/libs/StringFormatter';
import FileUtil from '@/libs/FileUtil';

type GameEditModalProps = {
  game: Game,
  onChange?: (newGame: Game) => void
} & ModalPopupProps
type GameEditModalFormData = {
  name: string,
  desc: string,
  emulatorId: number,
  categoryId: number,
  thumbnail?: Thumbnail,
  file?: File
}
const defaultValues: GameEditModalFormData = {
  name: '',
  desc: '',
  emulatorId: -1,
  categoryId: -1,
  thumbnail: undefined,
  file: undefined,
}

export default function GameEditModal(props: GameEditModalProps) {
  const [ emulatorSelectSource , setEmulatorSelectSource ] = useState<SelectInputSource>([]);
  const [ emulatorList         , setEmulatorList         ] = useState<Emulator[]>([]);
  const [ categorySelectSource , setCategorySelectSource ] = useState<SelectInputSource>([]);
  const [ categoryList         , setCategoryList         ] = useState<Category[]>([]);
  const { user } = useCurrentUser();
  const { handleSubmit, watch, control, formState: { errors }, reset: setFormData } = 
    useForm<GameEditModalFormData>({
      defaultValues: defaultValues
    })
  
  // ---- API Calls Setup ----
  useEmulators({
    onSuccess: (emulators: Emulator[]) => {
      const emulatorSelectSourceRaw = emulators.map(em => ({ value: em.id, name: em.console }));
      setEmulatorList(emulators);
      setEmulatorSelectSource(emulatorSelectSourceRaw);
    },
    onError: (err: AxiosError | Error) => console.log("err: " + JSON.stringify(err))
  });
  useCategories(CategoryType.GAMES, {
    onSuccess: (categories: Category[]) => {
      const source = categories.map(cat => ({ value: cat.id, name: cat.name }));
      setCategoryList(categories);
      setCategorySelectSource(source);
    },
    onError: (err: AxiosError | Error) => console.log("err: " + JSON.stringify(err))
  });

  const {
      mutate: storeGame,
      reset: resetMutationResults, 
      isLoading: storeIsLoading,
      error: mutateError,
      isSuccess,
      isError
    } = useStoreGame(user?.token!, {
      onSuccess: async (game: Game) => props.onChange?.(game),
      onError: (err: AxiosError | Error) => console.log("err: " + JSON.stringify(err))
    });

  // ---- Initialization ----
  useEffect(() => {
    if (!props.isOpen) return;

    if (props.game.id !== 0) {
      setFormData({
        name: props.game.name,
        desc: props.game.desc,
        emulatorId: props.game.emulator.id,
        categoryId: props.game.category.id,
        thumbnail: props.game.thumbnail ?? undefined,
        file: props.game.file ?? undefined,
      })
    } else {
      setFormData(defaultValues)
      resetForm()
    }
  }, [props.isOpen]);
  
  // ---- API Calls Execution ----
  const submitGame = useCallback((data: GameEditModalFormData) => {    
    const emulator: Emulator = emulatorList.find((emu: Emulator) => data.emulatorId == emu.id)!;
    const category: Category = categoryList.find((cat: Category) => data.categoryId == cat.id)!;

    if (data.thumbnail && data.thumbnail.file)
      data.thumbnail.file = FileUtil.renamed(data.thumbnail.file, StringFormatter.toUrlSafe(data.name))
    if (data.file)
      data.file = FileUtil.renamed(data.file, StringFormatter.toUrlSafe(data.name));

    storeGame(new Game(
      props.game.id,
      data.name,
      data.desc,
      emulator,
      data.thumbnail,
      data.file,
      category,
    ));
  }, [emulatorList, categoryList]);

  // ---- Error handling ----
  function getAlert(): JSX.Element | undefined {
    const formError = Object.values(errors).find(err => err.message !== undefined)
    if (formError !== undefined)
      return <Alert severity="error">{ formError.message }</Alert>
    if (storeIsLoading)
      return <Alert severity="info">Enviando...</Alert>
    if (isSuccess)
      return <Alert severity="success">Enviado com sucesso!</Alert>
    if (isError)
      return <Alert severity="error">{ mutateError.message }</Alert>
    return undefined
  }

  // ---- General callbacks ----
  const resetForm = useCallback(() => {
    resetMutationResults();
  }, [resetMutationResults]);

  return (
    <ModalPopup 
      title={ props.game.id !== 0 ? "Editar Jogo" : "Adicionar Jogo" }
      isOpen={ props.isOpen } 
      bottomText={ props.bottomText } 
      topText={ props.topText }
      className='max-w-[80%]'      
      onCloseRequest={ () => { resetForm(); props.onCloseRequest?.() } }
    >      
      { getAlert() }
      <form onSubmit={ handleSubmit(submitGame) }>
        <div className="grid grid-cols-2 gap-x-5">        
          <div className="flex flex-col min-h-full justify-between">
            <div className="flex flex-col gap-y-3">
              <Controller name="name" control={ control }
                  rules={{ required: 'É necessário especificar um Nome.' }}
                  render={ ({field}) => (
                    <TextInput {...field} 
                        name="Nome"
                        inputClassName={ 'input-text' + (errors.name ? ' bg-red-100 border-red-500' : ' bg-slate-200') }
                        inputContainerClassName="rounded-md overflow-hidden" />
                ) }/>
              <Controller name="desc" control={ control } 
                  rules={{ required: 'É necessário especificar uma Descrição.' }}
                  render={ ({field}) => (
                    <TextInput {...field} 
                        name="Descrição"
                        inputClassName={ 'input-text' + (errors.desc ? ' bg-red-100 border-red-500' : ' bg-slate-200') }
                        inputContainerClassName="rounded-md overflow-hidden" />
                ) }/>
              <Controller name="emulatorId" control={ control }
                  defaultValue={-1}
                  rules={{ validate: (value) => value > -1 || 'É necessário especificar um Console.' }}
                  render={ ({field}) => (
                    <SelectInput {...field}
                        name="Console"
                        source={ emulatorSelectSource } hasSelectOption
                        containerClassName='flex flex-col'                        
                        className={'input-text ' + (errors.emulatorId ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
                ) }/>
              <Controller name="categoryId" control={ control }
                  defaultValue={-1}
                  rules={{ validate: (value) => value > -1 || 'É necessário especificar uma Categoria.' }}
                  render={ ({field}) => (
                    <SelectInput {...field}
                        name="Categoria"
                        source={ categorySelectSource } hasSelectOption
                        containerClassName='flex flex-col'
                        className={ 'input-text ' + (errors.categoryId ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
                ) }/>
            </div>
            <div className='flex justify-start items-center gap-x-2 my-2'>
              <IonIcon className='min-h-4 min-w-4' icon={ document } />
              <span className="truncate">{ watch("file")?.name }</span>
            </div>
            <Controller name="file" control={ control } 
                rules={{ required: props.game.id !== 0 || 'É necessário enviar um arquivo.' }}
                render={ ({field}) => (
                  <FileInput {...field}
                      onChange={ (e) => field.onChange(e?.[0]) }
                      error={ errors.file !== undefined }
                      buttonText='Arquivo do Jogo' />
                ) }/>          
          </div>
          <div className="flex flex-col justify-between">
            <FileInputImagePreview 
                thumbnail={ watch('thumbnail') }
                className="min-w-[300px] min-h-80" />

            <Controller name="thumbnail" control={ control } 
                rules={{ required: props.game.id !== 0 || 'É necessário enviar uma imagem.' }}
                render={ ({field}) => (
                <FileInput {...field}
                    buttonText='Arquivo de imagem'
                    onChange={ (e) => field.onChange(e ? new Thumbnail({ file: e[0] }) : undefined) }
                    error={ errors.thumbnail !== undefined }
                    accept="image/*" />
              ) }/>
          </div>
        </div>
        <input
            value="Confirmar"
            type="submit"
            className='btn-primary mx-auto w-60 mt-3'
            disabled={ storeIsLoading }
        />
      </form>      
    </ModalPopup>
  );
};