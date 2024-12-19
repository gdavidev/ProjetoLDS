import { useContext, useEffect, useState } from 'react'
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

const bannerList: JSX.Element[] = [
  <SwiperSlide key={0}>
    <img alt='donkeyKongBanner' className='object-cover h-full w-full' src={ donkeyKongBanner } />
  </SwiperSlide>,
  <SwiperSlide key={1}>
    <img alt='pokemonFireRedBanner' className='object-cover h-full w-full' src={ pokemonFireRedBanner } />
  </SwiperSlide>,
  <SwiperSlide key={2}>
    <img alt='superMarioKartBanner' className='object-cover h-full w-full' src={ superMarioKartBanner } />
  </SwiperSlide>,
  <SwiperSlide key={3}>
    <img alt='superMarioWorldBanner' className='object-cover h-full w-full' src={ superMarioWorldBanner } />
  </SwiperSlide>
]

export default function HomePage() {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  const { theme } = mainContext.tailwindConfig
  const [ cardList, setCardList ] = useState<JSX.Element[]>([])

  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", theme.colors.white);
  }, []);

  useGames({
    onSuccess: (games: Game[]) => fillCardSwiper(games)
  })

  async function fillCardSwiper(games: Game[]): Promise<void> {
    const gameCardList: JSX.Element[] =
      games.map((game: Game, i: number) =>
        <GameCard key={ i } game={ game } />
      )
    setCardList(gameCardList);
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