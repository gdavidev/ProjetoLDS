import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

export default function BannerSwiper() {
  let bannerArray: React.ReactElement[] =
    Array.from({length: 4}, (_, i) => 
      <SwiperSlide key={i}>
        <img className="w-full h-full" src="https://placehold.co/100x60" alt="" key={i} />
      </SwiperSlide>)
  
  return (
    <>
      <Swiper navigation pagination={{ el: '#swiper-banner-pagination',}} 
          loop modules={[Navigation, Pagination]} 
          className="w-full h-[70vh]">
          { bannerArray }
      </Swiper>
      <div id="swiper-banner-pagination" className="w-screen text-center gap-x-5" />
    </>
  );
}