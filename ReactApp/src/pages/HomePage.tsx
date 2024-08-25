import { useEffect } from 'react'
import BannerSwiper from '../components/displayComponents/BannerSwiper';
import CardSwiper from '../components/displayComponents/CardSwiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", "rgb(220 38 38)")
  }, []);

  return (
    <>
      <BannerSwiper />
      <CardSwiper />
    </>
  );
}