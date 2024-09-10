import { useEffect, useState } from 'react'
import BannerSwiper from '../components/displayComponents/BannerSwiper';
import CardSwiper from '../components/displayComponents/CardSwiper';
import VGameCard from '../components/displayComponents/VGameCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { GameGetDTO } from '../../../models/GameDTOs';
import GameApiClient from '../../../api/GameApiClient';

export default function HomePage() {
  const defaultImageURL: string = "https://placehold.co/90x120"
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])  

  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", "rgb(220 38 38)")    
    fillCardSwiper()
  }, []);

  async function fetchGameData(): Promise<GameGetDTO[]> {
    const gameApiClient: GameApiClient = new GameApiClient()
    return gameApiClient.getAll<GameGetDTO>()
  }
  async function fillCardSwiper(): Promise<void> {
    const gameList: GameGetDTO[] = await fetchGameData()
    const gameCardList: JSX.Element[] =
      gameList.map((game: GameGetDTO, index: number) => 
        <VGameCard key={ index } name={ game.title } img={ defaultImageURL } />
      )
    setCardList(gameCardList)
  }

  return (
    <>
      <BannerSwiper containerClassName="mb-16" />
      <CardSwiper containerClassName="mb-16">
        { cardList }
      </CardSwiper>
    </>
  );
}