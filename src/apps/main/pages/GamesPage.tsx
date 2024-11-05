import { useState } from "react";
import GameApiClient from "@api/GameApiClient";
import { HGameCard } from "@apps/main/components/displayComponents/HGameCard";
import { useQuery } from "react-query";
import Game from "@/models/Game";
import { AxiosError } from 'axios';

export default function GamesPage() {
  //const defaulImgURL: string = "https://placehold.co/90x120"
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
        <HGameCard key={ index } game={ game } />
      )
    setCardList(gameCardList)
  }
  
  return (
    <>
      <div className="flex flex-col gap-y-2">
        { cardList }
      </div>
    </>
  );
}
