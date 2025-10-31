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
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ opacity: overlay }}
      />

      {/* --- HERO --- */}
      <section className="grid min-h-screen px-6 text-center place-items-center">
        <div>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight">WEB5DTV.</h1>
          <p className="max-w-xl mx-auto mb-8 text-lg text-gray-400">
            An open protocol for <span className="text-white">streaming-native payments</span>.
            Per-second, frictionless settlement for digital content and APIs — powered by Solana.
          </p>

          <div className="flex justify-center gap-4">
            <button
              className="button-primary"
              onClick={() => setShowTransition(true)}
            >
              View Demo
            </button>
            <a
              href="#overview"
              className="px-6 py-3 transition rounded-lg bg-neutral-900 hover:bg-neutral-800"
            >
              For Devs
            </a>
            <a
              href="https://github.com/JamieMay2020/flow402/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 transition rounded-lg bg-neutral-900 hover:bg-neutral-800"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section id="overview" className="max-w-5xl px-6 py-24 mx-auto space-y-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-100">
            The best way to monetize live digital content
          </h2>
          <p className="max-w-3xl leading-relaxed text-gray-400">
            Built around <b>HTTP 402</b>, WEB5DTV. enables continuous billing for video,
            data, and API streams — no subscriptions, no accounts, no intermediaries.
            Payments flow in real time and stop instantly when access ends.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <Feature title="Granularity" text="Per-second or per-byte billing with full transparency." />
          <Feature title="Instant Settlement" text="Accept payments at blockchain speed, not T+2." />
          <Feature title="Chain-Agnostic" text="Compatible with any stablecoin on performant networks." />
          <Feature title="Frictionless" text="Integrate with one middleware line; no registration required." />
          <Feature title="Open Standard" text="Vendor-neutral and fully composable." />
          <Feature title="Web-Native" text="Activates HTTP 402 via standard headers and status codes." />
        </div>
      </section>

      {/* --- ARCHITECTURE --- */}
      <section className="max-w-5xl px-6 pt-24 pb-12 mx-auto space-y-16">
        <div className="p-6 space-y-6 glass rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-100">Architecture</h2>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li><b>Gateway:</b> A delegate wallet authorized for a capped allowance per session.</li>
            <li><b>Approval:</b> User signs an <code className="px-1 rounded bg-neutral-900">approveChecked</code> instruction to grant temporary access.</li>
            <li><b>Transfer loop:</b> Server streams tokens each second using <code className="px-1 rounded bg-neutral-900">createTransferCheckedInstruction</code>.</li>
            <li><b>Variable pricing:</b> Rates can be adjusted dynamically per content or resource type.</li>
          </ul>
        </div>

        <div className="p-6 space-y-6 glass rounded-xl">
          <h3 className="text-xl font-semibold text-gray-100">Core Transfer Logic</h3>
          <pre className="p-4 overflow-x-auto text-sm text-gray-300 border rounded-lg bg-neutral-950 border-neutral-800">
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
          <p className="text-sm leading-relaxed text-gray-500">
            Each transaction represents one payment tick.  
            The memo ensures uniqueness while minimizing RPC requests.
          </p>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section className="max-w-5xl px-6 pt-12 pb-24 mx-auto space-y-16">
        <div className="p-6 space-y-6 glass rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-100">Use Cases</h2>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li>Per-second monetization for video, audio, or livestreams.</li>
            <li>Dynamic API pricing without subscriptions or keys.</li>
            <li>Pay-per-view or pay-per-byte content models.</li>
            <li>On-chain revenue sharing between creators and distributors.</li>
          </ul>
        </div>

        <div className="p-6 space-y-4 text-center glass rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-100">Vision</h2>
          <p className="max-w-2xl mx-auto leading-relaxed text-gray-400">
            WEB5DTV. is designed to be the web’s native micropayment layer —  
            an open, composable primitive for real-time value transfer.  
            Transparent. Permissionless. Built for developers.
            HDzTPAndwe5XRvReLzLdUNaNCkbVv141ELZ2AGKGCpAA
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 text-sm text-center text-gray-500 border-t border-neutral-800">
        © 2025 WEB5DTV. — open-source protocol built on Solana.
      </footer>

      {showTransition && (
        <TransitionModal onDone={() => (window.location.href = "/demo")} />
      )}
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div className="p-6 space-y-2 glass rounded-xl">
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}


