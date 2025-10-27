# Flow402x  
**The streaming layer of the open payment web**  
Built on the x402 payment standard.

---

## Overview

Flow402x extends **x402** — the HTTP 402 "Payment Required" standard — to enable **streaming-based micropayments**.  
It allows pay-per-view and pay-per-second access to digital content, APIs, or data streams with no subscriptions, logins, or intermediaries.

Flow402x synchronizes two flows:  
the **flow of content** and the **flow of payments**.

When the money flows, the stream flows.  
When it stops, so does access.

The protocol defines a minimal specification and SDK to make it easy for developers to integrate streaming payments into any content delivery, media, or data platform.

---

## Key Concepts

### Granularity
Content providers determine their own monetization model — either **per view** or **per second** — through Flow402x configuration headers.  
Each content stream is priced dynamically, with autonomous payments triggered by usage.

### x402 Integration
Flow402x is directly compatible with the **x402 Payment Required** standard.  
It uses the same HTTP 402 response mechanism to negotiate payments before access is granted.

### Autonomous Access
AI agents, smart devices, or humans can interact with Flow402x-enabled resources.  
Payments occur autonomously at the protocol level — no pre-funded accounts, API keys, or subscriptions.

### Extensibility
Flow402x supports multiple blockchain networks through **Flow Token Adapters**, allowing issuers to select the settlement network that fits their latency and cost needs.

---

## Architecture
```
Client (User / Agent)
         |
         | 1. Request Stream
         ▼
Server (Flow402x Gateway)
         | 2. Responds with HTTP 402
         |    - Payment-Address
         |    - Rate-Per-Second / Rate-Per-View
         |    - Token Type
         ▼
      Client
         | 3. Initiates Payment
         ▼
      Server
         | 4. Grants Access
         ▼
Content Stream (Video / Data / API)
```

The Flow402x Gateway handles the HTTP 402 negotiation, validates on-chain payments, and manages access to the requested stream or resource.

---

## Example Flow

**Request (Client → Server):**
```http
GET /stream/ufc/302
Host: api.flow402x.org
```

**Response (Server → Client):**
```http
HTTP/1.1 402 Payment Required
Payment-Address: 0x31F...82
Payment-Rate: 0.01 USD/second
Payment-Token: USDC
Network: Base
```

Once payment is detected or authorized, the gateway returns 200 OK and begins the stream.

**Example Payment Validation (SDK):**
```js
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
```

When the payment flow ends, the client automatically terminates the stream.

---

## SDK Integration

The Flow402x SDK provides developers with a simple interface for integrating pay-per-use or pay-per-second monetization.

**Server Example (Node.js Middleware):**
```js
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
```

This middleware handles payment validation and session lifecycle, granting access once x402-compliant payment confirmation is received.

---

## Supported Networks

Flow402x is blockchain-agnostic and currently supports any x402-compatible network, including:

- Base (USDC)
- Solana (USDC-SPL)

New networks can be integrated through Flow Token Adapters, which handle transaction formatting and validation.

---

## Flow Token Adapters

A Flow Token Adapter defines how Flow402x interacts with a specific blockchain or token.
```ts
interface FlowTokenAdapter {
  createPayment(recipient: string, amount: number): Promise<string>;
  validatePayment(txHash: string): Promise<boolean>;
  getBalance(address: string): Promise<number>;
}
```

Adapters can be written in any language.  
The Flow402x SDK automatically detects available adapters and routes payments accordingly.

---

## AI Agent Compatibility

Flow402x is designed for autonomous agents that can initiate payments for content, data, or compute.  
Agents can dynamically pay for what they consume, freeing APIs and media endpoints from traditional authentication models.

**Example Agent Flow:**
```python
agent.request(
    "GET",
    "https://api.flow402x.org/stream/football",
    headers={"x402-autopay": True}
)
```

Upon receiving a 402 response, the agent executes the required payment and resumes access automatically.

---

## Storage Integration

To support decentralized content distribution, Flow402x integrates with Arweave and IPFS for optional data storage.  
Access to encrypted files or live feeds is conditional on continuous, verified payments through the Flow402x gateway.

---

## The Flow Indexer

The Flow Indexer will serve as a public directory of Flow402x-compatible content providers and APIs.  
It will allow discovery and integration of pay-per-use resources, forming the foundation of a verifiable, open payment web.

---

## Roadmap

- Integration with x402 core specification
- Solana and Base payment adapters
- Flow402x SDK (JavaScript & Python)
- Public Flow Indexer
- AI AgentKit integration for autonomous access
- Decentralized content support (Arweave / IPFS)
