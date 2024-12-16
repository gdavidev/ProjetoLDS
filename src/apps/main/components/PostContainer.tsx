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
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';
import useMessageBox from '@/hooks/interaction/useMessageBox.ts';

type PostContainerProps = {
  title: string,
  posts: Post[],
  category: Category,
	onUpdate: () => void
}

export default function PostContainer(props: PostContainerProps) {
  const navigate = useNavigate();
  const { openMessageBox } = useMessageBox();
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
    onSuccess: (_: any) => {
			notifySuccess('Usuário banido com sucesso');
			props.onUpdate?.();
		},
    onError: (_: any) => notifyError('Não foi possível banir usuário')
  });

  const { deletePost, isDeletePostLoading } = useDeletePost(user?.token!, {
    onSuccess: () => {
			notifySuccess('Post deletado com sucesso!');
			props.onUpdate?.();
		},
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
    openMessageBox({
      title: 'Banir Usuário',
      message: 'Tem certeza que deseja banir esse usuário?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          ban(userId);
      }
    });
  }, [user]);

  const handleExcludeButtonClick = useCallback((post: Post) => {
    openMessageBox({
      title: 'Deletar Comentário',
      message: 'Tem certeza que deseja deletar esse comentário?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          deletePost(post);
      }
    });
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
          <div className="ms-2 w-full font-poppins flex flex-col gap-y-3">
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