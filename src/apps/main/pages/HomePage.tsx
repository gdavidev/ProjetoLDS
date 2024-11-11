import React, { useContext, useEffect, useState } from 'react'
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import BannerSwiper from '@apps/main/components/displayComponents/BannerSwiper';
import CardSwiper from '@apps/main/components/displayComponents/CardSwiper';
import VGameCard from '@apps/main/components/displayComponents/VGameCard';
import GameApiClient from '@api/GameApiClient';
import donkeyKongBanner from '@apps/main/assets/banners/donkeyKongBanner.png'
import pokemonFireRedBanner from '@apps/main/assets/banners/pokemonFireRedBanner.jpg'
import superMarioKartBanner from '@apps/main/assets/banners/superMarioKartBanner.webp'
import superMarioWorldBanner from '@apps/main/assets/banners/superMarioWorldBanner.jpg'
import { SwiperSlide } from 'swiper/react';
import Game from '@/models/Game';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

const bannerList: React.ReactElement[] = [
  <SwiperSlide key={0}>
    <img className='w-screen' src={ donkeyKongBanner } />
  </SwiperSlide>,
  <SwiperSlide key={1}>
    <img className='w-screen -mt-96' src={ pokemonFireRedBanner } />
  </SwiperSlide>,
  <SwiperSlide key={2}>
    <img className='w-screen mt-[-800px]' src={ superMarioKartBanner } />
  </SwiperSlide>,
  <SwiperSlide key={3}>
    <img className='w-screen -mt-96' src={ superMarioWorldBanner } />
  </SwiperSlide>
]

export default function HomePage() {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const { theme } = mainContext.tailwindConfig
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])
  //const defaultImageURL: string = "https://placehold.co/90x120"

  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", theme.colors.white);
    fillCardSwiper()
  }, []);

  async function fetchGameData(): Promise<Game[]> {
    const gameApiClient: GameApiClient = new GameApiClient()
    return gameApiClient.getAll()
  }
  async function fillCardSwiper(): Promise<void> {
    const gameList: Game[] = await fetchGameData()
    const gameCardList: JSX.Element[] =
      gameList.map((game: Game, index: number) => 
        <VGameCard key={ index } game={ game } />
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