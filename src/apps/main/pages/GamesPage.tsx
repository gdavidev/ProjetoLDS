import { useState } from "react";
import Game from "@models/Game";
import { AxiosError } from 'axios';
import VGameCard from "@apps/main/components/displayComponents/VGameCard";
import SearchGamesSideBar from "@apps/main/components/layout/SearchGamesSideBar";
import useGames from "@/hooks/useGames";

export default function GamesPage() {
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])
  
  useGames({
    onSuccess: fillCardContainer,
    onError: (err: AxiosError | Error) => console.log(err.message)
  });
  
  async function fillCardContainer(games: Game[]): Promise<void> {
    const gameCardList: JSX.Element[] =
      games.map((game: Game, index: number) => <VGameCard key={ index } game={ game } />)
    setCardList(gameCardList)
  }
  
  return (
    <div className="flex">
      <SearchGamesSideBar />
      <div className="grid grid-cols-5 gap-2">
        { cardList }
      </div>
    </div>
  );
}
