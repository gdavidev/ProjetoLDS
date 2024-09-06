import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import VGameCard from './VGameCard';

type CardSwiperProps = {
  containerClassName?: string,
}

export default function CardSwiper(props: CardSwiperProps) {
  let cardArray: React.ReactElement[] =
    Array.from({length: 10}, (_, i) => 
      <SwiperSlide key={i}>
        <VGameCard key={i}/>
      </SwiperSlide>)
  
  return (
    <div className={ props.containerClassName }>
      <Swiper slidesPerView={5.5} spaceBetween={30} centeredSlides navigation
          pagination={{ el: '#swiper-cards-pagination', }} loop simulateTouch={false}
          slidesPerGroup={2} grabCursor={true} keyboard={{ enabled: true, }}
          modules={[Navigation, Pagination]}>
        { cardArray }
      </Swiper>
      <div id="swiper-cards-pagination" className="w-screen text-center gap-x-5" />
    </div>
  );
}