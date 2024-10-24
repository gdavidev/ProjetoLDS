import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import React, { PropsWithChildren } from 'react';

type CardSwiperProps = {
  containerClassName?: string
}

export default function CardSwiper(props: PropsWithChildren<CardSwiperProps>) {
  return (
    <div className={ props.containerClassName }>
      <Swiper slidesPerView={4.5} spaceBetween={30} centeredSlides navigation
          pagination={{ el: '#swiper-cards-pagination', }} loop simulateTouch={false}
          slidesPerGroup={1} grabCursor={true} keyboard={{ enabled: true, }}
          modules={[Navigation, Pagination]}>            
        { 
          props.children &&
            React.Children.map(props.children, child =>
                <SwiperSlide>{ child }</SwiperSlide>)        
        }
      </Swiper>
      <div id="swiper-cards-pagination" className="w-screen text-center gap-x-5" />
    </div>
  );
}