import { useParams, useNavigate } from 'react-router-dom';
import Game from '@models/Game';
import { useQuery } from 'react-query';
import GameApiService from '@/api/GameApiService';
import { IonIcon } from '@ionic/react';
import { play } from 'ionicons/icons';
import { useGame } from '@/hooks/useGames';

type GameViewPageParams = {
  gameId: string
}

export default  function GameViewPage() {
  const { gameId } = useParams<GameViewPageParams>();

  const { data: game, isLoading, isError } = useGame(Number(gameId));

  return (
    <div>
      <h1>title : { game?.name }</h1>
      <p>description : { game?.desc }</p>
      <p><strong>Emulador:</strong> { game?.emulator.console }</p>
      
      <img
        src={`data:image/jpeg;base64,${ game.thumbnail.base64 }`}
        alt={ game.name }
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <button onClick={ handlePlayGame } style={{ marginRight: '10px' }}>
        <IonIcon icon={ play } /> Jogar
      </button>
    </div>
  );
};
