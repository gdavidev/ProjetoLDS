import { MainContext, MainContextProps } from '@/apps/shared/context/MainContextProvider';
import Category from '@/models/Category';
import CurrentUser from '@/models/User';
import { Alert, FormControl } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios'
import UserApiClient from '@/api/UserApiClient';
import { UserUpdateDTO } from '@/models/UserDTOs';
import Validation from '@/libs/Validation';
import { AlertInfo, AlertType } from './authentication/AuthPage';

export default function ProfilePage() {
  const [ alertInfo, setAlertInfo ] = useState<AlertInfo | undefined>(undefined);
  const [ user     , setUser      ] = useState<CurrentUser | undefined>(undefined);
  const mainContext: MainContextProps = useContext(MainContext);
  const preferencesArr: Category[] = [new Category(0, 'Action'), new Category(0, 'Adventure')];
  const nameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const confirmPasswordInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);  
  
  useLayoutEffect(() => {
    setAlertInfo({ type: AlertType.HIDDEN })  
    mainContext.onUserAuth.subscribe(setUser);
  }, []);
  useEffect(() => {
    setUser(mainContext.currentUser);
    return mainContext.onUserAuth.remove(setUser) // Cleanup code
  }, []);

  const { isLoading, mutate } = useMutation('UPDATE_USER', 
    async (dto: UserUpdateDTO) => {
      const userApiClient: UserApiClient = new UserApiClient();
      return userApiClient.update(dto, user?.token!)
    }, {
      onSuccess: (_, dto: UserUpdateDTO) => {
        const newUser: CurrentUser = new CurrentUser(
          dto.username || user?.userName!,
          dto.email    || user?.userName!,
          '',
          user?.token!
        );
        mainContext.setCurrentUser?.(newUser);
        setAlertInfo({ message: "Usuário alterado com sucesso.", type: AlertType.SUCCESS })
      },
      onError: (err: AxiosError | Error) => setAlertInfo(handleRequestError(err))
    })

    useEffect(() => {
      if (isLoading)
        setAlertInfo({ message: "Enviando...", type: AlertType.PROGRESS })
    }, [isLoading])

  function handleUpdateSubmit() {
    const dto: UserUpdateDTO = {
      username: nameInput.current?.value,
      email: emailInput.current?.value,
      password: passwordInput.current?.value,      
    }

    const dtoValidate: UserUpdateDTO & { confirmPassword?: string } =
        {...dto, confirmPassword: confirmPasswordInput.current?.value,}
    const errorMessage: string = getErrorMessageIfNotValid(dtoValidate);
    if (errorMessage) {
      setAlertInfo({ message: errorMessage, type: AlertType.ERROR })
      return;
    }
    mutate(dto);
  }

  function getAlert() {
    if (alertInfo === undefined || alertInfo.type === AlertType.HIDDEN) 
      return null;

    if (alertInfo.type === AlertType.ERROR)
      return <Alert color='danger'>{ alertInfo.message }</Alert>
    if (alertInfo.type === AlertType.PROGRESS)
      return <Alert color='warning'>{ alertInfo.message }</Alert>
    if (alertInfo.type === AlertType.SUCCESS)
      return <Alert color='success'>{ alertInfo.message }</Alert>
  }

  if (!user) {
    return "Loading..."
  }

  return(
    <div className="mx-auto w-1/3 overflow-y-auto rounded-md bg-layout-backgroud">
      <div id="banner" className="bg-primary w-full h-16" />
      <div className='text-white flex flex-col gap-y-3 p-2'>
        <FormControl>
          <label htmlFor='name'>Nome:</label>
          <input ref={ nameInput } type='text' name='name' defaultValue={ user.userName }
              className='border-b-[1px] border-b-primary bg-transparent pt-2 pb-1 outline-none focus:border-b-4' />
        </FormControl>
        <FormControl>
          <label htmlFor='name'>Email:</label>
          <input ref={ emailInput } type='text' defaultValue={ user.email } 
              className='border-b-[1px] border-b-primary bg-transparent pt-2 pb-1 outline-none focus:border-b-4' />
        </FormControl>
        <div className='flex gap-3 w-full'>
          <FormControl sx={{width: '100%'}}>              
            <label htmlFor='name'>Senha:</label>
            <input ref={ passwordInput } type='text' 
                className='border-b-[1px] border-b-primary bg-transparent pt-2 pb-1 outline-none focus:border-b-4' />
          </FormControl>
          <FormControl sx={{width: '100%'}}>              
            <label htmlFor='name'>Confirmar Senha:</label>
            <input ref={ confirmPasswordInput } type='text' 
                className='border-b-[1px] border-b-primary bg-transparent pt-2 pb-1 outline-none focus:border-b-4' />
          </FormControl>
        </div>
        <FormControl>              
          <label htmlFor='name'>Preferencias:</label>
          <div className='flex gap-x-2 gap-y-1 border-b-[1px] border-b-primary w-full pt-2 pb-1'>
            { categoryToChips(preferencesArr) }
          </div>
        </FormControl>
        <div className='w-full flex justify-end'>
          <button className='btn-r-md bg-primary' onClick={ handleUpdateSubmit }>Atualizar</button>
        </div>
      </div>
      { getAlert() }      
    </div>
  );
}

function categoryToChips(categoryArr: Category[]) {
  return categoryArr.map(cat => 
    <Chip>{cat.name}</Chip>);
}

function getErrorMessageIfNotValid(dto: UserUpdateDTO & { confirmPassword?: string }) {
  // if (!dto.email)
  //   return "Campo email está vázio.";
  // if (!dto.username)
  //   return "Campo nome está vázio.";
  // if (!Validation.isValidEmail(dto.email))
  //   return "Email inválido.";
  return "";
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