import { usePost } from '@/hooks/usePosts.ts';
import { useNavigate } from 'react-router-dom';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';
import { AxiosError } from 'axios';
import { useLikePost } from '@/hooks/useLikePost.ts';
import LikeButton from '@apps/main/pages/forum/LikeButton.tsx';
import { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser.ts';

type PostPageParams = {
  postId: number;
}

export default function PostPage() {
  const [ liked, setLiked ] = useState<boolean>(false);
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { params }  = useTypeSafeSearchParams<PostPageParams>();

  useEffect(() => {
    if (!params.postId)
      return navigate('/feed');
  }, []);

  const { mutate: likePost } = useLikePost();
  const { data: post } = usePost(params.postId, {
    onError: (err: AxiosError | Error) => console.log(err.message),
  });
  
  return(
    <section>
      <div>
        <h1>{ post?.name }</h1>
        <span>{ post?.content }</span>
        <LikeButton
            checked={ liked }
            onClick={(): void => {
              likePost({
                currentState: liked,
                postId: params.postId,
                userId: 1
              });
              setLiked(li => !li)
            }}
        />
      </div>
    </section>
  );
}