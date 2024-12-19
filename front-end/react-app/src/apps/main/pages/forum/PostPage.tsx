import { usePost } from '@/hooks/usePosts.ts';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';
import { AxiosError } from 'axios';
import { useLikePost } from '@/hooks/useLikePost.ts';
import LikeButton from '@apps/main/pages/forum/LikeButton.tsx';
import { useEffect, useState } from 'react';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';

type PostPageParams = {
  postId: number;
}

export default function PostPage() {
  const [ liked, setLiked ] = useState<boolean>(false);
  const { params }  = useTypeSafeSearchParams<PostPageParams>();
  const { exit } = useEmergencyExit();

  useEffect(() => {
    if (params.postId === undefined)
      exit('/forum/feed', 'Post não encontrado');
  }, []);

  const { mutate: likePost } = useLikePost();
  const { data: post } = usePost(params.postId, {
    onError: (err: AxiosError | Error) => { exit('/forum/feed', 'Post não encontrado'); console.log(err.message) }
  });
  
  return(
    <section>
      <div>
        <h1>{ post?.title }</h1>
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