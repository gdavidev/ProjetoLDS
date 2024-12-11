import TextArea from '@/apps/shared/components/formComponents/TextArea';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useCreatePost } from '@/hooks/usePosts';
import Category from '@/models/Category';
import Post from '@/models/Post';
import SelectInput, { SelectInputSource } from '@apps/shared/components/formComponents/SelectInput';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAlert from '@/hooks/feedback/useAlert.tsx';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import TagPicker from '@shared/components/formComponents/TagPicker.tsx';
import FileInputImagePreview from '@shared/components/formComponents/FileInputImagePreview.tsx';
import FileInput from '@shared/components/formComponents/FileInput.tsx';
import Thumbnail from '@models/utility/Thumbnail.ts';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';

type PostCreateFormData = {
  categoryId: number,
  title: string,
  content: string
  tags: string[]
  image?: Thumbnail
}

export default function PostCreate() {
  const [ categorySelectSource, setCategorySelectSource ] = useState<SelectInputSource>([])
  const { alertElement, error, info } = useAlert();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { exit } = useEmergencyExit();
  const { handleSubmit, watch, control, formState: { errors }, getValues } = useForm<PostCreateFormData>({
    defaultValues: {
      categoryId: -1,
      title: '',
      content: '',
      tags: [],
      image: undefined
    }
  });
  const fields = watch()

  // ---- Initialization ----
  useEffect(() => {
    if (!user)
      exit('/log-in', 'É preciso estar logado para criar posts.')
  }, [])

  const { data: categories } = useCategories(CategoryType.POSTS, {
    onSuccess: (categories: Category[]) => {
      const source = categories.map(cat => ({ value: cat.id, name: cat.name }));
      setCategorySelectSource(source);
    },
    onError: (err: AxiosError | Error) => alert(err.message)
  });

  // ---- API Calls Setup ----
  const { mutate: createPost, isLoading } = useCreatePost(user?.token!, {
    onSuccess: (post: Post) => {
      notifySuccess('Post criado com sucesso!');
      navigate('/forum/post/' + post.id);
    },
    onError: (err: AxiosError | Error) => handleRequestError(err)
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
    onError: (message: string) => error(message)
  });

  // ---- API Executing ----
  const submit = useCallback((data: PostCreateFormData) => {
    if (!user || !categories) return

    createPost({
      titulo: data.title,
      descricao: data.content,
      id_categoria: data.categoryId,
      id_user: user.id,
      tags: data.tags,
      img_topico: data.image?.file ?? undefined
    });
  }, []);

  // ---- Watch for state changes ----
  useEffect(() => {
    if (isLoading) info("Enviando...")
  }, [isLoading]);

  // ---- Form Error Handling ----
  useEffect(() => {
    const formError =
        Object.values(errors).find(err => err.message !== undefined)
    if (formError && formError.message)
      error(formError.message);
  }, [fields]);

  return (
    <section className="mx-auto w-4/5">
      <h1 className="text-white text-xl font-bold">Novo Post</h1>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-4 mx-8">
        <div className="flex gap-x-5 w-full">
          <Controller
              name="title"
              control={control}
              rules={{ required: 'É necessário especificar um Titulo.' }}
              render={({ field }) => (
                  <TextInput {...field}
                       name="Título"
                       containerClassName="w-full"
                       labelClassName="text-white"
                       inputClassName={'input-text ' + (errors.title ? ' bg-red-100 border-red-500' : ' bg-slate-200')}
                       inputContainerClassName="rounded-md overflow-hidden" />
              )} />
          <Controller
              name="categoryId"
              control={control}
              rules={{ validate: (value) => value > -1 || 'É necessário especificar uma Categoria.' }}
              render={({ field }) => (
                  <SelectInput {...field}
                       name="Categoria"
                       source={categorySelectSource} hasSelectOption
                       containerClassName='flex flex-col'
                       labelClassName="text-white"
                       className={'input-text ' + (errors.categoryId ? ' bg-red-100 border-red-500' : ' bg-slate-200')} />
              )} />
        </div>
        <Controller
            name="content"
            control={ control }
            rules={{ required: 'É necessário especificar algum conteúdo.' }}
            render={({ field }) => (
                <TextArea {...field}
                    name="Conteúdo"
                    labelClassName="text-white"
                    className={'input-text' + (errors.content ? ' bg-red-100 border-red-500' : ' bg-slate-200')} />
            )} />

        <Controller
            name="tags"
            control={control}
            rules={{ required: 'É necessário escolher pelo menos uma tag.' }}
            render={({ field }) => (
                <TagPicker
                    {...field}
                    name={'Tags'}
                    labelClassName="text-white"
                />
            )} />

        <div className="flex flex-col gap-y-3 justify-between items-center">
          <FileInputImagePreview
              thumbnail={ getValues('image') }
              className={ getValues('image') ? '' : 'hidden' }
              imgClassName="h-[300px] max-w-[300px]" />
          <Controller
              name="image"
              control={control}
              render={({ field }) => (
                  <FileInput
                      {...field}
                      buttonText="Imagem do seu Post"
                      onChange={(e) => field.onChange(e ? new Thumbnail({ file: e[0] }) : undefined)}
                      error={errors.image !== undefined}
                      accept="image/*" />
              )} />
        </div>

        {alertElement}
        <div className="flex justify-end">
          <input
             value="Confirmar"
             type="submit"
             className={"btn-r-md mt-3 bg-primary text-white" + (isLoading ? " disabled" : "")}
             disabled={isLoading} />
        </div>
      </form>
    </section>
  )
}