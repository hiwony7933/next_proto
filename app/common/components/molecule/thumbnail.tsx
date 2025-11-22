import { useState } from "react";
import S from "./thumbnail.module.scss";
import MzVideoPlayerModal from "../ui/mzVideoPlayerModal";

interface ThumbnailProps {
  style?: any;
  type?: string;
  data: {
    category?: string;
    title?: string;
    description?: string;
    type?: string;
    image?: string;
    date?: string;
    id?: number;
    videoUrl?: string;
  };
  label?: string;
  showLabel?: boolean;
  showTag?: boolean;
  className?: string;
}

export default function Thumbnail({
  style,
  className,
  data,
  type,
  showLabel,
  showTag,
  label,
}: ThumbnailProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const thumbnailImage = {
    backgroundImage: `url(${data.image})`,
  };
  return (
    <>
      <MzVideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        src={data.videoUrl || ""}
        title="동영상 재생"
      />
      <button
        type="button"
        className={`${S.thumbnail__area} ${type === "main" ? `${S.thumbnail__area__main}` : `${S.thumbnail__area__sub}`} ${className || ""}`}
        style={{ ...thumbnailImage, ...style }}
        onClick={() => {
          if (data.type === "video") {
            setIsVideoModalOpen(true);
          } else if (data.type === "blog") {
            console.log("blog link move"); // TODO: blog link move
          } else if (data.type === "webinar") {
            console.log("webinar link move"); // TODO: webinar link move
          }
        }}
      >
        {data.type === "video" ? (
          <>
            <div className={S.thumbnail__top__area}>
              {showTag && <span className={S.thumbnail__tag}>동영상</span>}
              {showLabel && label && (
                <span className={S.thumbnail__label}>{label}</span>
              )}
            </div>
            <i
              className={`${S.thumbnail__video__play__button} ${type === "main" ? "icon__105_play_btn" : "icon__50_play_btn"}`}
            ></i>
          </>
        ) : (
          <>
            <div className={S.thumbnail__top__area}>
              {showTag && (
                <span className={S.thumbnail__tag}>
                  {data.type === "blog" && "블로그"}
                  {data.type === "webinar" && "웨비나"}
                </span>
              )}
              {showLabel && label && (
                <span className={S.thumbnail__label}>{label}</span>
              )}
            </div>
          </>
        )}
      </button>
    </>
  );
}
