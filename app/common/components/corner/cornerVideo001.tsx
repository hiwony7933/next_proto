import React, { useState } from 'react';
import { MzModal } from '../ui/mzModal';
import styles from './cornerVideo001.module.scss';

interface VideoData {
  videoTitle: string;
  videoUrl: string;
  subImgUrl: string;
}

interface CornerVideo001Props {
  data: {
    title: string;
    desc: string;
    fileConts: {
      videoList: VideoData[];
    };
  };
}

const CornerVideo001: React.FC<CornerVideo001Props> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoData = data.fileConts.videoList[0];

  const openModal = () => {
    setVideoSrc(videoData.videoUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setVideoSrc(null);
  };

  return (
    <section id="video" className={styles.section}>
      <div className={`${styles.wLayoutBlockcontainer} ${styles.container} ${styles.wContainer}`}>
        <h4>{data.title}</h4>
        <div
          className={styles.cctvVideoThumbnail}
          style={{ backgroundImage: `url(${videoData.subImgUrl})` }}
        >
          <div
            className={`${styles.wLayoutVflex} ${styles.videoPlayButtonWrapper}`}
            onClick={openModal}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.videoPlayButton}>
              <div className={`${styles.playEmbedIcon} ${styles.wEmbed}`}>
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.5 17.134C35.1667 17.5189 35.1667 18.4811 34.5 18.866L10.5 32.7224C9.83333 33.1073 9 32.6262 9 31.8564L9 4.14359C9 3.37379 9.83333 2.89267 10.5 3.27757L34.5 17.134Z"
                    fill="white"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className={`${styles.commentBox} ${styles.cctv}`}>
            <div className={styles.textMiddle}>
              <strong>{videoData.videoTitle}</strong>
            </div>
          </div>
        </div>
        {/** modal */}
        <MzModal isOpen={modalOpen} onClose={closeModal} hasClose>
          <video
            style={{ borderRadius: 8, visibility: 'visible' }}
            controls
            autoPlay
            width="100%"
            src={videoSrc || ''}
            poster={videoData.subImgUrl}
          >
            <img src={videoData.subImgUrl} alt="video thumbnail" />
          </video>
        </MzModal>
        {/** modal */}
      </div>
    </section>
  );
};

export default CornerVideo001;
