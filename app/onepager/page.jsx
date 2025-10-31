"use client";

export default function OnePager() {
  return (
    <main className="min-h-screen text-white bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <section className="max-w-5xl px-6 py-24 mx-auto space-y-16">
        
        {/* --- Intro --- */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-white">WEB5DTV.</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            A streaming-native payment protocol built on <span className="text-gray-100">HTTP 402</span> and Solana.
            Continuous, per-second settlement for digital content, APIs, and live media — without subscriptions or custodians.
          </p>
        </div>

        {/* --- Overview --- */}
        <div className="p-6 space-y-4 glass rounded-xl">
          <h2 className="mb-2 text-2xl font-semibold text-gray-100">Overview</h2>
          <p className="leading-relaxed text-gray-400">
            WEB5DTV. enables per-second billing for online resources using Solana’s token program. 
            It bridges web-native access control (HTTP 402) with real-time on-chain payments, allowing
            developers to meter data, streams, or API usage as continuously as the content itself.
          </p>
        </div>

        {/* --- Architecture --- */}
        <div className="p-6 space-y-4 glass rounded-xl">
          <h2 className="mb-2 text-2xl font-semibold text-gray-100">Architecture</h2>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li><b>Gateway:</b> A delegate wallet authorized to spend a capped allowance per session.</li>
            <li><b>Client approval:</b> User signs an <code className="px-1 text-gray-300 rounded bg-neutral-900">approveChecked</code> instruction for the gateway.</li>
            <li><b>Transfer loop:</b> Server streams tokens each second via <code className="px-1 text-gray-300 rounded bg-neutral-900">createTransferCheckedInstruction</code>.</li>
            <li><b>Variable pricing:</b> The server sets <code className="px-1 text-gray-300 rounded bg-neutral-900">perSecond</code> dynamically per content type.</li>
          </ul>
        </div>

        {/* --- Code Snippet --- */}
        <div className="p-6 glass rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-100">Core Transfer Logic</h2>
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
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Each transaction transfers a single tick of value at a fixed rate.  
            The memo ensures uniqueness and smooth blockhash reuse without RPC overload.
          </p>
        </div>

        {/* --- Use Cases --- */}
        <div className="p-6 space-y-4 glass rounded-xl">
          <h2 className="mb-2 text-2xl font-semibold text-gray-100">Use Cases</h2>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li>Monetize live video or audio streams with per-second settlement.</li>
            <li>Meter API or data access dynamically — no subscriptions or lock-ins.</li>
            <li>Enable real-time revenue sharing between multiple recipients.</li>
            <li>Integrate frictionlessly via standard HTTP middleware.</li>
          </ul>
        </div>

        {/* --- Vision --- */}
        <div className="p-6 space-y-4 text-center glass rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-100">Vision</h2>
          <p className="max-w-2xl mx-auto leading-relaxed text-gray-400">
            WEB5DTV. aims to be the first fully web-native micropayment layer —  
            an open, composable primitive for the streaming economy.  
            Built for developers, designed for the internet.
          </p>
        </div>

        {/* --- Footer --- */}
        <footer className="pt-10 text-sm text-center text-gray-500 border-t border-neutral-800">
          © 2025 WEB5DTV.HAHZ.LIVE — open-source protocol. Built on Solana.
        </footer>
      </section>
    </main>
  );
}
