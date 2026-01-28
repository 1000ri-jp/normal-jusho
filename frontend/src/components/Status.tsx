import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Clock, Activity, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.jusho.dev';
const REFRESH_INTERVAL = 30_000;

interface HealthStatus {
  status: string;
  [key: string]: unknown;
}

interface VersionInfo {
  version?: string;
  name?: string;
  [key: string]: unknown;
}

interface RateLimitInfo {
  [key: string]: unknown;
}

interface StatusData {
  health: HealthStatus | null;
  ready: HealthStatus | null;
  version: VersionInfo | null;
  rateLimit: RateLimitInfo | null;
  errors: Record<string, string>;
  lastUpdated: Date | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function StatusBadge({ ok }: { ok: boolean | null }) {
  if (ok === null) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
        <Clock className="w-4 h-4" />
        Loading...
      </span>
    );
  }
  return ok ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
      <CheckCircle className="w-4 h-4" />
      Healthy
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
      <XCircle className="w-4 h-4" />
      Unhealthy
    </span>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function JsonDisplay({ data }: { data: unknown }) {
  if (data === null || data === undefined) {
    return <p className="text-sm text-gray-500">--</p>;
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return <p className="text-sm text-gray-500">No data</p>;
    }
    return (
      <dl className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-baseline gap-4">
            <dt className="text-sm font-mono text-gray-600 shrink-0">{key}</dt>
            <dd className="text-sm text-gray-900 text-right font-mono truncate">
              {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '--')}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return <p className="text-sm text-gray-900 font-mono">{String(data)}</p>;
}

export function Status() {
  const [data, setData] = useState<StatusData>({
    health: null,
    ready: null,
    version: null,
    rateLimit: null,
    errors: {},
    lastUpdated: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const errors: Record<string, string> = {};

    const [health, ready, version, rateLimit] = await Promise.all([
      fetchJson<HealthStatus>(`${API_URL}/health`).catch((e: Error) => {
        errors.health = e.message;
        return null;
      }),
      fetchJson<HealthStatus>(`${API_URL}/ready`).catch((e: Error) => {
        errors.ready = e.message;
        return null;
      }),
      fetchJson<VersionInfo>(`${API_URL}/`).catch((e: Error) => {
        errors.version = e.message;
        return null;
      }),
      fetchJson<RateLimitInfo>(`${API_URL}/rate-limit-status`).catch((e: Error) => {
        errors.rateLimit = e.message;
        return null;
      }),
    ]);

    setData({ health, ready, version, rateLimit, errors, lastUpdated: new Date() });
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [refresh]);

  const isHealthy = data.health !== null && !data.errors.health;
  const isReady = data.ready !== null && !data.errors.ready;
  const overallOk = data.lastUpdated === null ? null : isHealthy && isReady;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Top</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">API Status</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StatusBadge ok={overallOk} />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {overallOk === null
                  ? 'Checking...'
                  : overallOk
                    ? 'All systems operational'
                    : 'Issues detected'}
              </p>
              {data.lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last checked: {data.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Auto-refresh notice */}
        <p className="text-xs text-gray-400 mb-6 text-center">
          Auto-refreshes every 30 seconds
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health */}
          <InfoCard title="Health Check" icon={Activity}>
            <div className="mb-3">
              <StatusBadge ok={data.lastUpdated === null ? null : isHealthy} />
            </div>
            {data.errors.health ? (
              <p className="text-sm text-red-600">{data.errors.health}</p>
            ) : (
              <JsonDisplay data={data.health} />
            )}
          </InfoCard>

          {/* Ready */}
          <InfoCard title="Readiness Check" icon={CheckCircle}>
            <div className="mb-3">
              <StatusBadge ok={data.lastUpdated === null ? null : isReady} />
            </div>
            {data.errors.ready ? (
              <p className="text-sm text-red-600">{data.errors.ready}</p>
            ) : (
              <JsonDisplay data={data.ready} />
            )}
          </InfoCard>

          {/* Version */}
          <InfoCard title="Version Info" icon={Shield}>
            {data.errors.version ? (
              <p className="text-sm text-red-600">{data.errors.version}</p>
            ) : (
              <JsonDisplay data={data.version} />
            )}
          </InfoCard>

          {/* Rate Limit */}
          <InfoCard title="Rate Limit Status" icon={Clock}>
            {data.errors.rateLimit ? (
              <p className="text-sm text-red-600">{data.errors.rateLimit}</p>
            ) : (
              <JsonDisplay data={data.rateLimit} />
            )}
          </InfoCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jusho API</p>
        </div>
      </footer>
    </div>
  );
}
