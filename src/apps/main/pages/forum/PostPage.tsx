import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';
import { useLikePost } from '@/hooks/useLikePost.ts';
import React, { useCallback, useState } from 'react';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import { IonIcon } from '@ionic/react';
import {
  chatbubbleOutline,
  flagOutline,
  hammerOutline,
  reload,
  star,
  trashOutline,
  heart,
  heartOutline,
} from 'ionicons/icons';
import User from '@models/User.ts';
import DateFormatter from '@libs/DateFormatter.ts';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import useTailwindTheme from '@/hooks/configuration/useTailwindTheme.ts';
import Comment, { CommentParent, CommentParentType } from '@models/Comment.ts';
import CommentRow from '@apps/main/components/CommentRow.tsx';
import TextArea from '@shared/components/formComponents/TextArea.tsx';
import { Controller, useForm } from 'react-hook-form';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import ReportContentModal from '@apps/main/components/modal/ReportContentModal.tsx';
import { ReportContentType } from '@models/Report.ts';
import { AxiosError } from 'axios';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { useCreateComment } from '@/hooks/useComment.ts';
import Post from '@models/Post.ts';
import Category from '@models/Category.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';
import CurrentUser from '@models/CurrentUser.ts';
import { Role } from '@/hooks/usePermission.ts';

type PostPageParams = {
  postId: number;
}

export default function PostPage() {
  const [ liked            , setLiked             ] = useState<boolean>(false);
  const [ isReportModalOpen, setIsReportModalOpen ] = useState<boolean>(false);
  const { notifyError } = useNotification();
  const { user, askToLogin } = useCurrentUser();
  const { params }  = useTypeSafeSearchParams<PostPageParams>();
  const { theme } = useTailwindTheme()
  const { exit } = useEmergencyExit();
  const { handleSubmit, control, formState: { errors } } =
      useForm<{ comment: string }>({
        defaultValues: { comment: '' },
      });
  const [ reportContentData, setReportContentData ] =
      useState<{type: ReportContentType, id: number}>({
        type: ReportContentType.POST,
        id: 0
      });

  // Initialization
  // useEffect(() => {
  //   if (params.postId === undefined)
  //     exit('/forum/feed', 'Post não encontrado');
  // }, []);

  // ---- API Calls Setup ----
  const { mutate: likePost } = useLikePost({
    onError: (error: AxiosError | Error) => handleRequestError(error)
  });
  // const { post, isPostLoading } = usePost(params.postId, {
  //   onError: (err: AxiosError | Error) => {
  //     exit('/forum/feed', 'Post não encontrado');
  //     console.log(err.message) }
  // });
  const { createComment } = useCreateComment({
    onError: (error: AxiosError | Error) => handleRequestError(error)
  });

  // ---- API Calls Error Handling ----
  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde." }],
    onError: (message: string) => notifyError(message)
  });

  // ---- API Executing ----
  const submitComment = useCallback((data: {comment: string}) => {
    if(!post) return
    if(!user) return askToLogin('Para comentar é preciso estar logado.')

    createComment(new Comment(
        { id: post.id, type: CommentParentType.POST } as CommentParent,
        new User(user.id, user.userName),
        data.comment
    ));
  }, []);

  // ---- General Callbacks ----
  const handleLikeButtonClick = useCallback(() => {
    setLiked(li => !li);
  }, []);

  const handleReportButtonClick =
      useCallback((contentType: ReportContentType, contentId: number) => {
        setReportContentData({
          type: contentType,
          id: contentId
        });
        setIsReportModalOpen(true);
      }, []);

  const handleAnswerButtonClick = useCallback(() => {

  }, []);

  const handleBanButtonClick = useCallback(() => {

  }, []);

  const handleExcludeButtonClick = useCallback(() => {

  }, []);


  // if (isPostLoading || !post)
  //   return <Loading />;
  return(
    <section className='text-white'>
      <div className="flex w-full gap-x-4 items-start">
        <div className="max-w-16 max-h-16 overflow-hidden rounded-full">
          <img
              src={post.owner.profilePic.toDisplayable()}
              className="object-cover h-full"
              alt="post-owner" />
        </div>
        <div className="flex flex-col grow">
          <span className="text-lg">{post.owner.name}</span>
          <span className="text-sm text-gray-500">
            Em:
            <Link
                className='ms-[1ch] underline cursor-pointer'
                to={'/forum/feed?categoryId=' + post.category.id}>
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
        <p>{post.content}</p>
      </article>

      <PostActionBar
          className='mt-8'
          userIsPostOwner={ user?.id === post.owner.id }
          user={ user }
          isLiked={ liked }
          onLikeClick={ handleLikeButtonClick }
          onAnswerClick={ handleAnswerButtonClick }
          onReportClick={ () => handleReportButtonClick(ReportContentType.POST, post.id) }
          onBanClick={ handleBanButtonClick }
          onExcludeClick={ handleExcludeButtonClick } />

      <h2 className='text-xl mt-12 font-bold'>Comentários</h2>
      <form
          onSubmit={ handleSubmit(submitComment) }
          className='min-w-full flex items-end gap-x-2 flex-col lg:flex-row mb-4'>
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
        <button type='submit' className='btn-r-md h-10 bg-primary text-white'>
          Enviar
        </button>
      </form>

      <div className='flex flex-col mt-2'>
        {
          mockCommentList.map((com: Comment, i: number) => (
              <CommentRow
                  key={ i }
                  userIsPostOwner={ user ? post.owner.id === user.id : false }
                  userIsCommentOwner={ user ? com.owner.id === user.id : false }
                  comment={ com }
                  onReportClick={ handleReportButtonClick }
              />
          ))
        }
      </div>

      <ReportContentModal
          contentType={ reportContentData.type }
          contentId={ reportContentData.id }
          isOpen={ isReportModalOpen }
          onCloseRequest={ () => setIsReportModalOpen(false) }
      />
    </section>
  );
}

type PostActionBarProps = {
  userIsPostOwner: boolean;
  user: CurrentUser | null;
  isLiked: boolean;
  onLikeClick: () => void;
  onAnswerClick: () => void;
  onReportClick: () => void;
  onBanClick: () => void;
  onExcludeClick: () => void;
  className?: string;
}

function PostActionBar(props: PostActionBarProps) {
  return (
      <div className={'flex gap-x-2 w-full justify-start ' + props.className}>
        <button
            onClick={ props.onLikeClick }
            className="cursor-pointer hover:bg-primary-dark text-primary-light flex items-center gap-x-1 py-0.5 px-2 rounded-full">
          {
            props.isLiked ?
                <IonIcon icon={ heart } /> :
                <IonIcon icon={ heartOutline } />
          }
          <span>Curtir</span>
        </button>

        <button
            onClick={props.onAnswerClick}
            className="cursor-pointer hover:bg-slate-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
          <IonIcon icon={ chatbubbleOutline } />
          <span>Responder</span>
        </button>
        <button
            onClick={props.onReportClick}
            className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
          <IonIcon icon={ flagOutline } />
          <span>Denunciar</span>
        </button>

        {
            (props.user && [Role.ADMIN, Role.MODERATOR].includes(props.user.role)) &&
            <button
                onClick={props.onBanClick}
                className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
              <IonIcon icon={ hammerOutline } />
              <span>Banir Usuário</span>
            </button>
        }
        {
            (props.user && (props.userIsPostOwner || [Role.ADMIN, Role.MODERATOR].includes(props.user.role))) &&
            <button
                onClick={props.onExcludeClick}
                className="cursor-pointer hover:bg-red-600 flex items-center gap-x-1 py-0.5 px-2 rounded-full">
              <IonIcon icon={ trashOutline } />
              <span>Apagar</span>
            </button>
        }
      </div>
  )
}

const post: Post = new Post(
    'Postname',
    new User(0, 'Name usuer'),
    new Category(8, 'Emuladores'),
    'lorem inpsumaaaaaaaaaaaaaaaaa sdad wwasaw as daw dasd aw sad as dwad asd awd asd aw dasd aws daw asd asd awd asdasdsdsada wda s dsadsad a dwasdsadas awd asdsad wad',
    ['item', 'hardware', 'emulador'],
    new Thumbnail({ url: '/backgrounds/login-page.png' }),
    0,
    false,
    new Date(Date.now() + 30 * 60 * 60 * 1000),
    new Date(Date.now() + 40 * 60 * 60 * 1000),
)

const mockCommentList: Comment[] = [
  new Comment(
      { id: 0, type: CommentParentType.POST } as CommentParent,
      new User(0, 'John Doe'),
      'This is the first comment!',
      0,
      false, // likes
      false,
      new Date(Date.now() + 40 * 60 * 60 * 1000),
      new Date(Date.now() + 40 * 60 * 60 * 1000),
      [
        new Comment(
            { id: 0, type: CommentParentType.POST } as CommentParent,
            new User(1, 'Jane Smith'),
            'I totally agree with this!',
            1,
            false, // likes
            true,
            new Date(Date.now() + 41 * 60 * 60 * 1000),
            new Date(Date.now() + 41 * 60 * 60 * 1000),
            []
        ),
        new Comment(
            { id: 0, type: CommentParentType.POST } as CommentParent,
            new User(2, 'Mark Johnson'),
            'Interesting perspective!',
            2,
            false, // likes
            false,
            new Date(Date.now() + 42 * 60 * 60 * 1000),
            new Date(Date.now() + 42 * 60 * 60 * 1000),
            [
              new Comment(
                  { id: 0, type: CommentParentType.POST } as CommentParent,
                  new User(3, 'Emily Davis'),
                  'Thanks for pointing this out, Mark!',
                  3,
                  false, // likes
                  false,
                  new Date(Date.now() + 43 * 60 * 60 * 1000),
                  new Date(Date.now() + 43 * 60 * 60 * 1000),
                  []
              )
            ]
        )
      ]
  ),
  new Comment(
      { id: 0, type: CommentParentType.POST } as CommentParent,
      new User(4, 'Alice Brown'),
      'What are your thoughts on the current discussion?',
      4,
      false, // likes
      false,
      new Date(Date.now() + 44 * 60 * 60 * 1000),
      new Date(Date.now() + 44 * 60 * 60 * 1000),
      [
        new Comment(
            { id: 0, type: CommentParentType.POST } as CommentParent,
            new User(5, 'Charlie Wilson'),
            'I think it’s quite insightful.',
            5,
            false, // likes
            false,
            new Date(Date.now() + 45 * 60 * 60 * 1000),
            new Date(Date.now() + 45 * 60 * 60 * 1000),
            []
        )
      ]
  ),
  new Comment(
      { id: 0, type: CommentParentType.POST } as CommentParent,
      new User(6, 'Sophia Taylor'),
      'Does anyone have sources to back this up?',
      6,
      true, // likes
      false,
      new Date(Date.now() + 46 * 60 * 60 * 1000),
      new Date(Date.now() + 46 * 60 * 60 * 1000),
      [
        new Comment(
            { id: 0, type: CommentParentType.POST } as CommentParent,
            new User(7, 'Liam Moore'),
            'Here’s a link to an article: [link]',
            7,
            false, // likes
            false,
            new Date(Date.now() + 47 * 60 * 60 * 1000),
            new Date(Date.now() + 47 * 60 * 60 * 1000),
            []
        ),
        new Comment(
            { id: 0, type: CommentParentType.POST } as CommentParent,
            new User(8, 'Olivia Martinez'),
            'I can provide some more details if needed.',
            8,
            false, // likes
            false,
            new Date(Date.now() + 48 * 60 * 60 * 1000),
            new Date(Date.now() + 48 * 60 * 60 * 1000),
            []
        )
      ]
  )
];
