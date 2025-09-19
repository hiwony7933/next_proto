import React from 'react';
import styles from './cornerCheck001.module.scss';

interface CornerCheckItem {
  title: string;
  html: string;
}
interface BlockItem {
  title: string;
  imgUrl: string;
  subImgUrl: string;
  desc: string;
}
interface CornerCheck001Props {
  data: {
    title: string;
    desc: string;
    imageList: BlockItem[];
    htmlList: CornerCheckItem[];
  };
}

const CornerCheck001: React.FC<CornerCheck001Props> = ({ data }) => {
  return (
    <section className={styles.section} style={{ backgroundImage: `url(${data.imageList[0].imgUrl})` }}>

      <div className={styles.wLayoutBlockcontainer}>
        <div className={`${styles.wLayoutLayout} `}>
          <div className={styles.wLayoutCell}></div>
          <div className={styles.pdpContentsColumn}>
            {/* Responsive Images */}

            <img src={data.imageList[0].subImgUrl} alt={data.title} className={styles.showMob} />
            <div className={`${styles.wLayoutVflex} ${styles.gap16} ${styles.flexStretch}`}>
              {data.htmlList.map((item, idx) => (
                <div className={styles.rtbCheckpointBox} key={idx}>
                  <div className={`${styles.wLayoutHflex} ${styles.alignCenter} ${styles.gap8}`}>
                    <div className={`${styles.checkboxEmbed16px} ${styles.wEmbed}`}>
                      {/* SVG Checkbox */}
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="0.5" width="16" height="16" rx="4" fill="#0052A4"></rect>
                        <g clipPath="url(#clip0_47_93149)">
                          <path d="M4.33594 9.16455L6.66927 11.4979L12.0026 6.16455" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_47_93149">
                            <rect x="2.66797" y="3.16455" width="10.6667" height="10.6667" rx="4" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className={styles.flexStretch}>
                      <strong>{item.title}</strong>
                    </div>
                  </div>
                  <div
                    className={`${styles.textSmall} ${styles.textBlack}`}
                    dangerouslySetInnerHTML={{ __html: item.html ? item.html.replace(/\n/g, '<br />') : '' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default CornerCheck001;
