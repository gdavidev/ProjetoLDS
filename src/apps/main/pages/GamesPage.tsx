import { useState } from "react";
import Game from "@models/Game";
import { AxiosError } from 'axios';
import VGameCard from "@apps/main/components/displayComponents/VGameCard";
import SearchGamesSideBar from "@apps/main/components/layout/SearchGamesSideBar";
import useGames from "@/hooks/useGames";
import Loading from '@shared/components/Loading.tsx';

export default function GamesPage() {
  const [ cardList, setCardList ] = useState<JSX.Element[] | undefined>()
  
  useGames({
    onSuccess: (games: Game[]) => {
      const gameCardList: JSX.Element[] =
          games.map((game: Game, index: number) => <VGameCard key={ index } game={ game } />)
      setCardList(gameCardList)
    },
    onError: (err: AxiosError | Error) => console.log(err.message)
  });
  
  return (
    <div className="flex mx-4 gap-x-3 min-h-75">
      <SearchGamesSideBar />
      {
        !cardList ? <Loading className='grow' /> :
          <div className="grow grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2">
            { cardList }
          </div>
      }
    </div>
  );
}
