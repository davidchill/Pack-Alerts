'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DiagnosticMeta, RetailerDiagnostic } from '../api/stock/route';

interface StockEntry {
  id: string;
  name: string;
  retailer: 'Best Buy' | 'Target' | 'Walmart' | 'Barnes & Noble';
  sku: string;
  url: string;
  image?: string;
  inStock: boolean;
  price?: string;
  checkedAt: string;
  error?: string;
}

type RetailerFilter = 'All' | 'Best Buy' | 'Target' | 'Walmart' | 'Barnes & Noble';
type StatusFilter = 'All' | 'In Stock' | 'Out of Stock';
type SortKey = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'checked-desc' | 'checked-asc';

const RETAILER_STYLES: Record<string, string> = {
  'Best Buy':        'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Target':          'bg-red-500/15 text-red-400 border-red-500/30',
  'Walmart':         'bg-[#0071ce]/15 text-[#0071ce] border-[#0071ce]/30',
  'Barnes & Noble':  'bg-green-900/30 text-green-400 border-green-800/50',
};

function parsePrice(price?: string): number {
  if (!price) return Infinity;
  const n = parseFloat(price.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? Infinity : n;
}

function fmtTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

// ─── Diagnostic panel ─────────────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  ok:       'bg-[#00ff88]',
  degraded: 'bg-amber-400',
  error:    'bg-red-500',
};

const STATUS_BADGE: Record<string, string> = {
  ok:       'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',
  degraded: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  error:    'bg-red-500/10 text-red-400 border-red-500/30',
};

const STATUS_LABEL: Record<string, string> = {
  ok:       'Healthy',
  degraded: 'Degraded',
  error:    'Error',
};

function RetailerRow({
  diag,
  targetCache,
  walmartCache,
  bnCache,
  apiKeyPresent,
}: {
  diag: RetailerDiagnostic;
  targetCache: DiagnosticMeta['targetCache'];
  walmartCache: DiagnosticMeta['walmartCache'];
  bnCache: DiagnosticMeta['bnCache'];
  apiKeyPresent: boolean;
}) {
  const showWarning = diag.blockedSignal || diag.rateLimitSignal || diag.botDetectSignal || diag.status === 'error';

  return (
    <div className="px-6 py-4 border-b border-[#1e1e2e] last:border-0">
      {/* Main metric row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

        {/* Status dot + retailer name */}
        <div className="flex items-center gap-2 min-w-[110px]">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[diag.status]}`} />
          <span className="font-semibold text-sm text-white">{diag.retailer}</span>
        </div>

        {/* Status badge */}
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_BADGE[diag.status]}`}>
          {STATUS_LABEL[diag.status]}
        </span>

        {/* Fetched / tracked */}
        <span className="text-xs text-gray-400">
          {diag.tracked !== null
            ? `${diag.fetched} / ${diag.tracked} products`
            : `${diag.fetched} products`}
        </span>

        {/* Error count */}
        {diag.errored > 0 && (
          <span className="text-xs text-red-400 font-medium">
            {diag.errored} {diag.errored === 1 ? 'error' : 'errors'}
          </span>
        )}

        {/* Response time */}
        {diag.responseTimeMs !== null && (
          <span className="text-xs text-gray-500">
            {diag.retailer === 'Target' && targetCache.wasHit
              ? `cache hit · ${fmtTime(diag.responseTimeMs)}`
              : fmtTime(diag.responseTimeMs)}
          </span>
        )}

        {/* HTTP error codes */}
        {diag.httpCodes.map((code) => (
          <span
            key={code}
            className="text-xs font-mono bg-red-900/30 text-red-400 border border-red-500/30 rounded px-1.5 py-0.5"
          >
            HTTP {code}
          </span>
        ))}

        {/* Target cache status */}
        {diag.retailer === 'Target' && (
          <span className={`text-xs ml-auto ${targetCache.warm ? 'text-[#00ff88]/70' : 'text-gray-600'}`}>
            {targetCache.warm && targetCache.expiresAt
              ? `Cache warm · expires in ${fmtDuration(new Date(targetCache.expiresAt).getTime() - Date.now())}`
              : targetCache.warm
              ? 'Cache warm'
              : 'Cache cold'}
          </span>
        )}

        {/* Walmart cache status */}
        {diag.retailer === 'Walmart' && (
          <span className={`text-xs ml-auto ${walmartCache.warm ? 'text-[#00ff88]/70' : 'text-gray-600'}`}>
            {walmartCache.warm && walmartCache.expiresAt
              ? `Cache warm · expires in ${fmtDuration(new Date(walmartCache.expiresAt).getTime() - Date.now())}`
              : walmartCache.warm
              ? 'Cache warm'
              : 'Cache cold'}
          </span>
        )}

        {/* Barnes & Noble cache status */}
        {diag.retailer === 'Barnes & Noble' && (
          <span className={`text-xs ml-auto ${bnCache.warm ? 'text-[#00ff88]/70' : 'text-gray-600'}`}>
            {bnCache.warm && bnCache.expiresAt
              ? `Cache warm · expires in ${fmtDuration(new Date(bnCache.expiresAt).getTime() - Date.now())}`
              : bnCache.warm
              ? 'Cache warm'
              : 'Cache cold'}
          </span>
        )}

        {/* Best Buy API key status */}
        {diag.retailer === 'Best Buy' && (
          <span className={`text-xs ml-auto ${apiKeyPresent ? 'text-gray-600' : 'text-red-400 font-bold'}`}>
            {apiKeyPresent ? 'API key present' : 'API KEY MISSING'}
          </span>
        )}
      </div>

      {/* Warning / error detail sub-row */}
      {showWarning && (
        <div className="mt-3 flex items-start gap-2">
          <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
          <div className="space-y-1">
            {diag.blockedSignal && (
              <p className="text-xs font-semibold text-amber-400">
                Possible IP block — HTTP 403 responses detected. Target may have flagged this server&apos;s IP.
              </p>
            )}
            {diag.rateLimitSignal && (
              <p className="text-xs font-semibold text-amber-400">
                Rate limited — HTTP 429 responses detected. Reduce refresh frequency.
              </p>
            )}
            {diag.botDetectSignal && (
              <p className="text-xs font-semibold text-amber-400">
                Bot detection triggered — {diag.retailer} returned a challenge page.
                {diag.retailer === 'Barnes & Noble'
                  ? ' Akamai JS challenge detected — requires a browser-capable fetch strategy to resolve.'
                  : ' Try refreshing; persistent failures may require a different User-Agent or longer delay between requests.'}
              </p>
            )}
            {!diag.blockedSignal && !diag.rateLimitSignal && !diag.botDetectSignal && diag.status === 'error' && diag.errorSample && (
              <p className="text-xs font-semibold text-red-400">
                {diag.retailer === 'Best Buy' && !apiKeyPresent
                  ? 'API key is missing or invalid.'
                  : 'Retailer API unavailable.'}
              </p>
            )}
            {diag.errorSample && (
              <p className="text-xs font-mono text-gray-500 break-all">{diag.errorSample}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DiagnosticPanel({
  meta,
  loading,
}: {
  meta: DiagnosticMeta | null;
  loading: boolean;
}) {
  const overallStatus = meta
    ? meta.retailers.some((r) => r.status === 'error' || r.blockedSignal || r.rateLimitSignal)
      ? 'error'
      : meta.retailers.some((r) => r.status === 'degraded')
      ? 'degraded'
      : 'ok'
    : null;

  return (
    <div className="mb-8 bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1e1e2e] bg-[#0f0f18]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            API Health
          </span>
          {overallStatus && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_BADGE[overallStatus]}`}>
              {overallStatus === 'ok' ? 'All Systems OK' : overallStatus === 'degraded' ? 'Degraded' : 'Issues Detected'}
            </span>
          )}
        </div>
        {meta && (
          <span className="text-xs text-gray-600">
            as of {new Date(meta.generatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && !meta && (
        <div className="px-6 py-5 space-y-3">
          {['Best Buy', 'Target', 'Walmart', 'Barnes & Noble'].map((r) => (
            <div key={r} className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e1e2e] animate-pulse" />
              <span className="text-sm text-gray-600">{r}</span>
              <span className="text-xs text-gray-700 animate-pulse">Checking...</span>
            </div>
          ))}
        </div>
      )}

      {/* Retailer rows */}
      {meta && meta.retailers.map((diag) => (
        <RetailerRow
          key={diag.retailer}
          diag={diag}
          targetCache={meta.targetCache}
          walmartCache={meta.walmartCache}
          bnCache={meta.bnCache}
          apiKeyPresent={meta.apiKeyPresent.bestBuy}
        />
      ))}
    </div>
  );
}

// ─── Filter / Sort controls ───────────────────────────────────────────────────

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-widest shrink-0">{label}</span>
      <div className="flex rounded-lg overflow-hidden border border-[#1e1e2e]">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              value === opt
                ? 'bg-[#00ff88] text-black'
                : 'bg-[#12121a] text-gray-400 hover:text-white hover:bg-[#1e1e2e]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const options: { value: SortKey; label: string }[] = [
    { value: 'name-asc',     label: 'Name A→Z' },
    { value: 'name-desc',    label: 'Name Z→A' },
    { value: 'price-asc',    label: 'Price Low→High' },
    { value: 'price-desc',   label: 'Price High→Low' },
    { value: 'checked-desc', label: 'Checked Newest' },
    { value: 'checked-asc',  label: 'Checked Oldest' },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-widest shrink-0">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="bg-[#12121a] border border-[#1e1e2e] text-gray-300 text-xs rounded-lg px-3 py-1.5 outline-none hover:border-gray-600 focus:border-[#00ff88] transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [meta, setMeta] = useState<DiagnosticMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [dataIsStale, setDataIsStale] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [retailerFilter, setRetailerFilter] = useState<RetailerFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');

  const CACHE_KEY = 'packalerts-admin-snapshot';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      if (!saved) return;
      const { entries: e, meta: m, lastRefresh: ts } = JSON.parse(saved);
      setEntries(e);
      setMeta(m);
      setLastRefresh(new Date(ts));
      setDataIsStale(true);
    } catch {
      // corrupt or missing — ignore
    }
  }, []);

  async function fetchStock() {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error ?? 'API request failed');
      } else {
        const ts = new Date();
        setEntries(data.entries ?? data);
        setMeta(data.meta ?? null);
        setLastRefresh(ts);
        setDataIsStale(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          entries: data.entries ?? data,
          meta: data.meta ?? null,
          lastRefresh: ts.toISOString(),
        }));
      }
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const inStockCount = entries.filter((e) => e.inStock).length;

  const displayedEntries = useMemo(() => {
    let filtered = entries;

    if (retailerFilter !== 'All') {
      filtered = filtered.filter((e) => e.retailer === retailerFilter);
    }
    if (statusFilter === 'In Stock') {
      filtered = filtered.filter((e) => e.inStock && !e.error);
    } else if (statusFilter === 'Out of Stock') {
      filtered = filtered.filter((e) => !e.inStock && !e.error);
    }

    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'name-asc':     return a.name.localeCompare(b.name);
        case 'name-desc':    return b.name.localeCompare(a.name);
        case 'price-asc':    return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':   return parsePrice(b.price) - parsePrice(a.price);
        case 'checked-desc': return new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime();
        case 'checked-asc':  return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime();
      }
    });
  }, [entries, retailerFilter, statusFilter, sortKey]);

  const isFiltered = retailerFilter !== 'All' || statusFilter !== 'All';

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
                Last checked: {lastRefresh.toLocaleString()}
                {dataIsStale && <span className="ml-2 text-gray-600">(cached)</span>}
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

        {/* Diagnostic panel */}
        <DiagnosticPanel meta={meta} loading={loading} />

        {/* Network-level error banner (can't reach /api/stock at all) */}
        {fetchError && (
          <div className="mb-6 bg-red-900/30 border border-red-500/40 rounded-xl px-6 py-4 text-red-400 text-sm">
            <span className="font-bold">Network error: </span>{fetchError}
          </div>
        )}

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

        {/* Filters + Sort toolbar */}
        {!loading && entries.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FilterGroup
              label="Retailer"
              options={['All', 'Best Buy', 'Target', 'Walmart', 'Barnes & Noble'] as RetailerFilter[]}
              value={retailerFilter}
              onChange={setRetailerFilter}
            />
            <FilterGroup
              label="Status"
              options={['All', 'In Stock', 'Out of Stock'] as StatusFilter[]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <div className="ml-auto">
              <SortSelect value={sortKey} onChange={setSortKey} />
            </div>
          </div>
        )}

        {/* Result count when filtered */}
        {!loading && isFiltered && (
          <p className="text-xs text-gray-500 mb-3">
            Showing {displayedEntries.length} of {entries.length} products
          </p>
        )}

        {/* Table */}
        {!loading && entries.length === 0 && !fetchError ? (
          <div className="text-center text-gray-500 py-24">
            <p className="text-sm">No data yet — click <span className="text-white font-semibold">Refresh</span> to check stock.</p>
          </div>
        ) : loading && entries.length === 0 ? (
          <div className="text-center text-gray-500 py-24">Fetching stock data...</div>
        ) : (
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            {displayedEntries.length === 0 ? (
              <div className="text-center text-gray-500 py-16 text-sm">
                No products match the current filters.
              </div>
            ) : (
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
                  {displayedEntries.map((entry, i) => (
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
            )}
          </div>
        )}

      </div>
    </main>
  );
}
