import "./../styles/globals.css";
import Providers from "./providers";

export const metadata = {
  title: "WEB5DTV.",
  description:
    "PPS (pay-per-second) streaming via HTTP 402 + Solana devnet.",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white antialiased">
        <Providers>
          <Header />
          <div className="pt-20">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

// 🔹 Global Header
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b bg-black/40 backdrop-blur-md border-neutral-800">
      <nav className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <a href="https://x402.hahz.live" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
          <span className="font-semibold tracking-tight">WEB5DTV.</span>
        </a>

        <div className="flex items-center gap-6 text-sm text-gray-300">
          <a href="/create" className="transition hover:text-white">
            Create
          </a>

          <a
            href="https://hahz.live"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Subscribe
          </a>

          <a
            href="https://app.luvnft.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center transition hover:text-white"
            aria-label="LUV NFT"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87
                C13.46 5.99 14.96 5 16.5 5 
                18.58 5 20 6.42 20 8.5
                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
