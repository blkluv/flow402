# Flow402x  
**The streaming layer of the open payment web.**  
Built on the x402 payment standard.

---

## Overview

Flow402x extends **x402** — the HTTP 402 "Payment Required" standard — to enable **streaming-based micropayments**.  
It allows pay-per-view and pay-per-second access to digital content, APIs, or data streams with no subscriptions, logins, or intermediaries.  

The protocol synchronizes two flows:  
the **flow of content** and the **flow of payments**.

When the money flows, the stream flows.  
When it stops, so does access.

Flow402x defines a simple set of specifications, SDK functions, and middleware that make it possible to build pay-as-you-go streaming systems powered by on-chain payments.

---

## Key Concepts

**Granularity**  
Content providers define their monetization model — *per-view* or *per-second* — through Flow402x configuration headers.  
Each content stream is priced dynamically, with autonomous payments triggered by usage.

**x402 Integration**  
Flow402x is fully compatible with x402. It uses the same HTTP 402 response mechanism to request and validate payments before granting access to media or data.

**Autonomous Access**  
AI agents, applications, or users can interact directly with Flow402x-enabled resources. No pre-funded accounts or API keys are required. Payments occur at the protocol level.

**Open and Extensible**  
Built as an open standard, Flow402x supports multiple blockchain networks through **Flow Token Adapters**, allowing issuers to select the payment rail that best suits their latency and cost requirements.

---

## Architecture

Client (User / Agent)
|
| 1. Request Stream
▼
Server (Flow402x Gateway)
| 2. Responds with HTTP 402
| - Payment-Address
| - Rate-Per-Second / Rate-Per-View
| - Token Type
▼
Client
| 3. Initiates Payment
▼
Server
| 4. Grants Access
▼
Content Stream (Video / Data / API)

yaml
Copy code

The Flow402x Gateway handles the HTTP 402 negotiation, validates on-chain payments, and manages access to the requested stream or resource.

---

## Example Flow

**Request (Client → Server):**
```http
GET /stream/ufc/302
Host: api.flow402x.org
Response (Server → Client):

http
Copy code
HTTP/1.1 402 Payment Required
Payment-Address: 0x31F...82
Payment-Rate: 0.01 USD/second
Payment-Token: USDC
Network: Base
Once payment is detected or authorized, the gateway returns 200 OK and begins the stream.

Example Payment Validation (SDK):

js
Copy code
import { FlowClient } from "flow402x-sdk";

const client = new FlowClient({
  provider: "solana",
  token: "USDC",
});

await client.payStream({
  recipient: "0x31F...82",
  rate: 0.01,        // USD per second
  duration: 60,      // 60 seconds access
});
When the payment flow ends, the client automatically terminates the stream.

SDK Integration
The Flow402x SDK provides an easy way for developers to integrate streaming payments into any web or API service.

Server-Side Example (Node.js Middleware):

js
Copy code
import { flowMiddleware } from "flow402x";

app.use("/premium-stream", flowMiddleware({
  rate: "0.01",             // USD per second
  token: "USDC",
  network: "base",
  recipient: "0xYourAddress"
}));

app.get("/premium-stream", (req, res) => {
  res.sendFile("/videos/stream.mp4");
});
This middleware abstracts away the complexity of payment negotiation, allowing real-time access control with minimal setup.

Supported Networks
Flow402x is blockchain-agnostic and currently supports any x402-compatible network, including:

Base (USDC)

Solana (USDC-SPL)

Arbitrum (USDC / USDT)

Ethereum (DAI)

Polygon (USDC)

Additional networks can be integrated through Flow Token Adapters, lightweight modules that handle transaction formatting and confirmation for different ecosystems.

Flow Token Adapters
A Flow Token Adapter defines how Flow402x interacts with a specific blockchain or token.
Each adapter standardizes three core functions:

ts
Copy code
interface FlowTokenAdapter {
  createPayment(recipient: string, amount: number): Promise<string>;
  validatePayment(txHash: string): Promise<boolean>;
  getBalance(address: string): Promise<number>;
}
Adapters can be extended for Layer 2s or alternative settlement networks.

AI Agent Compatibility
Flow402x is compatible with autonomous AI agents that can initiate payments on behalf of users or organizations.
Agents can dynamically pay for access to:

API data streams

Compute services

Media or educational content

Example Agent Flow:

python
Copy code
agent.request("GET", "https://api.flow402x.org/stream/football",
              headers={"x402-autopay": True})
When the 402 response is received, the agent executes the required payment and resumes access automatically — no human intervention required.

Storage Integration
To enable decentralized content delivery, Flow402x can be combined with distributed storage systems such as Arweave or IPFS.
Payment verification and content decryption occur through the same Flow402x session, ensuring access is conditional on continuous payment.

The Flow Indexer
The Flow Indexer is a planned registry of Flow402x-compatible streams and APIs.
It will allow discovery, rating, and integration of pay-per-use and pay-per-view content providers, creating a searchable directory for the open payment web.

Roadmap
Integration with x402 core specification

Solana-based micropayment adapter

Flow402x SDK (JavaScript & Python)

Open Flow Indexer

AI AgentKit integration for autonomous access

Decentralized content support via IPFS / Arweave

