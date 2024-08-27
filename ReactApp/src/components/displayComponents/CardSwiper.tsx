import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import VGameCard from './VGameCard';

export default function CardSwiper() {
  let cardArray: React.ReactElement[] =
    Array.from({length: 10}, (_, i) => 
      <SwiperSlide key={i}>
        <VGameCard key={i}/>
      </SwiperSlide>)
  
  return (
    <>
      <Swiper slidesPerView={5.5} spaceBetween={30} centeredSlides navigation
          pagination={{ el: '#swiper-cards-pagination', }}  loop         
          slidesPerGroup={2} grabCursor={true} keyboard={{ enabled: true, }}
          modules={[Navigation, Pagination]}>
        { cardArray }
      </Swiper>
      <div id="swiper-cards-pagination" className="w-screen text-center gap-x-5" />
    </>
  );
}