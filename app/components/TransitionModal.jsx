"use client";

import { useEffect } from "react";

export default function TransitionModal({ onDone = () => {}, ms = 1400 }) {
  useEffect(() => {
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [ms, onDone]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 backdrop-blur">
      <div className="animate-pulse text-center">
        <div className="text-lg text-gray-300 mb-2">Connecting to Flow402x demo environment…</div>
        <div className="text-xs text-gray-400"></div>
      </div>
    </div>
  );
}
