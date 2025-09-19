import React from 'react';
import styles from './cornerBanner003.module.scss';

interface BannerData {
  title: string;
  desc: string;
  linkUrl: string;
  target?: boolean;
}

interface CornerBanner003Props {
  data: {
    cornerTitle: string;
    designType: string;
    textList: BannerData[];
  };
}

const CornerBanner003: React.FC<CornerBanner003Props> = ({ data }) => {
  const banner = data.textList[0];
  return (
    <div className={`${styles.wLayoutBlockcontainer} ${styles.container} ${styles.wContainer}`}>
      <div className={`${styles.wLayoutHflex} ${styles.cctvCtaBoxWrapper}`}>
        <div className={styles.textLarge}>
          <strong>{banner.title}</strong>
        </div>
        <div className={`${styles.wLayoutHflex} ${styles.cctvCtaBtnWrapper}`}>
          <a
            id="go-estimation"
            href={banner.linkUrl}
            className={`${styles.cctvSolidCta} ${styles.wInlineBlock}`}
            target={banner.target ? '_blank' : undefined}
            rel={banner.target ? 'noopener noreferrer' : undefined}
          >
            <div>{banner.desc}</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CornerBanner003;
