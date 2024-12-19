import { useState } from "react";
import Game from "@models/Game";
import { AxiosError } from 'axios';
import GameCard from "@apps/main/components/displayComponents/GameCard.tsx";
import SearchGamesSideBar from "@apps/main/components/SearchGamesSideBar.tsx";
import useGames from "@/hooks/useGames";
import Loading from '@shared/components/Loading.tsx';

export default function GamesPage() {
  const [ cardList, setCardList ] = useState<JSX.Element[] | undefined>()
  
  useGames({
    onSuccess: (games: Game[]) => {
      const gameCardList: JSX.Element[] =
          games.map((game: Game, index: number) => <GameCard key={ index } game={ game } />)
      setCardList(gameCardList)
    },
    onError: (err: AxiosError | Error) => console.log(err.message)
  });
  
  return (
    <div className="flex me-4 gap-x-3 min-h-[92vh] -mt-14 -mb-16">
      <SearchGamesSideBar />
      <div className='mt-14 mb-16 w-full'>
        {
          !cardList ? <Loading className='grow' /> :
            <div className="grow grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2">
              { cardList }
            </div>
        }
      </div>
    </div>
  );
}
