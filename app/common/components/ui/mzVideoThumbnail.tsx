"use client";
import React from "react";
import styles from "./mzVideoThumbnail.module.scss";

type MzVideoThumbnailProps = {
  src: string;
  alt: string;
  captureTimeSec?: number;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const MzVideoThumbnail: React.FC<MzVideoThumbnailProps> = ({
  src,
  alt,
  captureTimeSec = 1,
  width,
  height,
  className,
  onClick,
  ariaLabel,
}) => {
  const extractYouTubeId = React.useCallback((url: string): string | null => {
    try {
      // youtu.be/<id>
      let match = url.match(
        /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?#].*)?$/
      );
      if (match) return match[1];
      // youtube.com/watch?v=<id>
      const u = new URL(url);
      if (
        /(^|\.)youtube\.com$/.test(u.hostname) ||
        /(^|\.)youtube-nocookie\.com$/.test(u.hostname)
      ) {
        if (u.pathname.startsWith("/watch")) {
          const v = u.searchParams.get("v");
          if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
        }
        // /embed/<id>
        const embed = u.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
        if (embed) return embed[1];
      }
    } catch (_) {
      // ignore parse errors
    }
    return null;
  }, []);

  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;

    async function generate() {
      try {
        // YouTube는 CORS로 비디오 프레임 캡처 불가 → 공식 썸네일 사용
        const ytId = extractYouTubeId(src);
        if (ytId) {
          const ytThumb = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
          if (!cancelled) setThumbnailUrl(ytThumb);
          return;
        }

        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;
        // iOS/Safari 친화
        video.playsInline = true;
        video.src = src;

        await new Promise<void>((resolve, reject) => {
          const onError = () => reject(new Error("video error"));
          const onLoadedMeta = () => resolve();
          video.addEventListener("error", onError, { once: true });
          video.addEventListener("loadedmetadata", onLoadedMeta, {
            once: true,
          });
        });

        const targetTime = Math.min(
          Math.max(0, captureTimeSec),
          isFinite(video.duration) && video.duration > 0
            ? Math.max(0, video.duration - 0.1)
            : captureTimeSec
        );

        await new Promise<void>((resolve, reject) => {
          const onSeeked = () => resolve();
          const onError = () => reject(new Error("seek error"));
          video.addEventListener("seeked", onSeeked, { once: true });
          video.addEventListener("error", onError, { once: true });
          try {
            video.currentTime = targetTime;
          } catch (_e) {
            // 일부 브라우저에서 즉시 seek 실패 시 0으로 재시도
            video.currentTime = 0;
          }
        });

        const canvas = document.createElement("canvas");
        const vw = video.videoWidth || (width ?? 0) || 1280;
        const vh = video.videoHeight || (height ?? 0) || 720;
        canvas.width = vw;
        canvas.height = vh;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context not available");
        ctx.drawImage(video, 0, 0, vw, vh);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        if (!cancelled) setThumbnailUrl(dataUrl);
      } catch (_e) {
        if (!cancelled) setFailed(true);
      }
    }

    setThumbnailUrl(null);
    setFailed(false);
    generate();

    return () => {
      cancelled = true;
    };
  }, [src, captureTimeSec, width, height]);

  const styleProps: React.CSSProperties = {};
  if (width) styleProps.width = width;
  if (height) styleProps.height = height;

  if (thumbnailUrl) {
    const label = ariaLabel ?? alt;
    return onClick ? (
      <button
        type="button"
        className={`${styles.videoThumb} ${className || ""}`.trim()}
        onClick={onClick}
        aria-label={label}
        style={styleProps}
      >
        <img
          src={thumbnailUrl}
          alt={alt}
          className={styles.videoThumb__image}
        />
      </button>
    ) : (
      <div className={`${styles.videoThumb} ${className || ""}`.trim()}>
        <img
          src={thumbnailUrl}
          alt={alt}
          className={styles.videoThumb__image}
          style={styleProps}
        />
      </div>
    );
  }

  if (failed) {
    const label = ariaLabel ?? alt;
    return onClick ? (
      <button
        type="button"
        className={`${styles.videoThumb} ${styles.videoThumb__placeholder} ${
          className || ""
        }`.trim()}
        onClick={onClick}
        aria-label={`${label} 썸네일을 생성할 수 없습니다.`}
        style={styleProps}
      >
        썸네일 생성 불가
      </button>
    ) : (
      <div
        className={`${styles.videoThumb} ${styles.videoThumb__placeholder} ${
          className || ""
        }`.trim()}
        role="img"
        aria-label={`${label} 썸네일을 생성할 수 없습니다.`}
        style={styleProps}
      >
        썸네일 생성 불가
      </div>
    );
  }

  return onClick ? (
    // 로딩 상태
    <button
      type="button"
      className={`${styles.videoThumb} ${styles.videoThumb__placeholder} ${
        className || ""
      }`.trim()}
      onClick={onClick}
      aria-label={`${alt} 썸네일 생성 중`}
      style={styleProps}
    >
      로딩 중...
    </button>
  ) : (
    <div
      className={`${styles.videoThumb} ${styles.videoThumb__placeholder} ${
        className || ""
      }`.trim()}
      role="img"
      aria-label={`${alt} 썸네일 생성 중`}
      style={styleProps}
    >
      로딩 중...
    </div>
  );
};

export default MzVideoThumbnail;
