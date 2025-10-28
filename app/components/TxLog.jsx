"use client";

export default function TxLog({ transactions = [] }) {
  const safeTxs = Array.isArray(transactions) ? transactions : [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Transaction Log</h3>
      <div className="space-y-2 text-sm font-mono">
        {safeTxs.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          safeTxs.map((log, i) => (
            <div key={i} className="text-gray-300">
              {log.txId ? (
                <>
                  {log.text.split("→")[0]}→{" "}
                  <a
                    href={`https://solscan.io/tx/${log.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    {log.text.split("→")[1].trim()}
                  </a>
                </>
              ) : (
                log.text || log
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
