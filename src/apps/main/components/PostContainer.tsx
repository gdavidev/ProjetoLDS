import Post from "@/models/Post"
import PostRow from "./PostRow"
import { Link, useNavigate } from 'react-router-dom';
import Category from '@models/Category.ts';
import ReportContentModal from '@apps/main/components/modal/ReportContentModal.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReportContentType } from '@models/Report.ts';
import useCurrentUser from '@/hooks/useCurrentUser.tsx';
import { useLikePost, UseLikePostVariables } from '@/hooks/useLikePost.ts';
import useBan from '@/hooks/useBan.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import { AxiosError } from 'axios';
import { useDeletePost } from '@/hooks/usePosts.ts';

type PostContainerProps = {
  title: string,
  posts: Post[],
  category: Category,
}

export default function PostContainer(props: PostContainerProps) {
  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [ posts, setPosts ] = useState<JSX.Element[]>([]);
  const { user, askToLogin, forceLogin } = useCurrentUser();
  const [ isReportModalOpen, setIsReportModalOpen ] = useState<boolean>(false);
  const [ reportContentData, setReportContentData ] =
      useState<{type: ReportContentType, id: number}>({
        type: ReportContentType.POST,
        id: 0
      });

  const { likePost } = useLikePost(user?.token!, {
    onSuccess: (_: any, variables: UseLikePostVariables) => {
      if (variables.newState) {
        variables.post.hasLiked = true;
        variables.post.likeCount += 1;
      } else {
        variables.post.hasLiked = false;
        variables.post.likeCount -= 1;
      }
    },
    onError: (err: AxiosError | Error) => handleRequestError(err)
  });

  const { ban, isBanLoading } = useBan(user?.token!, {
    onSuccess: (_: any) => notifySuccess('Usuário banido com sucesso'),
    onError: (_: any) => notifyError('Não foi possível banir usuário')
  });

  const { deletePost, isDeletePostLoading } = useDeletePost(user?.token!, {
    onSuccess: () => notifySuccess('Tópico deletado com sucesso!'),
    onError: (err: AxiosError | Error) => handleRequestError(err)
  });

  const { handleRequestError } = useRequestErrorHandler({
    mappings: [
      { status: 401, onError: () => forceLogin('Seu login expirou, por favor entre novamente') },
      { status: 'default', userMessage: 'Por favor tente novamente mais tarde' }
    ]
  });

  // ---- General Callbacks ----
  const handleLikeButtonClick =
      useCallback((newState: boolean, post: Post) => {
        if (!user)
          return askToLogin('É preciso estar logado para curtir posts.')

        likePost({
          newState: newState,
          post: post,
        });
      }, [user]);

  const handleReport =
      useCallback((contentType: ReportContentType, contentId: number) => {
        setIsReportModalOpen(true);
        setReportContentData({ type: contentType, id: contentId });
      }, []);

  const handleAnswerButtonClick = useCallback((targetPostId: number) => {
    navigate('/forum/post/' + targetPostId);
  }, []);

  const handleBanButtonClick = useCallback((userId: number) => {
    ban(userId);
  }, [user]);

  const handleExcludeButtonClick = useCallback((post: Post) => {
    deletePost(post);
  }, [user]);

  useMemo(() => {
    setPosts(props.posts.map((post, i) =>
        <PostRow
            key={i}
            post={ post }
            onReportClick={ handleReport }
            onLikeClick={ handleLikeButtonClick }
            onAnswerClick={ handleAnswerButtonClick }
            onBanClick={ handleBanButtonClick }
            onExcludeClick={ handleExcludeButtonClick }
        />));
  }, [props.posts]);

  useEffect(() => {
    if (isBanLoading || isDeletePostLoading)
      notifyInfo('Enviando...');
  }, [isBanLoading, isDeletePostLoading])

  return (
      <>
        <div className='text-white flex flex-col w-full'>
          <h2 className='text-lg font-bold mb-2'>{props.title}</h2>
          <div className="ms-8 w-full font-poppins flex flex-col gap-y-3">
            { posts }
          </div>
          <Link
              className="underline text-primary-light text-lg self-end"
              to={ '/forum/feed?categoryId=' + props.category.id }>
            Ver mais...
          </Link>
        </div>
        <ReportContentModal
            contentType={ reportContentData.type }
            contentId={ reportContentData.id }
            isOpen={ isReportModalOpen }
            onCloseRequest={ () => setIsReportModalOpen(false) }
        />
      </>
  )
}