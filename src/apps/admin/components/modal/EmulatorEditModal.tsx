import { useState, useContext, FormEvent, useEffect } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Alert } from '@mui/joy';
import FileInput from '@shared/components/formComponents/FileInput';
import { IonIcon } from '@ionic/react'
import { document } from 'ionicons/icons'
import { useMutation } from 'react-query';
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import ModalPopup, { ModalPopupProps } from '@/apps/shared/components/ModalPopup';
import Emulator from '@/models/Emulator';
import EmulatorApiClient from '@/api/EmulatorApiClient';

enum FormMode {
  ADD,
  EDIT
}
export type EmulatorEditModalProps = {
  emulator: Emulator,
  onChange?: (newEmulator: Emulator) => void
} & ModalPopupProps
type EmulatorModalFormData = {
  company: string,
  console: string,
  abbreviation: string,
  file?: File,
}

export default function EmulatorEditModal(props: EmulatorEditModalProps) {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const [ errorMessage , setErrorMessage ] = useState<string>("");
  const [ fileName     , setFileName     ] = useState<string>("");
  const [ formData     , setFormData     ] = useState<EmulatorModalFormData>(getEmptyFormData());
  const [ formMode     , setFormMode     ] = useState<FormMode>(FormMode.ADD);

  function getEmptyFormData(): EmulatorModalFormData {
    return {company: "", console: "", abbreviation: ""}
  }

  useEffect(() => {
    if (props.isOpen === false) return;
    setFormMode(props.emulator.id === 0 ? FormMode.ADD : FormMode.EDIT)

    if (props.emulator.id !== 0) {
      setFormData({
        company: props.emulator.companyName,
        console: props.emulator.console,
        abbreviation: props.emulator.abbreviation,
        file: new File([], props.emulator.file.name)
      });
    } else { 
      setFormData(getEmptyFormData());
      setFileName("");
    }
  }, [props.isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files !== null ? files[0] : value,
    }));
  };
  
  const {isLoading, isSuccess, isError, mutate, error: mutateError, reset: resetMutationResults} = 
    useMutation('mutate-emulator',
      async (emulator: Emulator) => {
        const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient(mainContext.currentUser?.token!);
        return await emulatorApiClient.store(emulator);
      },
      {
        onSuccess: async (_, emulator: Emulator) => props.onChange?.(emulator),
        onError: async (err: any) => console.log("err: " + JSON.stringify(err)),
      }
    );

  function resetForm() {
    resetMutationResults();    
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const error: string | undefined = getErrorOnValidateGameForm()    
    if (errorMessage)  {
      setErrorMessage(error);
      return
    }
    
    const newEmulator: Emulator = new Emulator(
      props.emulator.id,
      formData.abbreviation,
      formData.console,
      formData.company,
      formData.file,
    );
    
    mutate(newEmulator);
  }
  
  function getErrorOnValidateGameForm(): string {
    if (formData.console === "") return "Campo console vazío."
    if (formData.company === "") return "Campo empresa vazío."
    if (formData.abbreviation === "") return "Campo nome vazío."
    if (formMode === FormMode.ADD && formData.file === undefined) return "Nenhum arquivo enviado.";
    return ""
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
    <ModalPopup title={ props.emulator.id === 0 ? "Adicionar Jogo" : "Editar Jogo" }
        isOpen={ props.isOpen } bottomText={ props.bottomText } topText={ props.topText } 
        onCloseRequest={ () => { resetForm(); props.onCloseRequest?.() } }
        className="flex flex-col gap-y-3">
      <form onSubmit={ handleSubmit }>
        { getAlert() }
        <div className="flex flex-col gap-y-3 min-h-full justify-between">
          <FormControl>
            <FormLabel>Console</FormLabel>
            <input type='text' name='console' className='input-text' onChange={ handleChange }
                defaultValue={ props.emulator?.console } />
          </FormControl>
          <FormControl>
            <FormLabel>Empresa</FormLabel>
            <input type='text' name='company' className='input-text' onChange={ handleChange }
                defaultValue={ props.emulator?.companyName } />
          </FormControl>
          <FormControl>              
            <FormLabel>Abreviação</FormLabel>             
            <input type='text' name='abbreviation' className='input-text' onChange={ handleChange }
                defaultValue={ props.emulator?.abbreviation } />
          </FormControl>
          <div className='flex justify-start items-center gap-x-2'>
            <IonIcon className='min-h-4 min-w-4' icon={ document } />
            <span className="truncate">
                { fileName }
            </span>
          </div>
          <FileInput id='file' onChange={ (e) => { setFileName(e.target.files?.item(0)?.name!); handleChange(e) } }
              buttonText='Upload File' />
        </div>
        <input type="submit" disabled={ isLoading } value="Confirmar"
            className={ "btn-r-md bg-primary text-white w-full mt-4" + (isLoading ? " disabled" : "") } />
      </form>
    </ModalPopup>
  );
};
