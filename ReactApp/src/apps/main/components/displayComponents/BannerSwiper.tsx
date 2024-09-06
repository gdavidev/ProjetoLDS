import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

type BannerSwiperProps = {
  containerClassName?: string,
}

export default function BannerSwiper(props: BannerSwiperProps) {
  let bannerArray: React.ReactElement[] =
    Array.from({length: 4}, (_, i) => 
      <SwiperSlide key={i}>
        <img className="w-full h-full select-none" src="https://placehold.co/100x60" alt="" key={i} />
      </SwiperSlide>)
  
  return (
    <div className={ props.containerClassName }>
      <Swiper navigation pagination={{ el: '#swiper-banner-pagination',}} 
          loop modules={[Navigation, Pagination]} simulateTouch={false}
          className="w-full h-[70vh]">
          { bannerArray }
      </Swiper>
      <div id="swiper-banner-pagination" className="w-screen text-center gap-x-5" />
    </div>
  );
}