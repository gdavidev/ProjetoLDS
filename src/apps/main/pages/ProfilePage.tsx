import Category from '@/models/Category';
import CurrentUser from '@/models/CurrentUser';
import { FormControl } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios'
import { UserUpdateDTO } from '@/models/data/UserDTOs';
import Validation from '@/libs/Validation';
import useCurrentUser from '@/hooks/useCurrentUser';
import useAuth from '@/hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import { IonIcon } from '@ionic/react';
import { personOutline, mailOutline } from 'ionicons/icons';
import PasswordHiddenToggle from '../components/PasswordHiddenToggle';
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview.tsx';
import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/media/user-image-not-found.webp'
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme.ts';

type UserProfileFormData = {
  email: string
  username: string
  password: string
  passwordConfirm: string
  profilePic: Thumbnail,
}

export default function ProfilePage() {
  const { alertElement, info, error, success } = useAlert();
  const [ isPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ isPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const preferencesArr: Category[] = [new Category(0, 'Action'), new Category(0, 'Adventure')];  
  const { user, setUser, logout } = useCurrentUser();
  const { handleSubmit, register, setValue, watch, control, reset: setFormData, formState: { errors }, getValues } =
    useForm<UserProfileFormData>({
      defaultValues: {
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
        profilePic: new Thumbnail({ url: userImageNotFound })
      },
    });
  const fields: UserProfileFormData = watch();
  const { exit } = useEmergencyExit()

  // ---- Initialization ----
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        username: user.userName,
        password: '',
        passwordConfirm: '',
        profilePic: user.profilePic,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user)
      exit('/log-in', 'É preciso estar logado para acessar essa página')
  }, []);

  // ---- API Calls Setup ----
  const { update } = useAuth({
    onSuccess: (_, dto: UserUpdateDTO) => updateCurrentUser(dto),
    onError: (err: AxiosError | Error) => handleRequestError(err),
    onIsLoading: () => info("Enviando...")
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError } = useRequestErrorHandler({
    mappings: [
      { status: 400, userMessage: "Usuário ou senha incorretos." },
      { status: 401, userMessage: 'Por favor faça o login novamente' },
      { status: 'default', userMessage: "Por favor tente novamente mais tarde." }
    ],
    onError: (message: string, cause: number | number[] | string) => {
      if (cause === 401) {
        logout();
        exit('/log-in', message);
      } else {
        error(message);
      }
    }
  });

  // ---- API Executing ----
  function onSubmit(data: UserProfileFormData) {
    update({
      username: data.username !== user?.userName ? data.username : undefined,
      email: data.email !== user?.email ? data.email : undefined,
      password: data.password !== '' ? data.password : undefined,
      token: user?.token!,
      imagem_perfil: data.profilePic.file ?? undefined,
    })
  }

  // ---- Updating Session ----
  const updateCurrentUser = useCallback((dto: UserUpdateDTO) => {
    setUser(new CurrentUser(
        dto.username || user!.userName,
        user!.token,
        dto.email    || user!.email,
        user!.role,
        new Thumbnail({ file: dto.imagem_perfil }),
    ));
    success("Usuário alterado com sucesso.")
  }, [user]);

  // ---- Error handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message) error(formError.message);
  }, [fields]);
  
  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="mx-auto md:w-1/2 w-96 overflow-y-auto rounded-md bg-layout-background">
      <div id="banner" className="bg-primary w-full h-24 px-4 pt-2 mb-10">
        <FileInputImagePreview
            rounded={true}
            thumbnail={ watch('profilePic') }
            className='w-[130px] absolute'
            imgClassName="h-[130px] max-w-[130px]" />
        <label className='text-white ms-[140px] mt-16 hover:underline absolute cursor-pointer'>
          Mudar imagem
          <input
              { ...register('profilePic', {
                  onChange: (e) => e !== undefined ?
                      setValue('profilePic', new Thumbnail({ file: e.target.files[0] })) :
                      setValue('profilePic', new Thumbnail({ url: userImageNotFound })),
              })}
              type="file"
              accept="image/*"
              className="hidden" />
        </label>
      </div>
      <div className='text-white flex flex-col gap-y-3 p-2'>
        <Controller
          name="username"
          control={ control }
          render={ ({field}) => (
            <TextInput {...field}
              name="Nome de Usuário"
              inputClassName='bg-transparent text-white outline-none'
              inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
              endDecoration={ <IonIcon icon={personOutline} /> } />
        ) }/>
        <Controller
          name="email"
          control={ control }
          render={ ({field}) => (
            <TextInput {...field}
              name="Email"
              inputClassName='bg-transparent text-white outline-none'
              inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
              endDecoration={ <IonIcon icon={mailOutline} /> } />
        ) }/>

        <div className='xl:flex md:block gap-3 w-full'>
          <Controller
            name="password"
            control={ control }
            rules={{
              validate: (value: string) => {
                if (value !== '')
                  return !Validation.isValidPassword(value) || "Senha inválida"
              }
            }}
            render={ ({field}) => (
              <TextInput {...field}
                name="Senha"
                inputClassName='bg-transparent text-white outline-none'
                password={ isPasswordHidden }
                containerClassName='w-full'
                inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
                endDecoration={
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordHidden }/>
              } />
          ) }/>
          <Controller
            name="passwordConfirm"
            control={ control }
            rules={{
              validate: (value: string) => {
                if (getValues('password') !== '')
                  return (getValues('password') !== value) || "As senhas não são iguais"
              }
            }}
            render={ ({field}) => (
              <TextInput {...field}
                name="Confirmar Senha"
                inputClassName='bg-transparent text-white outline-none'
                password={ isPasswordConfirmHidden }
                containerClassName='w-full'
                inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
                endDecoration={
                  <PasswordHiddenToggle initialState={ true } onChange={ setIsPasswordConfirmHidden }/>
                } />
          ) }/>
        </div>

        <FormControl>              
          <label>Preferências:</label>
          <div className='flex gap-x-2 gap-y-1 border-b-[1px] border-b-primary w-full pt-2 pb-1'>
            { categoryToChips(preferencesArr) }
          </div>
        </FormControl>
        <div className='w-full flex justify-end'>
          <button className='btn-r-md bg-primary' type='submit'>Atualizar</button>
        </div>
      </div>
      { alertElement }
    </form>
  );
}

function categoryToChips(categoryArr: Category[]) {
  const { theme } = useTailwindTheme()

  return categoryArr.map((cat, i) =>
      <Chip
          key={i}
          label={cat.name}
          sx={{
            color: 'white',
            backgroundColor: theme.colors.primary
      }} />
  );
}