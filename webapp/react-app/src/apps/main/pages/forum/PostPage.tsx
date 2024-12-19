import { useLikePost, UseLikePostVariables } from '@/hooks/useLikePost.ts';
import { useCallback, useEffect, useState } from 'react';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import { IonIcon } from '@ionic/react';
import { reload, star } from 'ionicons/icons';
import User from '@models/User.ts';
import DateFormatter from '@libs/DateFormatter.ts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme.ts';
import Comment, { CommentParent } from '@models/Comment.ts';
import TextArea from '@shared/components/formComponents/TextArea.tsx';
import { Controller, useForm } from 'react-hook-form';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import ReportContentModal from '@apps/main/components/modal/ReportContentModal.tsx';
import { ReportContentType } from '@models/Report.ts';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { useCreateComment } from '@/hooks/useComment.ts';
import { useDeletePost, usePost } from '@/hooks/usePosts.ts';
import Loading from '@shared/components/Loading.tsx';
import PostActionBar from '@apps/main/components/PostActionBar.tsx';
import CommentContainer from '@apps/main/components/CommentContainer.tsx';
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';
import useMessageBox from '@/hooks/interaction/useMessageBox.ts';
import useBan from '@/hooks/useBan.ts';

type PostPageParams = {
  postId: string;
}

type CommentFormData = {
  comment: string
}

export default function PostPage() {
  const params = useParams<PostPageParams>();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotification();
  const { openMessageBox } = useMessageBox();
  const { user, askToLogin, forceLogin } = useCurrentUser();
  const { theme } = useTailwindTheme()
  const { exit } = useEmergencyExit();
  const { handleSubmit, control, formState: { errors }, setFocus, reset } =
      useForm<CommentFormData>({
        defaultValues: { comment: '' },
      });
  const [ isReportModalOpen, setIsReportModalOpen ] = useState<boolean>(false);
  const [ reportContentData, setReportContentData ] =
      useState<{type: ReportContentType, id: number}>({
        type: ReportContentType.POST,
        id: 0,
      });

  // Initialization
  useEffect(() => {
    if (params.postId === undefined)
      exit('/forum/feed', 'Post não encontrado');
  }, []);

  // ---- API Calls Setup ----
  const { post, isPostLoading, reFetchPost } = usePost(Number(params.postId), user?.token, {
    onError: (err: AxiosError | Error) => {
      exit('/forum/feed', 'Post não encontrado');
      console.log(err.message)
    }
  });
  const { likePost } = useLikePost(user?.token!, {
    onError: (error: AxiosError | Error, variables: UseLikePostVariables) => {
      variables.post.hasLiked = !variables.newState;
      variables.post.likeCount += !variables.newState ? 1 : -1;
      handleRequestError(error);
    }
  });
  const { deletePost } = useDeletePost(user?.token!, {
    onSuccess: () => {
      notifySuccess('Post deletado');
      navigate('/forum/feed');
    },
    onError: (error: AxiosError | Error) => handleRequestError(error)
  })
  const { createComment } = useCreateComment(user?.token!, {
    onSuccess: async () => {
      notifySuccess('Comentário criado com sucesso!');
      reset({ comment: '' });
      await reFetchPost();
    },
    onError: (error: AxiosError | Error) => handleRequestError(error)
  });
  const { ban } = useBan(user?.token!, {
    onSuccess: () => notifySuccess('Usuário banido com sucesso!'),
    onError: (error: AxiosError | Error) => handleRequestError(error),
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError } = useRequestErrorHandler({
    mappings: [
      { status: 401, onError: () => forceLogin('Seu login expirou, por favor entre novamente') },
      { status: 'default', userMessage: "Por favor tente novamente mais tarde." }
    ],
    onError: (message: string) => notifyError(message)
  });

  // ---- API Executing ----
  const submitComment = useCallback((data: {comment: string}) => {
    if(!post) return
    if(!user) return askToLogin('Para comentar é preciso estar logado.')

    createComment(new Comment(
        { postId: post.id, parentId: null } as CommentParent,
        new User(user.id, user.userName),
        data.comment
    ));
  }, [post, user]);

  // ---- General Callbacks ----
  const handleLikeButtonClick = useCallback(() => {
    if (!post) return

    likePost({
      newState: !post.hasLiked,
      post: post,
    });
    post.hasLiked = !post.hasLiked;
    post.likeCount += post.hasLiked ? 1 : -1;
  }, [post]);

  const handleReportButtonClick =
      useCallback((contentType: ReportContentType, contentId: number) => {
        if (!user)
          return askToLogin('É preciso estar logado para fazer denúncias.');

        setReportContentData({
          type: contentType,
          id: contentId
        });
        setIsReportModalOpen(true);
      }, [user]);

  const handleAnswerButtonClick = useCallback(() => {
    setFocus('comment');
  }, []);

  const handleBanButtonClick = useCallback(() => {
    if (!post) return;

    openMessageBox({
      title: 'Banir Usuário',
      message: 'Tem certeza que deseja banir esse usuário?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          ban(post.owner.id);
      }
    });
  }, [post]);

  const handleExcludeButtonClick = useCallback(() => {
    if (!post) return;

    openMessageBox({
      title: 'Apagar Post',
      message: 'Tem certeza que deseja apagar esse post?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          deletePost(post);
      }
    });
  }, [post]);

  const handleUpdate = useCallback(async () => {
    await reFetchPost();
  }, []);

  if (isPostLoading || !post)
    return <Loading />;
  return(
    <section className='text-white'>
      <div className="flex w-full gap-x-4 items-start">
        <div className="w-16 h-16 overflow-hidden rounded-full">
          <img
              src={ post.owner.profilePic.toDisplayable() }
              className="object-cover h-full min-w-16"
              alt="post-owner" />
        </div>
        <div className="flex flex-col grow">
          <span className="text-lg">{post.owner.name}</span>
          <span className="text-sm text-gray-500">
            Em:
            <Link
                className='ms-[1ch] underline cursor-pointer'
                to={'/forum/feed?search=' + post.category.name}>
              {post.category.name}
            </Link>
          </span>
          <div className="flex flex-col text-sm text-gray-500 lg:flex-row lg:gap-x-3">
            {
              post.updatedDate.getTime() !== post.createdDate.getTime() &&
                <div className="flex items-center gap-x-1">
                  <IonIcon icon={reload} />
                  <span>{DateFormatter.dateToString(post.updatedDate)}</span>
                </div>
            }
            <div className="flex items-center gap-x-1">
              <IonIcon icon={star} />
              <span>{DateFormatter.dateToString(post.createdDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {
        (post.tags && post.tags.length > 0) &&
          <div className='flex gap-x-2 mt-2'>
            { post.tags.map((tag: string, i: number) => (
                <Chip key={ i }  label={ tag }
                    sx={{
                      backgroundColor: theme.colors.primary,
                      color: 'white',
                    }}/> )
              )
            }
          </div>
      }

      <article>
        <h1 className="text-2xl font-bold mt-2">{ post.title }</h1>
        {
          post.image &&
              <div className='w-fit mx-auto mt-2 mb-4 h-[50vh] rounded-md overflow-hidden'>
                <img
                    className='h-full'
                    src={ post.image.toDisplayable() }
                    alt={ post.title } />
              </div>
        }
        <p className='whitespace-pre'>{post.content}</p>
      </article>

      <PostActionBar
            className='mt-8'
            userIsPostOwner={ user?.id === post.owner.id }
            user={ user }
            isLiked={ post.hasLiked }
            likeCount={ post.likeCount }
            commentCount={ post.commentCount }
            onLikeClick={ handleLikeButtonClick }
            onAnswerClick={ handleAnswerButtonClick }
            onReportClick={ () => handleReportButtonClick(ReportContentType.POST, post.id) }
            onBanClick={ handleBanButtonClick }
            onExcludeClick={ handleExcludeButtonClick } />

      <h2 className='text-xl mt-12 font-bold'>Comentários</h2>
      <form
          onSubmit={ handleSubmit(submitComment) }
          className='w-full mb-4'>
        <div className='min-w-full flex items-end gap-x-2 flex-col lg:flex-row'>
          <Controller
              name="comment"
              control={ control }
              rules={{ required: 'Não é possível enviar um comentário vazio.' }}
              render={({ field }) => (
                  <TextArea
                      {...field}
                      name="Comentário"
                      labelClassName='hidden'
                      className={ (errors.comment ? ' bg-red-100 border-red-500' : ' bg-slate-200') } />
              )} />
          <button
              type='submit'
              className='btn-primary h-10'
              disabled={ !!errors.comment }>
            Enviar
          </button>
        </div>
        {
            errors.comment &&
                <span className='text-red-500'>{errors.comment.message}</span>
        }
      </form>

      <CommentContainer
          comments={ post.comments }
          post={ post }
          onReportClick={ (comment: Comment) => handleReportButtonClick(ReportContentType.COMMENT, comment.id) }
          onUpdate={ handleUpdate }
      />

      <ReportContentModal
          contentType={ reportContentData.type }
          contentId={ reportContentData.id }
          isOpen={ isReportModalOpen }
          onCloseRequest={ () => setIsReportModalOpen(false) }
      />
    </section>
  );
}

