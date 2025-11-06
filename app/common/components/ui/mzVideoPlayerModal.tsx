"use client";
import React from "react";
import MzModal from "@/app/common/components/molecule/mzModal";

type MzVideoPlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  title?: string;
  autoPlay?: boolean;
  startTimeSec?: number;
};

const MzVideoPlayerModal: React.FC<MzVideoPlayerModalProps> = ({
  isOpen,
  onClose,
  src,
  title,
  autoPlay = true,
  startTimeSec = 0,
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const extractYouTubeId = React.useCallback((url: string): string | null => {
    try {
      let match = url.match(
        /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?#].*)?$/
      );
      if (match) return match[1];
      const u = new URL(url);
      if (
        /(^|\.)youtube\.com$/.test(u.hostname) ||
        /(^|\.)youtube-nocookie\.com$/.test(u.hostname)
      ) {
        if (u.pathname.startsWith("/watch")) {
          const v = u.searchParams.get("v");
          if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
        }
        const embed = u.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
        if (embed) return embed[1];
      }
    } catch (_) {
      // ignore
    }
    return null;
  }, []);
  const ytId = extractYouTubeId(src);

  React.useEffect(() => {
    if (ytId) return; // iframe 모드에서는 HTMLVideoElement 제어 안 함
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (isOpen) {
      try {
        videoEl.currentTime = Math.max(0, startTimeSec);
        if (autoPlay) {
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch(() => {
              // autoplay 실패시 무시
            });
          }
        }
      } catch (_) {
        // no-op
      }
    } else {
      try {
        videoEl.pause();
      } catch (_) {
        // no-op
      }
    }
  }, [isOpen, autoPlay, startTimeSec, ytId]);

  React.useEffect(() => {
    if (ytId) return;
    return () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        try {
          videoEl.pause();
          videoEl.removeAttribute("src");
          videoEl.load();
        } catch (_) {
          // no-op
        }
      }
    };
  }, [ytId]);

  return (
    <MzModal
      isOpen={isOpen}
      onClose={onClose}
      isWrapped
      isDimmed
      hasHeader
      title={title}
      shouldCloseOnOverlayClick
    >
      <div style={{ position: "relative", width: "100%" }}>
        {ytId ? (
          <iframe
            title={title ?? "video"}
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&start=${Math.max(
              0,
              Math.floor(startTimeSec)
            )}&modestbranding=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: "100%",
              aspectRatio: "16/9",
              display: "block",
              border: 0,
            }}
          />
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay={autoPlay}
            muted
            playsInline
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </div>
    </MzModal>
  );
};

export default MzVideoPlayerModal;
