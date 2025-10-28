"use client";

import {
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createApproveCheckedInstruction
} from "@solana/spl-token";

/**
 * Creates and sends an SPL Token approve instruction from the browser.
 * No Keypair in browser: uses wallet-adapter's sendTransaction.
 */
export async function getTokenInfo() {
  try {
    const mintAddress = process.env.NEXT_PUBLIC_USDC_MINT;
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC || "https://api.devnet.solana.com");

    const mint = await getMint(connection, new PublicKey(mintAddress));
    return {
      decimals: mint.decimals,
      supply: mint.supply.toString(),
      symbol: "PUMP" // you can hardcode or later fetch via metadata
    };
  } catch (err) {
    console.error("Error loading token info:", err);
    return { symbol: "TOKEN" };
  }
}
export async function approveForFlow({
  userPublicKey,
  sendTransaction,
  gatewayPubkey = process.env.NEXT_PUBLIC_GATEWAY_PUBKEY,
  allowance = 1000,
  usdcMint = process.env.NEXT_PUBLIC_USDC_MINT
}) {
  console.log("DEBUG env check →", gatewayPubkey, usdcMint);

  if (!gatewayPubkey || !usdcMint)
    throw new Error("Missing env: NEXT_PUBLIC_GATEWAY_PUBKEY / NEXT_PUBLIC_USDC_MINT");

  const rpc = process.env.NEXT_PUBLIC_RPC || "https://api.mainnet-beta.solana.com";
  const connection = new Connection(rpc);

  const mint = new PublicKey(usdcMint);
  const gateway = new PublicKey(gatewayPubkey);
  const user = new PublicKey(userPublicKey);

  const decimals = 6; // use env if needed
  const amount = BigInt(Math.floor(allowance * 10 ** decimals));

  const userAta = await getAssociatedTokenAddress(mint, user);

  const tx = new Transaction().add(
    createApproveCheckedInstruction(
      userAta, 
      mint,
      gateway,
      user,
      Number(amount),
      decimals
    )
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}


