import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import React, { PropsWithChildren, useLayoutEffect, useState } from 'react';
import useDeviceWidth, { DeviceWidthBreakpoints } from '@/hooks/configuration/useDeviceWidth.ts';

type CardSwiperProps = {
  containerClassName?: string
}

export default function CardSwiper(props: PropsWithChildren<CardSwiperProps>) {
  const [ slidesPerView, setSlidesPerView ] = useState<number>(1.5)
  const { breakpoint } = useDeviceWidth();

  useLayoutEffect(() => {
    switch (breakpoint) {
      case DeviceWidthBreakpoints.XXL: setSlidesPerView(5.5); break;
      case DeviceWidthBreakpoints.XL: setSlidesPerView(4.5); break;
      case DeviceWidthBreakpoints.LG: setSlidesPerView(3.5); break;
      case DeviceWidthBreakpoints.MD: setSlidesPerView(2.5); break;
      default: setSlidesPerView(1.5); break;
    }
  }, [breakpoint]);

  return (
    <div className={ props.containerClassName }>
      <Swiper
          loop
          centeredSlides
          navigation
          slidesPerView={ slidesPerView }
          spaceBetween={ 30 }
          pagination={{ el: '#swiper-cards-pagination', }}
          simulateTouch={ false }
          slidesPerGroup={ 1 }
          grabCursor={ true }
          keyboard={{ enabled: true, }}
          modules={ [Navigation, Pagination] }>
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