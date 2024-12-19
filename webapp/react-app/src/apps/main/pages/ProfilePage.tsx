import CurrentUser from '@/models/CurrentUser';
import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { CurrentUserUpdateDTO } from '@models/data/CurrentUserDTOs.ts';
import Validation from '@/libs/Validation';
import useCurrentUser from '@/hooks/useCurrentUser';
import useAuth from '@/hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import { IonIcon } from '@ionic/react';
import { mailOutline, personOutline } from 'ionicons/icons';
import PasswordHiddenToggle from '../components/PasswordHiddenToggle';
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview.tsx';
import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp';
import FileUtil from '@libs/FileUtil.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import useMessageBox from '@/hooks/interaction/useMessageBox.ts';
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';
import { useNavigate } from 'react-router-dom';

type UserProfileFormData = {
  email: string
  username: string
  password: string
  passwordConfirm: string
  profilePic: Thumbnail,
}

export default function ProfilePage() {
  const { alertElement, info, error, success } = useAlert();
  const { notifySuccess } = useNotification();
  const { openMessageBox } = useMessageBox();
  const [ isPasswordHidden       , setIsPasswordHidden        ] = useState<boolean>(true);
  const [ isPasswordConfirmHidden, setIsPasswordConfirmHidden ] = useState<boolean>(true);
  const { user, setUser, logout } = useCurrentUser();
  const navigate = useNavigate();
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
  }, []);

  useEffect(() => {
    if (!user)
      exit('/log-in', 'É preciso estar logado para acessar essa página')
  }, []);

  // ---- API Calls Setup ----
  const { update, deleteAccount } = useAuth({
    onUpdate: {
      onSuccess: (_, dto: CurrentUserUpdateDTO) => updateCurrentUser(dto),
      onError: (err: AxiosError | Error) => handleRequestError(err),
    },
    onDelete: {
      onSuccess: () => deleteCurrentUser(),
      onError: (err: AxiosError | Error) => handleRequestError(err),
    },
    onIsLoading: () => info("Enviando..."),
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{
        status: 400,
        userMessage: (resData: any) =>
            resData['imagem_perfil'] ?
                'Arquivo de imagem enviado deve ser to tipo JPG ou PNG' :
                'Por favor tente novamente mais tarde.'
      }, {
        status: 401,
        userMessage: 'Por favor faça o login novamente',
        onError: (message: string) => {
          logout();
          exit('/log-in', message);
        }
      }, {
        status: 'default',
        userMessage: 'Por favor tente novamente mais tarde.',
        onError: (message: string) => error(message)
    }]
  });

  // ---- API Executing ----
  const onSubmit = useCallback((data: UserProfileFormData) => {
    update({
      username: data.username !== user?.userName ? data.username : undefined,
      email: data.email !== user?.email ? data.email : undefined,
      password: data.password !== '' ? data.password : undefined,
      token: user?.token!,
      imagem_perfil: data.profilePic.file ?? undefined,
    });
  }, [user]);

  const onDeleteUser = useCallback(() => {
    if (!user) return;

    openMessageBox({
      title: 'Apagar conta',
      message: 'Você tem certeza que deseja apagar sua conta?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          deleteAccount({
            user_id: user.id,
            token: user.token
          })
      }
    })
  }, [user])

  // ---- Updating Session ----
  const updateCurrentUser = useCallback(async (dto: CurrentUserUpdateDTO) => {
    if (!user)
      return exit('/', 'Por favor faça o login novamente')

    setUser(new CurrentUser(
        user.id,
        dto.username || user.userName,
        user.token,
        dto.email    || user.email,
        user.role,
        dto.imagem_perfil ?
            new Thumbnail({ base64: await FileUtil.fileToBase64(dto.imagem_perfil) }) :
            user.profilePic,
    ));
    success("Usuário alterado com sucesso.")
  }, [user]);

  const deleteCurrentUser = useCallback(() => {
    logout();
    notifySuccess('Usuário deletado com sucesso');
    navigate('/log-in');
  }, [])

  // ---- Error handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message) error(formError.message);
  }, [watch()]);
  
  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="mx-auto md:w-1/2 w-96 overflow-y-auto rounded-md bg-layout-background">
      <div id="banner" className="bg-primary w-full h-24 px-4 pt-2 mb-10">
        <FileInputImagePreview
            rounded={true}
            thumbnail={ getValues('profilePic') }
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
          rules={{ required: 'Nome de usuário não pode ser vázio.' }}
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
          rules={{ required: 'Email não pode ser vázio.' }}
          render={ ({field}) => (
            <TextInput {...field}
              name="Email"
              inputClassName='bg-transparent text-white outline-none'
              inputContainerClassName="bg-transparent border-b-primary border-b-[1px]"
              endDecoration={ <IonIcon icon={mailOutline} /> } />
        ) }/>

        <div className='xl:flex flex-col md:flex-row gap-3 w-full'>
          <Controller
            name="password"
            control={ control }
            rules={{
              validate: (value: string) => {
                if (value !== '')
                  return Validation.isValidPassword(value) || "A senha não esta em um formato inválido"
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
                  return (getValues('password') === value) || "As senhas não são iguais"
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
        <div className='w-full flex gap-x-3 justify-end'>
          <button
              className='btn-r-md bg-red-500'
              type='button'
              onClick={ onDeleteUser }>
            Apagar Conta
          </button>
          <button
              className='btn-primary'
              type='submit'>
            Atualizar
          </button>
        </div>
      </div>
      { alertElement }
    </form>
  );
}