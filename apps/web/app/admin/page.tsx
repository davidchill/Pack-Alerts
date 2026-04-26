'use client';

import { useEffect, useState } from 'react';

interface StockEntry {
  id: string;
  name: string;
  retailer: 'Best Buy' | 'Target';
  sku: string;
  url: string;
  image?: string;
  inStock: boolean;
  price?: string;
  checkedAt: string;
  error?: string;
}

const RETAILER_STYLES: Record<string, string> = {
  'Best Buy': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Target':   'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function AdminPage() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function fetchStock() {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error ?? 'API request failed');
      } else {
        setEntries(data);
        setLastRefresh(new Date());
      }
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStock();
  }, []);

  const inStockCount = entries.filter((e) => e.inStock).length;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">
              Pack<span className="text-[#00ff88]">Alert</span>
              <span className="text-gray-500">.gg</span>
              <span className="text-gray-500 font-normal text-base ml-3">/ Admin</span>
            </h1>
            {lastRefresh && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchStock}
            disabled={loading}
            className="bg-[#00ff88] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#00e87a] transition-colors disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Stats row */}
        {!loading && entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tracking</p>
              <p className="text-2xl font-black">{entries.length}</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">In Stock</p>
              <p className="text-2xl font-black text-[#00ff88]">{inStockCount}</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Out of Stock</p>
              <p className="text-2xl font-black text-gray-400">{entries.length - inStockCount}</p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {fetchError && (
          <div className="mb-6 bg-red-900/30 border border-red-500/40 rounded-xl px-6 py-4 text-red-400 text-sm">
            <span className="font-bold">API error: </span>{fetchError}
          </div>
        )}

        {/* Table */}
        {loading && entries.length === 0 ? (
          <div className="text-center text-gray-500 py-24">Fetching stock data...</div>
        ) : (
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] text-gray-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 w-16"></th>
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-6 py-4">Retailer</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Checked</th>
                  <th className="text-left px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-[#1e1e2e] last:border-0 hover:bg-[#15151f] transition-colors ${
                      i % 2 === 0 ? '' : 'bg-[#0d0d14]'
                    }`}
                  >
                    <td className="px-4 py-3">
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt={entry.name}
                          className="w-12 h-12 object-contain rounded bg-white/5"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#1e1e2e]" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{entry.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${RETAILER_STYLES[entry.retailer] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
                        {entry.retailer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {entry.error ? (
                        <span className="text-red-400 text-xs" title={entry.error}>
                          Error
                        </span>
                      ) : entry.inStock ? (
                        <span className="inline-flex items-center gap-1.5 text-[#00ff88] font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-gray-600" />
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{entry.price ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(entry.checkedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00ccff] text-xs hover:underline whitespace-nowrap"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}
