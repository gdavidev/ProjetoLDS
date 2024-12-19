import React, { useContext, useEffect, useState } from 'react'
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import BannerSwiper from '@apps/main/components/displayComponents/BannerSwiper';
import CardSwiper from '@apps/main/components/displayComponents/CardSwiper';
import GameCard from '@apps/main/components/displayComponents/GameCard.tsx';
import donkeyKongBanner from '@apps/main/assets/banners/donkeyKongBanner.png'
import pokemonFireRedBanner from '@apps/main/assets/banners/pokemonFireRedBanner.jpg'
import superMarioKartBanner from '@apps/main/assets/banners/superMarioKartBanner.webp'
import superMarioWorldBanner from '@apps/main/assets/banners/superMarioWorldBanner.jpg'
import { SwiperSlide } from 'swiper/react';
import Game from '@/models/Game';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import useGames from '@/hooks/useGames';

const bannerList: React.ReactElement[] = [
  <SwiperSlide key={0}>
    <img alt='donkeyKongBanner' className='w-screen' src={ donkeyKongBanner } />
  </SwiperSlide>,
  <SwiperSlide key={1}>
    <img alt='pokemonFireRedBanner' className='w-screen -mt-96' src={ pokemonFireRedBanner } />
  </SwiperSlide>,
  <SwiperSlide key={2}>
    <img alt='superMarioKartBanner' className='w-screen mt-[-800px]' src={ superMarioKartBanner } />
  </SwiperSlide>,
  <SwiperSlide key={3}>
    <img alt='superMarioWorldBanner' className='w-screen -mt-96' src={ superMarioWorldBanner } />
  </SwiperSlide>
]

export default function HomePage() {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const { theme } = mainContext.tailwindConfig
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])
  //const defaultImageURL: string = "https://placehold.co/90x120"

  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", theme.colors.white);
  }, []);

  useGames({
    onSuccess: (games: Game[]) => fillCardSwiper(games)
  })

  async function fillCardSwiper(games: Game[]): Promise<void> {
    const gameCardList: JSX.Element[] =
      games.map((game: Game, index: number) => 
        <GameCard key={ index } game={ game } />
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