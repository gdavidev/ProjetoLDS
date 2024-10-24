import { useParams, useNavigate } from 'react-router-dom';
import Game from '@models/Game';
import { useQuery } from 'react-query';
import GameApiClient from '@/api/GameApiClient';
import { IonIcon } from '@ionic/react';
import { play } from 'ionicons/icons';

type GameViewPageParams = {
  gameId: string
}

export default  function GameViewPage() {
  const { gameId } = useParams<GameViewPageParams>();
  const navigate = useNavigate();
    
  const { data: game, isLoading, isError } = useQuery<Game>("GET_GAME", () => {
    const gameApiClient: GameApiClient = new GameApiClient();
    return gameApiClient.get(Number(gameId));
  }); 

  const handlePlayGame = () => {
    navigate(`/play/${gameId}`);
  };

  return (
    <div>
      <h1>title : { game?.name }</h1>
      <p>description : { game?.desc }</p>
      <p><strong>Emulador:</strong> { game?.emulator.console }</p>
      
      { game?.thumbnail?.base64 && (
        <img
          src={`data:image/jpeg;base64,${ game.thumbnail.base64 }`}
          alt={ game.name }
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      <button onClick={ handlePlayGame } style={{ marginRight: '10px' }}>
        <IonIcon icon={ play } /> Jogar
      </button>
    </div>
  );
};
