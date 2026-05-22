"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Insights {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpm: number;
  cpc: number;
  frequency: number;
  uniqueClicks: number;
  uniqueCtr: number;
  viewContent: number;
  initiateCheckout: number;
  purchase: number;
  costPerCheckout: number;
  costPerPurchase: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  dailyBudget: number;
  insights: Insights;
}

interface Adset {
  id: string;
  name: string;
  status: string;
  campaignId: string;
  dailyBudget: number;
  optimizationGoal: string;
  insights: Insights;
}

interface Ad {
  id: string;
  name: string;
  status: string;
  adsetId: string;
  campaignId: string;
  thumbnail: string | null;
  objectType: string;
  insights: Insights;
}

interface DailyPoint {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
}

interface DashboardData {
  account: Insights;
  dailyData: DailyPoint[];
  campaigns: Campaign[];
  adsets: Adset[];
  ads: Ad[];
  fetchedAt: string;
}

type DatePreset = "today" | "last_7d" | "last_30d";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

const pct = (n: number) => `${n.toFixed(2)}%`;
const num = (n: number) => n.toLocaleString("pt-BR");

const CAMPAIGN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  "OUTCOME_TRAFFIC": { label: "TRÁFEGO",    color: "#3B82F6", bg: "#EFF6FF" },
  "OUTCOME_SALES":   { label: "CONVERSÃO",  color: "#10B981", bg: "#ECFDF5" },
  "OUTCOME_LEADS":   { label: "LEADS",      color: "#8B5CF6", bg: "#F5F3FF" },
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:     "#10B981",
  PAUSED:     "#F59E0B",
  DISAPPROVED:"#EF4444",
  IN_PROCESS: "#3B82F6",
  PENDING_REVIEW: "#6366F1",
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#64748B";
  const labels: Record<string, string> = {
    ACTIVE: "Ativo", PAUSED: "Pausado", DISAPPROVED: "Reprovado",
    IN_PROCESS: "Em revisão", PENDING_REVIEW: "Em revisão",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: color + "18", color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
      {labels[status] ?? status}
    </span>
  );
}

// Metric card
function Metric({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
      <p className="text-xl font-bold tnum" style={color ? { color } : undefined}>{value}</p>
      {sub && <p className="text-xs text-slate-400 tnum mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Threshold helpers ────────────────────────────────────────────────────────
function ctrColor(v: number, isBOF: boolean) {
  const ok = isBOF ? 3 : 1.5;
  const warn = isBOF ? 1.5 : 1;
  if (v >= ok) return "#10B981";
  if (v >= warn) return "#F59E0B";
  return v === 0 ? "#94A3B8" : "#EF4444";
}

function cpmColor(v: number) {
  if (v === 0) return "#94A3B8";
  if (v <= 20) return "#10B981";
  if (v <= 30) return "#F59E0B";
  return "#EF4444";
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<DatePreset>("today");
  const [countdown, setCountdown] = useState(60);
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets" | "ads">("campaigns");
  const [expandedCamp, setExpandedCamp] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch_ = useCallback(async (p: DatePreset) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meta-insights?date_preset=${p}`);
      const json = await res.json();
      if (json.error) { setError(json.error); } else { setData(json); setError(""); }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      setCountdown(60);
    }
  }, []);

  useEffect(() => {
    fetch_(period);
    timerRef.current = setInterval(() => fetch_(period), 60000);
    cdRef.current = setInterval(() => setCountdown((c) => (c <= 1 ? 60 : c - 1)), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cdRef.current) clearInterval(cdRef.current);
    };
  }, [period, fetch_]);

  const handlePeriod = (p: DatePreset) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cdRef.current) clearInterval(cdRef.current);
    setPeriod(p);
    fetch_(p);
    timerRef.current = setInterval(() => fetch_(p), 60000);
    cdRef.current = setInterval(() => setCountdown((c) => (c <= 1 ? 60 : c - 1)), 1000);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  const acc = data?.account;
  const dailySpendsData = data?.dailyData.map((d) => d.spend) ?? [];

  const PERIOD_LABELS: Record<DatePreset, string> = { today: "Hoje", last_7d: "7 dias", last_30d: "30 dias" };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">Nexo Brasil — Meta Ads</h1>
              <p className="text-xs text-slate-400">
                {data ? `Atualizado às ${new Date(data.fetchedAt).toLocaleTimeString("pt-BR")}` : "Carregando..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Period selector */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
              {(["today","last_7d","last_30d"] as DatePreset[]).map((p) => (
                <button key={p} onClick={() => handlePeriod(p)}
                  className={`px-3 py-1.5 transition-colors ${period === p ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            {/* Refresh */}
            <button onClick={() => fetch_(period)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {loading ? "..." : `${countdown}s`}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            ⚠️ Erro ao buscar dados: {error}
          </div>
        )}

        {/* ── Account Summary ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Gasto", value: acc ? brl(acc.spend) : "—", sub: PERIOD_LABELS[period], color: acc?.spend ? "#0F172A" : "#94A3B8" },
            { label: "Alcance", value: acc ? num(acc.reach) : "—", sub: "pessoas únicas" },
            { label: "Impressões", value: acc ? num(acc.impressions) : "—", sub: `freq. ${acc?.frequency.toFixed(1) ?? "—"}x` },
            { label: "Cliques", value: acc ? num(acc.clicks) : "—", sub: `únicos: ${acc ? num(acc.uniqueClicks) : "—"}` },
            { label: "CTR médio", value: acc ? pct(acc.ctr) : "—", sub: "link clicks", color: acc ? ctrColor(acc.ctr, false) : undefined },
            { label: "CPM médio", value: acc ? brl(acc.cpm) : "—", sub: "por mil imp.", color: acc ? cpmColor(acc.cpm) : undefined },
            { label: "CPC médio", value: acc ? brl(acc.cpc) : "—", sub: "por clique" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <Metric {...m} />
            </div>
          ))}
        </section>

        {/* ── Pixel Events ── */}
        {acc && (acc.viewContent > 0 || acc.initiateCheckout > 0 || acc.purchase > 0) && (
          <section className="grid grid-cols-3 gap-3">
            {[
              { label: "ViewContent", value: num(acc.viewContent), icon: "👁", color: "#3B82F6" },
              { label: "InitiateCheckout", value: num(acc.initiateCheckout), icon: "🛒", color: "#8B5CF6", sub: acc.costPerCheckout ? `CPA: ${brl(acc.costPerCheckout)}` : undefined },
              { label: "Purchase", value: num(acc.purchase), icon: "💰", color: "#10B981", sub: acc.costPerPurchase ? `CPA: ${brl(acc.costPerPurchase)}` : undefined },
            ].map((e) => (
              <div key={e.label} className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-4 shadow-sm">
                <span className="text-2xl">{e.icon}</span>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{e.label}</p>
                  <p className="text-2xl font-bold tnum" style={{ color: e.color }}>{e.value}</p>
                  {e.sub && <p className="text-xs text-slate-400">{e.sub}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Spend sparkline (7 days) ── */}
        {data && dailySpendsData.length > 1 && (
          <section className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800 text-sm">Gasto diário — últimos 7 dias</h2>
              <p className="text-xs text-slate-400">Total: {brl(dailySpendsData.reduce((a,b) => a+b, 0))}</p>
            </div>
            <div className="flex items-end gap-2 h-16">
              {data.dailyData.map((d, i) => {
                const max = Math.max(...dailySpendsData, 0.01);
                const h = max > 0 ? Math.max((d.spend / max) * 56, d.spend > 0 ? 4 : 0) : 0;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {brl(d.spend)} — CTR {pct(d.ctr)}
                    </div>
                    <div className="w-full rounded-t" style={{ height: h, background: "#3B82F6", opacity: i === data.dailyData.length-1 ? 1 : 0.5 }} />
                    <p className="text-[9px] text-slate-400">{d.date.slice(5)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Tab selector ── */}
        <div className="flex gap-1 border-b border-slate-200">
          {([
            { key: "campaigns", label: `Campanhas (${data?.campaigns.length ?? 0})` },
            { key: "adsets",    label: `Conjuntos (${data?.adsets.length ?? 0})` },
            { key: "ads",       label: `Anúncios (${data?.ads.length ?? 0})` },
          ] as { key: typeof activeTab; label: string }[]).map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Campaigns Tab ── */}
        {activeTab === "campaigns" && (
          <section className="space-y-4">
            {(data?.campaigns ?? []).map((c) => {
              const obj = CAMPAIGN_LABELS[c.objective] ?? { label: c.objective, color: "#64748B", bg: "#F8FAFC" };
              const ins = c.insights;
              const expanded = expandedCamp === c.id;
              const campAdsets = data?.adsets.filter((s) => s.campaignId === c.id) ?? [];
              return (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Campaign header */}
                  <div className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedCamp(expanded ? null : c.id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: obj.bg, color: obj.color }}>
                        {obj.label}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-500">R${c.dailyBudget}/dia</span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>

                  {/* Campaign KPIs */}
                  <div className="px-5 pb-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 border-t border-slate-100 pt-4">
                    <Metric label="Gasto" value={brl(ins.spend)} />
                    <Metric label="Alcance" value={num(ins.reach)} />
                    <Metric label="Impressões" value={num(ins.impressions)} />
                    <Metric label="Cliques" value={num(ins.clicks)} />
                    <Metric label="CTR" value={pct(ins.ctr)} color={ctrColor(ins.ctr, c.objective === "OUTCOME_SALES")} />
                    <Metric label="CPM" value={ins.cpm > 0 ? brl(ins.cpm) : "—"} color={ins.cpm > 0 ? cpmColor(ins.cpm) : undefined} />
                    <Metric label="CPC" value={ins.cpc > 0 ? brl(ins.cpc) : "—"} />
                    <Metric label="Checkouts" value={num(ins.initiateCheckout)} sub={ins.costPerCheckout > 0 ? brl(ins.costPerCheckout) : undefined} color={ins.initiateCheckout > 0 ? "#8B5CF6" : undefined} />
                    <Metric label="Compras" value={num(ins.purchase)} sub={ins.costPerPurchase > 0 ? brl(ins.costPerPurchase) : undefined} color={ins.purchase > 0 ? "#10B981" : undefined} />
                  </div>

                  {/* Expanded adsets */}
                  {expanded && campAdsets.length > 0 && (
                    <div className="border-t border-slate-100">
                      <div className="px-5 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Conjuntos de Anúncios
                      </div>
                      <div className="divide-y divide-slate-100">
                        {campAdsets.map((s) => (
                          <div key={s.id} className="px-5 py-3 flex items-center gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 truncate">{s.name}</span>
                                <StatusBadge status={s.status} />
                              </div>
                              <p className="text-xs text-slate-400">R${s.dailyBudget}/dia · {s.optimizationGoal}</p>
                            </div>
                            <div className="grid grid-cols-4 gap-6 shrink-0 text-right">
                              <div><p className="text-xs text-slate-400">Gasto</p><p className="text-sm font-bold tnum">{brl(s.insights.spend)}</p></div>
                              <div><p className="text-xs text-slate-400">Imp.</p><p className="text-sm font-bold tnum">{num(s.insights.impressions)}</p></div>
                              <div><p className="text-xs text-slate-400">CTR</p><p className="text-sm font-bold tnum" style={{ color: ctrColor(s.insights.ctr, false) }}>{pct(s.insights.ctr)}</p></div>
                              <div><p className="text-xs text-slate-400">CPM</p><p className="text-sm font-bold tnum" style={{ color: cpmColor(s.insights.cpm) }}>{s.insights.cpm > 0 ? brl(s.insights.cpm) : "—"}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {!loading && !data?.campaigns.length && (
              <div className="text-center py-16 text-slate-400">Nenhuma campanha encontrada</div>
            )}
          </section>
        )}

        {/* ── Ad Sets Tab ── */}
        {activeTab === "adsets" && (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {["Conjunto","Status","Budget/dia","Gasto","Alcance","Impressões","Freq.","Cliques","CTR","CPM","CPC","Checkouts","Compras"].map((h) => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.adsets ?? []).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px]">
                        <span className="block truncate" title={s.name}>{s.name.replace("[NB] ","")}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 tnum text-slate-600">R${s.dailyBudget}</td>
                      <td className="px-4 py-3 tnum font-semibold">{brl(s.insights.spend)}</td>
                      <td className="px-4 py-3 tnum">{num(s.insights.reach)}</td>
                      <td className="px-4 py-3 tnum">{num(s.insights.impressions)}</td>
                      <td className="px-4 py-3 tnum">{s.insights.frequency.toFixed(1)}x</td>
                      <td className="px-4 py-3 tnum">{num(s.insights.clicks)}</td>
                      <td className="px-4 py-3 tnum font-semibold" style={{ color: ctrColor(s.insights.ctr, false) }}>{pct(s.insights.ctr)}</td>
                      <td className="px-4 py-3 tnum" style={{ color: cpmColor(s.insights.cpm) }}>{s.insights.cpm > 0 ? brl(s.insights.cpm) : "—"}</td>
                      <td className="px-4 py-3 tnum">{s.insights.cpc > 0 ? brl(s.insights.cpc) : "—"}</td>
                      <td className="px-4 py-3 tnum" style={{ color: s.insights.initiateCheckout > 0 ? "#8B5CF6" : undefined }}>{num(s.insights.initiateCheckout)}</td>
                      <td className="px-4 py-3 tnum font-bold" style={{ color: s.insights.purchase > 0 ? "#10B981" : undefined }}>{num(s.insights.purchase)}</td>
                    </tr>
                  ))}
                  {!loading && !data?.adsets.length && (
                    <tr><td colSpan={13} className="px-4 py-12 text-center text-slate-400">Sem dados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Ads Tab ── */}
        {activeTab === "ads" && (
          <section className="space-y-2">
            {(data?.ads ?? [])
              .sort((a, b) => b.insights.spend - a.insights.spend)
              .map((ad) => {
                const isVideo = ad.objectType === "VIDEO" || ad.name.includes("VID");
                return (
                  <div key={ad.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    {/* Thumbnail / type */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                      {ad.thumbnail ? (
                        <Image src={ad.thumbnail} alt="" width={48} height={48} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <span className="text-xl">{isVideo ? "🎬" : "🔗"}</span>
                      )}
                    </div>
                    {/* Name + status */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 text-sm truncate">{ad.name.replace("[NB] ","")}</span>
                        <StatusBadge status={ad.status} />
                        {isVideo && <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2 py-0.5 rounded-full">Reel</span>}
                      </div>
                    </div>
                    {/* Metrics row */}
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-4 shrink-0 text-right">
                      <div className="hidden lg:block"><p className="text-xs text-slate-400">Gasto</p><p className="text-sm font-bold tnum">{brl(ad.insights.spend)}</p></div>
                      <div className="hidden lg:block"><p className="text-xs text-slate-400">Alcance</p><p className="text-sm font-bold tnum">{num(ad.insights.reach)}</p></div>
                      <div><p className="text-xs text-slate-400">Imp.</p><p className="text-sm font-bold tnum">{num(ad.insights.impressions)}</p></div>
                      <div><p className="text-xs text-slate-400">Cliques</p><p className="text-sm font-bold tnum">{num(ad.insights.clicks)}</p></div>
                      <div><p className="text-xs text-slate-400">CTR</p><p className="text-sm font-bold tnum" style={{ color: ctrColor(ad.insights.ctr, false) }}>{pct(ad.insights.ctr)}</p></div>
                      <div><p className="text-xs text-slate-400">CPM</p><p className="text-sm font-bold tnum" style={{ color: cpmColor(ad.insights.cpm) }}>{ad.insights.cpm > 0 ? brl(ad.insights.cpm) : "—"}</p></div>
                      <div><p className="text-xs text-slate-400">Checkouts</p><p className="text-sm font-bold tnum" style={{ color: ad.insights.initiateCheckout > 0 ? "#8B5CF6" : undefined }}>{num(ad.insights.initiateCheckout)}</p></div>
                    </div>
                  </div>
                );
              })}
            {!loading && !data?.ads.length && (
              <div className="text-center py-16 text-slate-400">Nenhum anúncio encontrado</div>
            )}
          </section>
        )}

        {/* ── Insights Panel ── */}
        {data && (
          <section className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-3">💡 Insights e Recomendações</h2>
            <div className="space-y-2">
              {acc && acc.ctr < 1 && acc.impressions > 1000 && (
                <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <span className="text-amber-800"><strong>CTR baixo ({pct(acc.ctr)})</strong> — meta &gt;1,5% no TOF. Considere testar novos criativos ou ajustar o público.</span>
                </div>
              )}
              {acc && acc.cpm > 30 && (
                <div className="flex items-start gap-2 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <span className="text-red-500 mt-0.5">🔴</span>
                  <span className="text-red-800"><strong>CPM alto ({brl(acc.cpm)})</strong> — acima de R$30. Revise a sobreposição de públicos entre conjuntos.</span>
                </div>
              )}
              {acc && acc.frequency > 3 && (
                <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <span className="text-amber-800"><strong>Frequência alta ({acc.frequency.toFixed(1)}x)</strong> — mesmo público vendo os anúncios muitas vezes. Amplie o público ou adicione novos criativos.</span>
                </div>
              )}
              {acc && acc.ctr >= 1.5 && (
                <div className="flex items-start gap-2 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="text-green-500 mt-0.5">✅</span>
                  <span className="text-green-800"><strong>CTR saudável ({pct(acc.ctr)})</strong> — criativos estão performando bem. Considere aumentar o budget em 20–30%.</span>
                </div>
              )}
              {acc && acc.initiateCheckout > 0 && acc.purchase === 0 && (
                <div className="flex items-start gap-2 text-sm bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                  <span className="text-purple-500 mt-0.5">🛒</span>
                  <span className="text-purple-800"><strong>{num(acc.initiateCheckout)} checkout(s) sem compra</strong> — active BOF-3A com maior budget para recuperar esses visitantes.</span>
                </div>
              )}
              {acc && acc.spend === 0 && (
                <div className="flex items-start gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-slate-400 mt-0.5">ℹ️</span>
                  <span className="text-slate-600">Sem gasto no período selecionado. Os anúncios podem estar em revisão ou o período ainda não gerou dados.</span>
                </div>
              )}
              {!acc && (
                <div className="flex items-start gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-slate-400 mt-0.5">ℹ️</span>
                  <span className="text-slate-600">Carregando análise...</span>
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-slate-400 py-4">
          Nexo Brasil · Meta Ads Dashboard · auto-refresh {countdown}s · conta act_731029812189500
        </footer>
      </main>
    </div>
  );
}
