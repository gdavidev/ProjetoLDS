import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { PropsWithChildren } from 'react';

type BannerSwiperProps = {
  containerClassName?: string,
}

export default function BannerSwiper(props: PropsWithChildren<BannerSwiperProps>) {  
  return (
    <div className={ props.containerClassName }>
      <Swiper navigation pagination={{ el: '#swiper-banner-pagination',}} 
          loop modules={[Navigation, Pagination]} simulateTouch={false}
          className="w-full h-[80vh]">
        { props.children }
      </Swiper>
      <div id="swiper-banner-pagination" className="w-screen text-center gap-x-5" />
    </div>
  );
}