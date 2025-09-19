import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import styles from './cornerBlock001.module.scss';

interface BlockItem {
  title: string;
  imgUrl: string;
  desc: string;
}

interface CornerBlock001Props {
  data: {
    title: string;
    desc: string;
    imageList: BlockItem[];

  };
}

export default function CornerBlock001({ data }: CornerBlock001Props) {
  return (
    <div className={styles.cornerBlock001}>
      <div className={styles.cornerTitle}>
        <h4>{data.title}</h4>
        <div className={styles.swiperButton}>
          <button
            type="button"
            className={`${styles['swiper-prev']}`}
            tabIndex={0}
            role="button"
            aria-label="Previous slide"
          >
            <img src="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/65fdb7e603d0ad32d4da075c_left-slider-chevron.svg" loading="lazy" alt="" />
          </button>
          <button
            type="button"
            className={`${styles['swiper-next']}`}
            tabIndex={0}
            role="button"
            aria-label="Next slide"
          >
            <img src="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/65fdb7e60897bbe09aa50762_right-slider-chevron.svg" loading="lazy" alt="" />
          </button>
        </div>
      </div>
      <div className={styles.swiper}>
        <Swiper
          modules={[Navigation, Scrollbar, Keyboard, Mousewheel]}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
          }}
          scrollbar={{
            hide: true,
            draggable: true,
            dragSize: 'auto',
          }}
          keyboard={{
            enabled: true,
          }}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
          }}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          grabCursor={true}
          className={styles['swiper-wrapper']}
          role="list"
          aria-live="polite"
        >
          {data.imageList && data.imageList.map((item, idx) => (
            <SwiperSlide
              key={idx}
              className={styles['swiper-slidebox']}
              role="group"
              aria-label={`${idx + 1} / ${data.imageList.length}`}
              style={{
                backgroundImage: `url('${item.imgUrl}')`,

              }}
            >
              <div className={styles['slider-textbox']}>
                <div className={`${styles.title}`}>{item.title}</div>
                <div className={styles.dec}>{item.desc}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
} 