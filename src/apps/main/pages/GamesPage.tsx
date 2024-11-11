import { useState } from "react";
import GameApiClient from "@api/GameApiClient";
import { useQuery } from "react-query";
import Game from "@/models/Game";
import { AxiosError } from 'axios';
import VGameCard from "../components/displayComponents/VGameCard";

export default function GamesPage() {
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])
  
  useQuery({
    queryFn: async () => {
      const gameApiClient: GameApiClient = new GameApiClient()
      return await gameApiClient.getAll()
    },
    onSuccess: (games: Game[]) => fillCardContainer(games),
    onError: (err: AxiosError | Error) => console.log(err.message)
  });
  
  async function fillCardContainer(games: Game[]): Promise<void> {
    const gameCardList: JSX.Element[] =
      games.map((game: Game, index: number) => 
        <VGameCard key={ index } game={ game } />
      )
    setCardList(gameCardList)
  }
  
  return (
    <div className="grid grid-cols-5 gap-2">
      { cardList }
    </div>
  );
}
