import { IonIcon } from '@ionic/react';
import { play } from 'ionicons/icons';
import { useGame } from '@/hooks/useGames';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';
import Loading from '@shared/components/Loading.tsx';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import { useCallback } from 'react';

type GameViewPageParams = {
  gameId: number
}

export default  function GameViewPage() {
  const { exit } = useEmergencyExit()
  const { params } = useTypeSafeSearchParams<GameViewPageParams>();
  const { data: game, isLoading, isError } = useGame(params.gameId);

  if (isLoading)
    return (<Loading />);
  if (isError || !game)
    return exit('/', 'Não foi possível carregar esse jogo, tente mais tarde.')

  const handlePlayGame = useCallback(() => {

  }, [game])

  return (
    <section className="flex items-center justify-center w-full gap-x-2">
      <picture>
        <img
          src={ game.thumbnail?.toDisplayable() }
          alt={ game.name }
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </picture>
      <div>
        <h1>{ game.name }</h1>
        <p>{ game.desc }</p>
        <p><strong>Emulador:</strong> { game.emulator.console }</p>
        <button
          onClick={ handlePlayGame }
          style={{ marginRight: '10px' }}
        >
          <IonIcon icon={ play } />
          Jogar
        </button>
      </div>
    </section>
  );
};
