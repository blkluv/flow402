"use client";

import { useEffect, useRef } from "react";

export default function Player({ isPlaying, type = "random" }) {
  const videoRef = useRef(null);
  const youtubeRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (type !== "youtube") return;
    
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
  }, [type]);

  useEffect(() => {
    if (type === "youtube" && playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } else if (type !== "youtube" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, type]);

  const sources = {
    youtube: {
      kind: "youtube",
      id: "KV_qe_YAGoQ", // YouTube video ID
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

  const src = sources[type] || sources.random;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
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
