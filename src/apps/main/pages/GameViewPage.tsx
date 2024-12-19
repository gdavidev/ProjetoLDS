import { IonIcon } from '@ionic/react';
import { play } from 'ionicons/icons';
import { useGame } from '@/hooks/useGames';
import Loading from '@shared/components/Loading.tsx';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import { useParams } from 'react-router-dom';

type GameViewPageParams = {
  gameId: string
}

export default  function GameViewPage() {
  const { exit } = useEmergencyExit();
  const params = useParams<GameViewPageParams>();

  const { data: game, isLoading } = useGame(Number(params.gameId), {
    onError: () => exit('/', 'Não foi possível carregar esse jogo, tente mais tarde.')
  });

  if (isLoading) {
    return (<Loading />);
  } else if (game === undefined) {
    exit('/', 'Não foi possível carregar esse jogo, tente mais tarde.')
    return <></>
  }

  return (
    <section className="flex justify-center w-full gap-x-12">
      <picture className='overflow-hidden rounded-md'>
        <img
          src={ game.thumbnail.toDisplayable() }
          alt={ game.name }
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </picture>
      <div className='text-white'>
        <h1 className='font-black text-[3rem]'>{ game.name }</h1>
        <a
            href={ game.getDesktopAppQueryString() }
            className='btn-r-full gap-2 px-10 py-4 w-48 bg-green-700 hover:bg-green-600 mb-6'
            style={{ marginRight: '10px' }}>
          <IonIcon icon={play} />
          Jogar
        </a>

        <h2 className='font-bold mb-2'>Descrição</h2>
        <p>{game.desc}</p>

        <div className='flex gap-x-16 mt-6'>
          <p className='font-bold'>Emulador</p>
          <p>{game.emulator.console}</p>
        </div>
      </div>
    </section>
  );
};
