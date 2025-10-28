"use client";

import { useState, useEffect } from "react";
import TransitionModal from "./components/TransitionModal";

export default function Landing() {
  const [overlay, setOverlay] = useState(0);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setOverlay(Math.min(window.scrollY / window.innerHeight, 1) * 0.6);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative min-h-screen text-white bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ opacity: overlay }}
      />

      {/* --- HERO --- */}
      <section className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="text-5xl font-semibold mb-4 tracking-tight">Flow402x</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            An open protocol for <span className="text-white">streaming-native payments</span>.
            Per-second, frictionless settlement for digital content and APIs — powered by Solana.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              className="button-primary"
              onClick={() => setShowTransition(true)}
            >
              View Demo
            </button>
            <a
              href="#overview"
              className="bg-neutral-900 hover:bg-neutral-800 px-6 py-3 rounded-lg transition"
            >
              Learn More
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900 hover:bg-neutral-800 px-6 py-3 rounded-lg transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section id="overview" className="max-w-5xl mx-auto px-6 py-24 space-y-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-100">
            The best way to monetize live digital content
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-3xl">
            Built around <b>HTTP 402</b>, Flow402x enables continuous billing for video,
            data, and API streams — no subscriptions, no accounts, no intermediaries.
            Payments flow in real time and stop instantly when access ends.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature title="Granularity" text="Per-second or per-byte billing with full transparency." />
          <Feature title="Instant Settlement" text="Accept payments at blockchain speed, not T+2." />
          <Feature title="Chain-Agnostic" text="Compatible with any stablecoin on performant networks." />
          <Feature title="Frictionless" text="Integrate with one middleware line; no registration required." />
          <Feature title="Open Standard" text="Vendor-neutral and fully composable." />
          <Feature title="Web-Native" text="Activates HTTP 402 via standard headers and status codes." />
        </div>
      </section>

      {/* --- ARCHITECTURE --- */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-16">
        <div className="glass p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Architecture</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li><b>Gateway:</b> A delegate wallet authorized for a capped allowance per session.</li>
            <li><b>Approval:</b> User signs an <code className="bg-neutral-900 px-1 rounded">approveChecked</code> instruction to grant temporary access.</li>
            <li><b>Transfer loop:</b> Server streams tokens each second using <code className="bg-neutral-900 px-1 rounded">createTransferCheckedInstruction</code>.</li>
            <li><b>Variable pricing:</b> Rates can be adjusted dynamically per content or resource type.</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl space-y-6">
          <h3 className="text-xl font-semibold text-gray-100">Core Transfer Logic</h3>
          <pre className="bg-neutral-950 p-4 rounded-lg text-sm overflow-x-auto text-gray-300 border border-neutral-800">
{`const tx = new Transaction();
tx.recentBlockhash = blockhash;
tx.feePayer = gatewayKey.publicKey;

tx.add(createTransferCheckedInstruction(
  userAta,
  usdcMint,
  creatorAta,
  gatewayKey.publicKey,
  perSecond, // 1 token/sec
  6,
  [],
  TOKEN_PROGRAM_ID
));

tx.add(new TransactionInstruction({
  programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  data: Buffer.from(\`flow402x-\${Date.now()}\`)
}));

tx.sign(gatewayKey);
await connection.sendRawTransaction(tx.serialize());`}
          </pre>
          <p className="text-gray-500 text-sm leading-relaxed">
            Each transaction represents one payment tick.  
            The memo ensures uniqueness while minimizing RPC requests.
          </p>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-24 space-y-16">
        <div className="glass p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Use Cases</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Per-second monetization for video, audio, or livestreams.</li>
            <li>Dynamic API pricing without subscriptions or keys.</li>
            <li>Pay-per-view or pay-per-byte content models.</li>
            <li>On-chain revenue sharing between creators and distributors.</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-100">Vision</h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Flow402x is designed to be the web’s native micropayment layer —  
            an open, composable primitive for real-time value transfer.  
            Transparent. Permissionless. Built for developers.
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="text-center text-gray-500 text-sm py-16 border-t border-neutral-800">
        © 2025 Flow402x — open-source protocol built on Solana.
      </footer>

      {showTransition && (
        <TransitionModal onDone={() => (window.location.href = "/demo")} />
      )}
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div className="glass p-6 rounded-xl space-y-2">
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
