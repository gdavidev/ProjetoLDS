import { useEffect, useState } from "react";
import GameApiClient from "@api/GameApiClient";
import { GameGetDTO } from "@models/GameDTOs";
import { HGameCard } from "@apps/main/components/displayComponents/HGameCard";

export default function GamesPage() {
  const defaulImgURL: string = "https://placehold.co/90x120"
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])

  useEffect(() => {
    fillCardContainer()
  }, [])

  async function fetchGameData(): Promise<GameGetDTO[]> {
    const gameApiClient: GameApiClient = new GameApiClient()
    return gameApiClient.getAll<GameGetDTO>()
  }
  async function fillCardContainer(): Promise<void> {
    const gameList: GameGetDTO[] = await fetchGameData()
    const gameCardList: JSX.Element[] =
      gameList.map((game: GameGetDTO, index: number) => 
        <HGameCard key={ index } name={ game.title } emulador={ game.emulador }
          desc={ game.description }
          img={ game.image_base64 ? 
            'data:image/jpeg;base64,' +  game.image_base64 :
            defaulImgURL } />
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