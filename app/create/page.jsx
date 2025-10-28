"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://flowserver.onrender.com";

export default function CreatePage() {
  const { publicKey, connected } = useWallet();
  const ownerPublicKeyDetected = useMemo(() => (publicKey ? publicKey.toBase58() : ""), [publicKey]);
  const [ownerPublicKey, setOwnerPublicKey] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [lamportsPerSecond, setLamportsPerSecond] = useState("1000000");
  function extractYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") {
        return u.pathname.slice(1).split("?")[0];
      }
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("/")[0];
        if (u.searchParams.get("v")) return u.searchParams.get("v");
      }
    } catch {}
    return null;
  }

  function handleVideoUrlChange(val) {
    setVideoUrl(val);
    const id = extractYouTubeId(val);
    if (id) {
      const embed = `https://www.youtube.com/embed/${id}`;
      const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      setVideoUrl(embed);
      if (!thumbnailUrl) setThumbnailUrl(thumb);
    }
  }


  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ownerPublicKeyDetected && !ownerPublicKey) setOwnerPublicKey(ownerPublicKeyDetected);
  }, [ownerPublicKeyDetected]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ownerPublicKey,
        title,
        description,
        videoUrl,
        thumbnailUrl,
        lamportsPerSecond: Number(lamportsPerSecond),
      };

      const resp = await fetch(`${API_BASE}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || "Submission failed");
      }
      setMessage("Your video is pending admin approval.");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setLamportsPerSecond("");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-4">Submit a Video</h1>
        <p className="text-sm text-gray-400 mb-6">Provide a hosted video URL and thumbnail, plus a price in lamports per second.</p>

        <div className="mb-4 text-sm text-gray-400">Paste your public key below.</div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Owner Public Key</label>
            <input
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              value={ownerPublicKey}
              onChange={(e) => setOwnerPublicKey(e.target.value)}
              placeholder="Paste your wallet address"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Video URL</label>
            <input
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              type="url"
              value={videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              required
              placeholder="https://youtu.be/... or https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Thumbnail URL</label>
            <input
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Price (fixed)</label>
            <input
              className="w-full bg-black/30 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600"
              type="text"
              value={`1,000,000 lamports/s (10 FLOW/s)`}
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-medium rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {message && <div className="text-green-400 text-sm">{message}</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}


