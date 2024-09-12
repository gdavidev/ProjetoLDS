import { useEffect, useState } from 'react'
import BannerSwiper from '../components/displayComponents/BannerSwiper';
import CardSwiper from '../components/displayComponents/CardSwiper';
import VGameCard from '../components/displayComponents/VGameCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { GameGetDTO } from '../../../models/GameDTOs';
import GameApiClient from '../../../api/GameApiClient';
import donkeyKongBanner from '../assets/banners/donkeyKongBanner.png'
import pokemonFireRedBanner from '../assets/banners/pokemonFireRedBanner.jpg'
import superMarioKartBanner from '../assets/banners/superMarioKartBanner.webp'
import superMarioWorldBanner from '../assets/banners/superMarioWorldBanner.jpg'
import { SwiperSlide } from 'swiper/react';

const bannerList: JSX.Element[] = [
  <SwiperSlide key={0}>
    <img className='w-screen' src={ donkeyKongBanner } />
  </SwiperSlide>,
  <SwiperSlide key={1}>
    <img className='w-screen -mt-96' src={ pokemonFireRedBanner } />
  </SwiperSlide>,
  <SwiperSlide key={1}>
    <img className='w-screen mt-[-800px]' src={ superMarioKartBanner } />
  </SwiperSlide>,
  <SwiperSlide key={3}>
    <img className='w-screen -mt-96' src={ superMarioWorldBanner } />
  </SwiperSlide>
]

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
        <VGameCard key={ index } name={ game.title } emulador={ game.emulador }
          img={ game.image_base64 ? 
            'data:image/jpeg;base64,' +  game.image_base64 :
             defaultImageURL } />
      )
    setCardList(gameCardList)
  }

  return (
    <>
      <BannerSwiper containerClassName="relative -top-16 h-[70vh] mb-16">
        { bannerList }
      </BannerSwiper>
      <CardSwiper containerClassName="mb-16">
        { cardList }
      </CardSwiper>
    </>
  );
}