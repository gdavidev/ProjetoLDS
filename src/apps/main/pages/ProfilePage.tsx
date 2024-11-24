import Category from '@/models/Category';
import CurrentUser from '@/models/CurrentUser';
import { Alert, FormControl } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios'
import { UserUpdateDTO } from '@/models/data/UserDTOs';
import Validation from '@/libs/Validation';
import { AlertInfo, AlertType } from './auth/AuthPage';
import useCurrentUser from '@/hooks/useCurrentUser';
import useAuth from '@/hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import { IonIcon } from '@ionic/react';
import { personOutline, mailOutline } from "ionicons/icons"
import PasswordHiddenToggle from '../components/PasswordHiddenToggle';

interface IUserSignInFormData {
  email: string
  username: string
  password: string
  passwordConfirm: string
}
const defaultValues = {
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',
}

export default function ProfilePage() {
  const [ alertInfo, setAlertInfo ] = useState<AlertInfo | undefined>({type: AlertType.HIDDEN});
  const [ isPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ isPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const [ isLoading              , setIsLoading               ] = useState<boolean>(true);
  const preferencesArr: Category[] = [new Category(0, 'Action'), new Category(0, 'Adventure')];  
  const { user, setUser } = useCurrentUser();
  const { handleSubmit, watch, control, reset: setFormData } = useForm<IUserSignInFormData>({
    defaultValues: defaultValues,
  });
  const fields: IUserSignInFormData = watch();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }

    setFormData({
      email: user.email,
      username: user.userName,
      password: '',
      passwordConfirm: '',
    });
    setIsLoading(false);
  }, [user]);

  const { update } = useAuth({
    onSuccess: (_, dto: UserUpdateDTO) => updateCurrentUser(dto),
    onError: (err: AxiosError | Error) => setAlertInfo(handleRequestError(err)),
    onIsLoading: () => setAlertInfo({ message: "Enviando...", type: AlertType.PROGRESS })
  });

  function updateCurrentUser(dto: UserUpdateDTO) {
    const newUser: CurrentUser = new CurrentUser(
      dto.username || user?.userName!,
      dto.email    || user?.userName!,
      '',
      user?.token!
    );
    setUser(newUser);
    setAlertInfo({ message: "Usuário alterado com sucesso.", type: AlertType.SUCCESS })
  }

  function onSubmit(data: IUserSignInFormData) {
    const error: string | undefined = getErrorMessage(fields);
    if (error) {
      setAlertInfo({ message: error, type: AlertType.ERROR });
      return;
    }
    
    update({
      username: data.username !== user?.userName ? data.username : undefined,
      email: data.email !== user?.email ? data.email : undefined,
      password: data.password !== '' ? data.password : undefined,
      token: user?.token!
    })
  }
  
  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="mx-auto md:w-1/2 w-96 overflow-y-auto rounded-md bg-layout-backgroud">
      <div id="banner" className="bg-primary w-full h-16" />
      <div className='text-white flex flex-col gap-y-3 p-2'>
        <Controller name="username" control={ control } render={ ({field}) => (
          <TextInput {...field} 
              name="Nome de Usuário"
              inputClassName='bg-transparent text-white' 
              inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
              isLoading={isLoading}
              endDecoration={ <IonIcon icon={personOutline} /> } />
        ) }/>
        <Controller name="email" control={ control } render={ ({field}) => (
          <TextInput {...field} 
              name="Email" 
              inputClassName='bg-transparent text-white' 
              inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
              isLoading={isLoading}
              endDecoration={ <IonIcon icon={mailOutline} /> } />
        ) }/>

        <div className='xl:flex md:block gap-3 w-full'>
          <Controller name="password" control={ control } render={ ({field}) => (
            <TextInput {...field} 
                name="Senha" 
                inputClassName='bg-transparent text-white' 
                password={ isPasswordHidden }
                containerClassName='w-full'
                isLoading={isLoading}
                inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
                endDecoration={ 
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden }/> 
                } />
          ) }/>
          <Controller name="passwordConfirm" control={ control } render={ ({field}) => (
            <TextInput {...field} 
                name="Confirmar Senha" 
                inputClassName='bg-transparent text-white' 
                password={ isPasswordConfirmHidden }
                containerClassName='w-full'
                isLoading={isLoading}
                inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
                endDecoration={ 
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordConfirmHidden }/> 
                } />
          ) }/>
        </div>

        <FormControl>              
          <label>Preferencias:</label>
          <div className='flex gap-x-2 gap-y-1 border-b-[1px] border-b-primary w-full pt-2 pb-1'>
            { categoryToChips(preferencesArr) }
          </div>
        </FormControl>
        <div className='w-full flex justify-end'>
          <button className='btn-r-md bg-primary' type='submit'>Atualizar</button>
        </div>
      </div>
      { getAlert(alertInfo) }      
    </form>
  );
}

function getAlert(alertInfo?: AlertInfo) {
  if (alertInfo === undefined || alertInfo.type === AlertType.HIDDEN) 
    return null;

  if (alertInfo.type === AlertType.ERROR)
    return <Alert color='error'>{ alertInfo.message }</Alert>
  if (alertInfo.type === AlertType.PROGRESS)
    return <Alert color='warning'>{ alertInfo.message }</Alert>
  if (alertInfo.type === AlertType.SUCCESS)
    return <Alert color='success'>{ alertInfo.message }</Alert>
}

function categoryToChips(categoryArr: Category[]) {
  return categoryArr.map(cat => <Chip label={cat.name} />);
}

function getErrorMessage(data: IUserSignInFormData): string | undefined {
  if (data.username === '')
    return "Campo nome está vázio.";
  if (data.email === '')
    return "Campo email está vázio.";
  if (data.passwordConfirm !== '' && data.password !== '')
    if (data.password !== data.passwordConfirm)
      return "As senhas não são iguais.";
  if (!Validation.isValidEmail(data.email))
    return "Email inválido.";
  return undefined;
}

function handleRequestError(err: AxiosError | Error): AlertInfo {  
  if (err instanceof AxiosError) {
    switch (err.response?.status) {
      case 401:
      case 400:
        return { message: "Usuário ou senha incorretos.", type: AlertType.ERROR };
      default:
        if (process.env.NODE_ENV === 'development')
          return { message: err.message, type: AlertType.ERROR };        
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(err.stack);
    return { message: err.name +  ": " + err.message, type: AlertType.ERROR };
  }
  
  return { message: "Por favor, tente novamente mais tarde.", type: AlertType.ERROR };
}