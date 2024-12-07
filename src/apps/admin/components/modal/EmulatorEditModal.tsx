import { useContext, useEffect } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Alert } from '@mui/joy';
import { useMutation, UseMutationResult } from 'react-query';
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import Emulator from '@/models/Emulator';
import EmulatorApiClient from '@/api/EmulatorApiClient';
import { FormState, useForm } from 'react-hook-form';
import { IonIcon } from '@ionic/react';
import { document, cloudUploadOutline } from 'ionicons/icons';
import Button from '@mui/joy/Button';
import FileUtil from '@/libs/FileUtil';

export type EmulatorEditModalProps = {
  emulator: Emulator,
  onChange?: (newEmulator: Emulator) => void
} & ModalPopupProps
interface IEmulatorFormData {
  company: string,
  console: string,
  abbreviation: string,
  file?: FileList,
}

const defaultValues: IEmulatorFormData = {
  company: "",
  console: "",
  abbreviation: "",
  file: undefined
}

export default function EmulatorEditModal(props: EmulatorEditModalProps) {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const { register, handleSubmit, watch, reset, clearErrors, formState } = useForm<IEmulatorFormData>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (props.emulator.id !== 0)
      reset({
        company: props.emulator.companyName,
        console: props.emulator.console,
        abbreviation: props.emulator.abbreviation,
        file: FileUtil.createFileList(props.emulator.file),
      });
  }, [props.isOpen])
  
  const emulatorService = useMutation('mutate-emulator',
      async (emulator: Emulator) => {
        const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient(mainContext.currentUser?.token!);
        return await emulatorApiClient.store(emulator);
      },
      {
        onSuccess: async (_, emulator: Emulator) => props.onChange?.(emulator),
        onError: async (err: any) => console.log("err: " + JSON.stringify(err)),
      }
    );

  const resetForm = () => { 
    emulatorService.reset();
    clearErrors();
    reset();
  }

  function onSubmit(data: IEmulatorFormData) {
    const emulatorFile: File | undefined = data.file instanceof FileList ? data.file[0] : data.file;
    const newEmulator: Emulator = new Emulator(
      props.emulator.id,
      data.abbreviation,
      data.console,
      data.company,
      emulatorFile,
    );
    emulatorService.mutate(newEmulator);
  }  

  return (
    <ModalPopup title={ props.emulator.id === 0 ? "Adicionar Jogo" : "Editar Jogo" }
        isOpen={ props.isOpen } bottomText={ props.bottomText } topText={ props.topText } 
        onCloseRequest={ () => { resetForm(); props.onCloseRequest?.() } }
        className="flex flex-col gap-y-3">
      <form onSubmit={ handleSubmit(onSubmit) }>
        { getAlert(formState, emulatorService) }
        <div className="flex flex-col gap-y-3 min-h-full justify-between">
          <FormControl>
            <FormLabel>Console</FormLabel>
            <input {...register("console", { required: true })} className='input-text'/>
          </FormControl>
          <FormControl>
            <FormLabel>Empresa</FormLabel>
            <input {...register("company", { required: true })} className='input-text' />
          </FormControl>
          <FormControl>
            <FormLabel>Abreviação</FormLabel>             
            <input {...register("abbreviation", { required: true })} className='input-text' />
          </FormControl>
          <div className='flex justify-start items-center gap-x-2'>
            <IonIcon className='min-h-4 min-w-4' icon={ document } />
            <span className="truncate">{ watch("file")?.[0]?.name }</span>
          </div>
          <Button component="label" tabIndex={-1} variant="outlined" color="neutral" startDecorator={ <IonIcon icon={ cloudUploadOutline } /> } >
            Aquivo do Emulador
            <input type="file" className='hidden' {...register("file", { required: true })} />
          </Button>
        </div>
        <input type="submit" disabled={ emulatorService.isLoading } value="Confirmar"
            className={ "btn-r-md bg-primary text-white w-full mt-4" + (emulatorService.isLoading ? " disabled" : "") } />
      </form>
    </ModalPopup>
  );
};

function getAlert(formState: FormState<IEmulatorFormData>, emulatorService: UseMutationResult<any, any, any, any>): JSX.Element | undefined {
  if (formState.errors.console)
    return <Alert color="danger" >Campo console vazío.</Alert>
  if (formState.errors.company)
    return <Alert color="danger" >Campo empresa vazío.</Alert>
  if (formState.errors.abbreviation)
    return <Alert color="danger" >Campo nome vazío.</Alert>
  if (emulatorService.isLoading)
    return <Alert color="warning" >Enviando...</Alert>
  if (emulatorService.isSuccess)
    return <Alert color="success" >Enviado com sucesso!</Alert>
  if (emulatorService.isError)
    return <Alert color="danger" >{ emulatorService.error.message }</Alert>
  return undefined
}
