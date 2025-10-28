"use client";

import { useEffect, useRef, useState } from "react";

export default function Player({ isPlaying, type = "random", video = null }) {
  const videoRef = useRef(null);
  const youtubeRef = useRef(null);
  const playerRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  function extractYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("/")[0];
        if (u.searchParams.get("v")) return u.searchParams.get("v");
      }
    } catch {}
    return null;
  }

  useEffect(() => {
    const isYouTube = type === "youtube" || (!!video && extractYouTubeId(video.videoUrl));
    if (!isYouTube) return;
    
    // Load the YouTube iframe API script once
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // When the API is ready, create the player
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        events: {
          onReady: () => {
            console.log("✅ YouTube player ready");
          },
        },
      });
    };
  }, [type, video]);

  useEffect(() => {
    const isYouTube = type === "youtube" || (!!video && extractYouTubeId(video.videoUrl));
    if (isYouTube && playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } else if (!isYouTube && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, type, video]);

  const sources = {
    youtube: {
      kind: "youtube",
      id: "1jzROE6EhxM", // YouTube video ID
    },
    movie: {
      kind: "video",
      url: "https://github.com/JamieMay2020/flow402/blob/main/1027.mp4?raw=true",
      poster: "/movie-poster.jpg",
    },
    random: {
      kind: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  };

  let src = sources[type] || sources.random;
  if (video) {
    const ytId = extractYouTubeId(video.videoUrl);
    if (ytId) {
      src = { kind: "youtube", id: ytId };
    } else {
      src = { kind: "video", url: video.videoUrl, poster: video.thumbnailUrl };
    }
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {video?.ownerPublicKey && (
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          className="absolute top-3 right-3 z-20 bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded"
        >
          Info
        </button>
      )}

      {showInfo && video?.ownerPublicKey && (
        <div className="absolute top-10 right-3 z-20 bg-black/80 border border-neutral-700 rounded p-3 text-xs text-gray-200 max-w-[80%]">
          <div className="font-semibold mb-1">Creator Wallet</div>
          <div className="break-all text-gray-300">{video.ownerPublicKey}</div>
        </div>
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Approval Required
            </h3>
            <p className="text-gray-400">
              Approve token streaming to start watching
            </p>
          </div>
        </div>
      )}

      {src.kind === "youtube" ? (
        <iframe
          id="yt-player"
          ref={youtubeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${src.id}?enablejsapi=1&controls=1&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls={isPlaying}
          loop
          muted
          playsInline
          poster={src.poster || ""}
        >
          <source src={src.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

