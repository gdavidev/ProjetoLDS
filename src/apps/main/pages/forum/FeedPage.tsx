import Post from "@/models/Post";
import PostContainer from "@apps/main/components/PostContainer";
import User from "@/models/User";
import { Button } from "@mui/material";
import { IonIcon } from "@ionic/react";
import { add } from 'ionicons/icons';
import { useNavigate } from "react-router-dom";

export default function FeedPage() {
  const navigate = useNavigate();
  const mockPostContainer: Post[] = Array(15).fill(new Post(0, new User(0, 'name'), 'postname'))  
  
  return(
    <div className="flex col-gap-2">
      <div>
        <Button startIcon={ <IonIcon icon={ add } /> } 
            onClick={ () => navigate('/forum/post/new') }>
          Novo Post
        </Button>
      </div>
      <div>
        <PostContainer title="Suporte" posts={ mockPostContainer } />
      </div>
    </div>
  )
}