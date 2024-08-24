import React, { useEffect } from 'react'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Card from './components/Card'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import './common/styles/App.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty("--swiper-theme-color", "rgb(220 38 38)")
  }, [])

  let cardArray: React.ReactElement[] =
    Array.from({length: 10}, (_, i) => 
      <SwiperSlide key={i}>
        <Card key={i}/>
      </SwiperSlide>)

  let bannerArray: React.ReactElement[] =
    Array.from({length: 4}, (_, i) => 
      <SwiperSlide key={i}>
        <img className="w-full h-full" src="https://placehold.co/100x60" alt="" key={i} />
      </SwiperSlide>)

  return (
    <>
      <Header isUserAuth={false} />
      <Sidebar />
      <Swiper navigation pagination={{ el: '#swiper-banner-pagination',}} 
          loop modules={[Navigation, Pagination]} 
          className="w-full h-[70vh]">
          { bannerArray }
      </Swiper>
      <div id="swiper-banner-pagination" className="w-screen text-center gap-x-5" />

      <main className="p-16 w-screen">
        <Swiper slidesPerView={5.5} spaceBetween={30} centeredSlides navigation
            pagination={{ el: '#swiper-cards-pagination', }}  loop         
            slidesPerGroup={2} grabCursor={true} keyboard={{ enabled: true, }}
            modules={[Navigation, Pagination]}>
          { cardArray }
        </Swiper>
        <div id="swiper-cards-pagination" className="w-screen text-center gap-x-5" />
      </main>
      <Footer />
    </>
  );
}
export default App;