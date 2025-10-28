"use client";

import { useEffect, useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { approveForFlow } from "../demo/utils/solana";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function WalletPanel({ onApprovalSuccess, onStop }) {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [busy, setBusy] = useState(false);
  const [approved, setApproved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const gatewayPubkey = useMemo(() => process.env.NEXT_PUBLIC_GATEWAY_PUBKEY || "", []);

  useEffect(() => setMounted(true), []);

  async function onApprove() {
    if (!connected || !publicKey) return;
    setBusy(true);
    try {
      const txSig = await approveForFlow({
        userPublicKey: publicKey,
        sendTransaction,
        gatewayPubkey,
        allowance: 1000000,
        usdcMint: process.env.NEXT_PUBLIC_USDC_MINT,
      });
      
      // Start backend streaming
      await fetch("http://localhost:4020/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPubkey: publicKey.toString() }),
      });
      
      setApproved(true);
      console.log("Approve tx:", txSig);
      
      // Notify parent component that approval succeeded
      if (onApprovalSuccess) {
        onApprovalSuccess();
      }
      
    } catch (e) {
      console.error(e);
      alert("Approval failed: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleStop() {
    await fetch("http://localhost:4020/stop", { method: "POST" });
    setApproved(false);
    if (onStop) {
      onStop();
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Wallet & Session</h3>
      <div className="flex items-center gap-3 mb-4">
        {mounted && <WalletMultiButtonDynamic />}
      </div>

      {publicKey && (
        <div className="text-xs text-gray-400 mb-4 break-all">
          {publicKey.toString()}
        </div>
      )}

      <div className="text-sm text-gray-300 mb-4">
        Rate: <b>1 Flow / second</b><b></b>
      </div>

    <div className="flex gap-3">
        <button
            className="button-primary disabled:opacity-50"
            disabled={!connected || approved || busy}
            onClick={onApprove}
        >
            {busy ? "Approving…" : approved ? "Streaming Active" : "Approve & Start"}
        </button>

        <button
            className="button-secondary disabled:opacity-50"
            disabled={!approved}
            onClick={handleStop}
        >
            Stop Streaming
        </button>
    </div>


        <p className="text-xs text-gray-500 mt-3">
        {approved 
            ? "Streaming payments active — 1 token per second."
            : "Grant permission to start streaming token payments."}
        </p>

    </div>
  );
}