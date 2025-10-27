# Flow402x  
**Payment in motion. Built on x402.**

---

### Overview
**Flow402x** is an open protocol for **pay-per-view and pay-per-second streaming**, built on top of the emerging **x402 payment standard** (HTTP 402 — *Payment Required*).  
It enables **frictionless, autonomous payments** for digital content — allowing users, AI agents, and IoT systems to **stream and pay only for what they consume**, with no accounts, subscriptions, or API keys.

Whether it’s live sports, on-demand video, or real-time data feeds, Flow402x allows every second of access to be **metered and settled in real time** using cryptocurrency or stablecoins such as USDC.  

---

###  Why Flow402x?
Today’s paywalls and subscriptions are built for people — not for AI, APIs, or micro-access.  
Flow402x reimagines how access to content can work in a **machine-to-machine** economy:

| Problem | Flow402x Solution |
|----------|------------------|
| Account creation, KYC, and card processing delays | Instant crypto micropayments using x402 |
| Expensive subscriptions and overpaying for unused access | Pay-as-you-go model — only pay for seconds watched |
| Manual API key management | Autonomous, stateless access via HTTP 402 headers |
| High platform fees | Near-zero on-chain fees using stablecoins on efficient networks (e.g. Base, Solana, Arbitrum) |

---

### ⚙️ How It Works
Flow402x builds directly on the **HTTP 402: Payment Required** response standard.

When a client (user, AI agent, or dApp) requests a stream or resource:

1. **Client sends request**  
GET /ufc/stream?id=112
Host: flow402x.io


2. **Server responds with 402 Payment Required**  
HTTP/1.1 402 Payment Required
Payment-Address: 0x1234...
Amount-Per-Second: 0.01
Currency: USDC



3. **Client pays automatically**  
The client (or AI agent) executes a micropayment transaction for the required amount.

4. **Server grants access**  
Upon payment confirmation, the stream begins.  
Payment continues in real time while the client consumes the content.

5. **Session ends when the flow stops**  
Payments halt when the user stops watching — ensuring complete fairness and transparency.

---

### Example Integration
Integrating Flow402x is designed to be as simple as possible:

```js
import { flowMiddleware } from "flow402x";

app.use(flowMiddleware({
rate: "0.01", // USD per second
recipient: "0xYourAddressHere",
token: "USDC"
}));
