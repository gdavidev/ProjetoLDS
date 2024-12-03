import TextArea from '@/apps/shared/components/formComponents/TextArea';
import TextInput from '@/apps/shared/components/formComponents/TextInput';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useStorePost } from '@/hooks/usePosts';
import Category from '@/models/Category';
import Post from '@/models/Post';
import SelectInput, { SelectInputSource } from '@apps/shared/components/formComponents/SelectInput';
import { Alert } from '@mui/material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type PostCreateFormData = {
  categoryId: number,
  title: string,
  content: string
}
const defaultValues: PostCreateFormData = {
  categoryId: -1,
  title: '',
  content: '',
}

export default function PostCreate() {
  const [ categorySelectSource, setCategorySelectSource ] = useState<SelectInputSource>([])
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { handleSubmit, control, formState: { errors } } = useForm<PostCreateFormData>({
    defaultValues: defaultValues
  });
  
  useCategories(CategoryType.POSTS, {
    onSuccess: (categories: Category[]) => {
      const source = categories.map(cat => ({ value: cat.id, name: cat.name }));
      setCategorySelectSource(source);
    },
    onError: (err: AxiosError | Error) => alert(err.message)
  });

  const { mutate: createPost, error: mutateError, isLoading, isSuccess, isError } =
    useStorePost(user?.token!, {
      onSuccess: (post: Post) => navigate('/forum/post/' + post.id),
      onError: (err: AxiosError | Error) => alert(err.message)
    });

  function submit(data: PostCreateFormData) {
    const newPost = new Post();
    newPost.title = data.title
    newPost.content = data.content

    createPost(newPost);
  }

  function getAlert(): JSX.Element | undefined {
    const formError = Object.values(errors).find(err => err.message !== undefined)
    if (formError !== undefined)
      return <Alert severity="error">{ formError.message }</Alert>
    if (isLoading)
      return <Alert severity="info">Enviando...</Alert>
    if (isSuccess)
      return <Alert severity="success">Enviado com sucesso!</Alert>
    if (isError)
      return <Alert severity="error">{ mutateError.message }</Alert>
    return undefined
  }

  return (
    <section className="mx-auto w-2/3">
      <h1 className="text-white text-xl font-bold">Novo Post</h1>
      <form onSubmit={ handleSubmit(submit) } className="flex flex-col gap-y-4 mx-8">
        <div className="flex gap-x-5 w-full">        
          <Controller name="title" control={ control }
              rules={{ required: 'É necessário especificar um Titulo.' }}
              render={ ({field}) => (
                <TextInput {...field} 
                    name="Título"   
                    containerClassName="w-full"
                    labelClassName="text-white"               
                    inputClassName={ 'input-text ' + (errors.title ? ' bg-red-100 border-red-500' : ' bg-slate-200') }
                    inputContainerClassName="rounded-md overflow-hidden" />
              ) }/>
          <Controller name="categoryId" control={ control }
              rules={{ validate: (value) => value > -1 || 'É necessário especificar uma Categoria.' }}
              render={ ({field}) => (
                <SelectInput {...field}
                    name="Categoria"
                    source={ categorySelectSource } hasSelectOption
                    containerClassName='flex flex-col'  
                    labelClassName="text-white"                  
                    className={ 'input-text ' + (errors.categoryId ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
            ) }/>
        </div>
        <Controller name="content" control={ control }
            rules={{ required: 'É necessário especificar algum conteúdo.' }}
            render={ ({field}) => (
              <TextArea {...field} 
                  name="Conteúdo"
                  labelClassName="text-white"  
                  className={ 'input-text' + (errors.content ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
            ) }/>
        { getAlert() }
        <div className="flex justify-end">
          <input value="Confirmar" type="submit"
              className={ "btn-r-md mt-3 bg-primary text-white" + (isLoading ? " disabled" : "") }            
              disabled={ isLoading } />
        </div>
      </form>
    </section>
  )
}