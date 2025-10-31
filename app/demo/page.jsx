"use client";

import { useState, useEffect } from "react";
import Player from "../components/Player";
import WalletPanel from "../components/WalletPanel";
import TxLog from "../components/TxLog";

const RAW_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://flowserver.onrender.com";
const API_BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // built-in types
  const [selectedVideo, setSelectedVideo] = useState(null); // custom video from backend
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [filter, setFilter] = useState('all');

  const handleApprovalSuccess = async () => {
  console.log("✅ Approval successful, waiting for first transfer...");
  
  // 🧹 Clear old transaction logs before new session starts
  setTransactions([]);

  // Poll until first on-chain transfer confirmed
  const checkStatus = async () => {
    try {
      const res = await fetch("https://flowserver.onrender.com/status");
      const data = await res.json();
      if (data.firstTransferConfirmed) {
        console.log("🎬 First transfer confirmed — starting video");
        setIsPlaying(true);
        return;
      }
    } catch (e) {
      console.error("Error checking status:", e);
    }

    // Keep polling every second
    setTimeout(checkStatus, 1000);
  };

  checkStatus();
};

  const handleStop = () => {
  console.log("🛑 Streaming stopped, pausing video...");
  setIsPlaying(false);
  setTransactions([]); // 🧹 Clear logs when stopping
};

  // 🔹 Fetch transaction logs while streaming
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://flowserver.onrender.com/logs");
        const logs = await res.json();
        setTransactions(logs);
      } catch (e) {
        console.error("Failed to fetch logs:", e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // 🔹 Video options
  const items = [
    {
      id: "youtube",
      title: "YouTube Stream",
      description: "Play a live or demo YouTube video.",
      thumbnail: "https://img.youtube.com/vi/1jzROE6EhxM/hqdefault.jpg",
    },
    {
      id: "movie",
      title: "Wolf of Wall Street",
      description: "Stream a movie.",
      thumbnail: "https://github.com/JamieMay2020/flow402/blob/main/wolft.jpg?raw=true",
    },
  ];

  // 🔹 Fetch approved videos from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/videos`);
        const data = await res.json();
        if (!mounted) return;
        setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load videos:", e);
      } finally {
        if (mounted) setLoadingVideos(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="min-h-screen text-white bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="px-6 py-16 mx-auto space-y-10 max-w-7xl">
        <header>
          <h1 className="mb-2 text-3xl font-bold">WEB5DTV. Demo</h1>
          <p className="text-gray-400">
            Select a stream below to start a pay-per-second session.
          </p>
        </header>

        {/* ✅ Stream Selection */}
        {!selectedType && !selectedVideo ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Built-in demo items</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 mb-10 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedType(item.id); setSelectedVideo(null); }}
                  className="cursor-pointer glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 text-left">
                    <h3 className="mb-1 text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Approved videos</h2>
                <button
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={async () => {
                    setLoadingVideos(true);
                    try {
                      const res = await fetch(`${API_BASE}/videos`);
                      const data = await res.json();
                      setVideos(Array.isArray(data) ? data : []);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoadingVideos(false);
                    }
                  }}
                >Refresh</button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded text-sm transition ${
                    filter === 'all' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('video')}
                  className={`px-4 py-2 rounded text-sm transition ${
                    filter === 'video' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setFilter('live')}
                  className={`px-4 py-2 rounded text-sm transition ${
                    filter === 'live' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  Livestreams
                </button>
                <button
                  onClick={() => setFilter('movie')}
                  className={`px-4 py-2 rounded text-sm transition ${
                    filter === 'movie' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  Movies
                </button>
              </div>
            </div>

            {loadingVideos ? (
              <div className="p-5 text-gray-400 glass rounded-xl">Loading approved videos…</div>
            ) : videos.length === 0 ? (
              <div className="p-5 text-gray-400 glass rounded-xl">No approved videos yet.</div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {videos.filter(v => filter === 'all' || v.contentType === filter).map((v) => (
                  <div
                    key={`video-${v.id}`}
                    onClick={() => { setSelectedVideo(v); setSelectedType(null); }}
                    className="cursor-pointer glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      {v.contentType === 'live' && (
                        <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded top-2 left-2">
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="p-5 text-left">
                      <h3 className="mb-1 text-xl font-semibold">{v.title}</h3>
                      {v.description && (
                        <p className="text-sm text-gray-400 break-all">{v.description}</p>
                      )}
                      <p className="text-xs text-gray-500">{(v.lamportsPerSecond/100000).toFixed(0) / 10} FLOW / second</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="p-6 lg:col-span-2 glass">
                <Player isPlaying={isPlaying} type={selectedType} video={selectedVideo} />
              </div>

              <div className="space-y-6">
                <div className="p-6 glass">
                  <WalletPanel
                    onApprovalSuccess={handleApprovalSuccess}
                    onStop={handleStop}
                    uploaderPubkey={selectedVideo ? selectedVideo.ownerPublicKey : undefined}
                  />
                </div>
                <div className="p-6 glass">
                  <TxLog transactions={transactions} />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedType(null);
                setSelectedVideo(null);
                setIsPlaying(false);
              }}
              className="mt-10 text-gray-400 underline hover:text-white underline-offset-2"
            >
              ← Back to stream selection
            </button>
          </>
        )}
      </div>
    </main>
  );
}



