"use client";

import { useState, useEffect } from "react";
import { trackCheckoutClick } from "@/components/TrackingScripts";

/* ── CHECKOUT / SUPPORT URLS (from env) ── */
const CHECKOUT_1 = process.env.NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL ?? "#";
const CHECKOUT_2 = process.env.NEXT_PUBLIC_CHECKOUT_2_UNIDADES_URL ?? "#";
const CHECKOUT_3 = process.env.NEXT_PUBLIC_CHECKOUT_3_UNIDADES_URL ?? "#";
const WHATSAPP_SUPPORT_URL = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_URL ?? "#";

const KIT_URLS: Record<number, string> = { 1: CHECKOUT_1, 2: CHECKOUT_2, 3: CHECKOUT_3 };

const PRICE_FULL   = "R$ 197,00";
const PRICE_PARC   = "10x de R$ 19,70";
const PRICE_PARC_2 = "10x de R$ 34,70";
const PRICE_PARC_3 = "10x de R$ 47,90";

const KITS = [
  { id:1, title:"1 unidade",  badge:null,                 desc:"Para um carro ou uma moto.",                        parc:PRICE_PARC,   full:"ou R$ 197 à vista",  cta:"Comprar 1 unidade",   featured:false },
  { id:2, title:"2 unidades", badge:"Mais escolhido",     desc:"Ideal para carro + moto, casal ou família.",        parc:PRICE_PARC_2, full:"ou R$ 347 à vista",  cta:"Comprar kit com 2",   featured:true  },
  { id:3, title:"3 unidades", badge:"Melhor custo / un.", desc:"Ideal para família ou frota pequena.",              parc:PRICE_PARC_3, full:"ou R$ 479 à vista",  cta:"Comprar kit com 3",   featured:false },
];

/* ── ICONS (inline SVG) ── */
function Ico({ d, className="w-5 h-5", stroke=2 }: { d: React.ReactNode; className?: string; stroke?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>{d}</svg>
  );
}
const I = {
  pin:    <Ico d={<><path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></>} />,
  bolt:   <Ico d={<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>} />,
  shield: <Ico d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>} />,
  check:  <Ico d={<path d="M20 6 9 17l-5-5"/>} stroke={2.4} />,
  x:      <Ico d={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} stroke={2.4} />,
  car:    <Ico d={<><path d="M3 13h18l-2-5a2 2 0 0 0-1.9-1.4H6.9A2 2 0 0 0 5 8l-2 5Z"/><path d="M5 13v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h6v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4"/><circle cx="7.5" cy="15.5" r=".8"/><circle cx="16.5" cy="15.5" r=".8"/></>} />,
  bike:   <Ico d={<><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17 9 9h5l3 8"/><path d="M14 9h2l1 3"/></>} />,
  usb:    <Ico d={<><path d="M12 2v18"/><path d="m8 6 4-4 4 4"/><path d="M12 14H8a2 2 0 0 1-2-2V9h6"/><path d="M12 14h4a2 2 0 0 1 2 2v3"/></>} />,
  app:    <Ico d={<><rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></>} />,
  lock:   <Ico d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>} />,
  truck:  <Ico d={<><rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7"/><circle cx="6" cy="17" r="1.6"/><circle cx="18" cy="17" r="1.6"/></>} />,
  chat:   <Ico d={<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5A8 8 0 1 1 21 12Z"/>} />,
  whats:  <Ico d={<><path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1 3.4A9 9 0 0 1 21 12Z"/><path d="M8.5 9.5c.4 2.5 3.5 5.6 6 6l1.4-1.7-2-1-1.1.8c-.8-.4-1.7-1.3-2.1-2.1l.8-1.1-1-2L8.5 9.5Z" fill="currentColor" stroke="none"/></>} />,
  arrow:  <Ico d={<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>} />,
  chev:   <Ico d={<path d="m6 9 6 6 6-6"/>} />,
  spark:  <Ico d={<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>} />,
  star:   <Ico d={<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.8 6.8 19.2l1-5.9L3.5 9.2l5.9-.8L12 3Z"/>} />,
  power:  <Ico d={<><path d="M12 3v9"/><path d="M5.6 7.4a8 8 0 1 0 12.8 0"/></>} />,
  drop:   <Ico d={<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/>} />,
  menu:   <Ico d={<><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>} />,
  list:   <Ico d={<><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>} />,
};

/* ── BASE COMPONENTS ── */

function Logo({ light=false }: { light?: boolean }) {
  return (
    <a href="#top" className="inline-flex items-center gap-2.5 group">
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-ink to-ink2 shadow-soft">
        <span className="absolute inset-1 rounded-lg border border-white/20"></span>
        <span className="relative w-2 h-2 rounded-full bg-cta">
          <span className="absolute inset-0 rounded-full bg-cta animate-ping2"></span>
        </span>
      </span>
      <span className={"font-extrabold tracking-tight text-[17px] leading-none "+(light?"text-white":"text-ink")}>
        Nexo<span className="text-cta">.</span>Brasil
      </span>
    </a>
  );
}

function CTAButton({
  kit = 1,
  href,
  children,
  size = "md",
  variant = "primary",
  className = "",
  icon = true,
  pulse = false,
}: {
  kit?: number;
  href?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ghost" | "dark";
  className?: string;
  icon?: boolean;
  pulse?: boolean;
}) {
  const base = "relative inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition select-none cursor-pointer";
  const sizes = { sm:"px-4 py-2.5 text-[14px]", md:"px-5 py-3.5 text-[15px]", lg:"px-6 py-4 text-[16px]" };
  const variants = {
    primary: "bg-cta text-white hover:bg-ctaHov active:translate-y-px shadow-[0_8px_20px_-6px_rgba(16,185,129,.55)]",
    ghost:   "bg-white text-ink border border-line hover:border-ink/40",
    dark:    "bg-ink text-white hover:bg-ink2",
  };

  const checkoutUrl = KIT_URLS[kit] ?? CHECKOUT_1;
  const destination = href ?? checkoutUrl;
  const isCheckout = !href;

  function handleClick(e: React.MouseEvent) {
    if (isCheckout) {
      e.preventDefault();
      trackCheckoutClick(String(kit) as "1" | "2" | "3");
      setTimeout(() => { window.open(checkoutUrl, "_blank", "noopener"); }, 150);
    }
  }

  return (
    <a
      href={destination}
      target={isCheckout ? "_blank" : undefined}
      rel={isCheckout ? "noopener" : undefined}
      onClick={handleClick}
      className={[base, sizes[size], variants[variant], pulse ? "cta-ring" : "", className].join(" ")}
    >
      <span>{children}</span>
      {icon && <span className="-mr-1 opacity-90">{I.arrow}</span>}
    </a>
  );
}

function Badge({ children, tone="ink" }: { children: React.ReactNode; tone?: "ink"|"cta"|"warn"|"line" }) {
  const m = {
    ink:  "bg-ink text-white",
    cta:  "bg-cta/10 text-emerald-700 ring-1 ring-cta/20",
    warn: "bg-warn text-amber-900 ring-1 ring-warnB/30",
    line: "bg-white text-ink ring-1 ring-line",
  }[tone];
  return <span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold "+m}>{children}</span>;
}

function SectionLabel({ kicker, title, sub, center=false, dark=false }: {
  kicker?: string; title: string; sub?: string; center?: boolean; dark?: boolean;
}) {
  return (
    <div className={(center?"text-center mx-auto ":"")+"max-w-2xl mb-8 md:mb-12"}>
      {kicker && (
        <div className={"inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase mb-3 "+(dark?"text-cta":"text-emerald-700")}>
          <span className="inline-block w-6 h-px bg-current opacity-60"></span>{kicker}
        </div>
      )}
      <h2 className={"text-[28px] md:text-[40px] leading-[1.05] font-extrabold tracking-tight "+(dark?"text-white":"text-ink")}>{title}</h2>
      {sub && <p className={"mt-3 text-[15px] md:text-[17px] leading-relaxed "+(dark?"text-slate-300":"text-mute")}>{sub}</p>}
    </div>
  );
}

/* ── HEADER ── */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={"sticky top-0 z-40 transition "+(scrolled?"bg-white/85 backdrop-blur border-b border-line":"bg-transparent")}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[60px] flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-[14px] text-ink2">
          <a href="#beneficios" className="hover:text-ink">Benefícios</a>
          <a href="#como-funciona" className="hover:text-ink">Como funciona</a>
          <a href="#faq" className="hover:text-ink">Dúvidas</a>
        </nav>
        <div className="flex items-center gap-2">
          <CTAButton size="sm" className="hidden md:inline-flex">Comprar agora</CTAButton>
          <button onClick={() => setOpen(!open)} aria-label="menu" className="md:hidden w-10 h-10 grid place-items-center rounded-xl border border-line bg-white">{I.menu}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 text-[15px]">
            <a onClick={() => setOpen(false)} href="#beneficios" className="py-2.5">Benefícios</a>
            <a onClick={() => setOpen(false)} href="#como-funciona" className="py-2.5">Como funciona</a>
            <a onClick={() => setOpen(false)} href="#faq" className="py-2.5">Dúvidas</a>
            <CTAButton className="mt-2">Comprar agora por {PRICE_PARC}</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── HERO MAP (3D animated) ── */
function HeroMap() {
  return (
    <div className="relative">
      <div className="map-stage relative aspect-square rounded-[28px] border border-line shadow-card overflow-hidden bg-ink">
        <div className="map-3d">
          <svg viewBox="0 0 600 600" className="map-svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M36 0H0V36" fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="1"/>
              </pattern>
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8"/>
              </filter>
              <radialGradient id="vignette" cx="50%" cy="55%" r="65%">
                <stop offset="55%" stopColor="#0F172A" stopOpacity="0"/>
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9"/>
              </radialGradient>
              <linearGradient id="block" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1E293B"/>
                <stop offset="1" stopColor="#0F172A"/>
              </linearGradient>
            </defs>

            <rect width="600" height="600" fill="#0B1220"/>
            <rect width="600" height="600" fill="url(#grid)"/>

            <g fill="url(#block)" stroke="rgba(148,163,184,0.06)">
              <rect x="40"  y="40"  width="120" height="120" rx="6"/>
              <rect x="180" y="40"  width="200" height="120" rx="6"/>
              <rect x="400" y="40"  width="160" height="80"  rx="6"/>
              <rect x="400" y="140" width="160" height="120" rx="6"/>
              <rect x="40"  y="180" width="120" height="200" rx="6"/>
              <rect x="180" y="180" width="200" height="90"  rx="6"/>
              <rect x="180" y="290" width="90"  height="90"  rx="6"/>
              <rect x="290" y="290" width="90"  height="90"  rx="6"/>
              <rect x="400" y="280" width="160" height="100" rx="6"/>
              <rect x="40"  y="400" width="200" height="160" rx="6"/>
              <rect x="260" y="400" width="140" height="160" rx="6"/>
              <rect x="420" y="400" width="140" height="160" rx="6"/>
            </g>

            <g stroke="#1F2A3B" strokeWidth="22" fill="none" strokeLinecap="round">
              <path d="M-20 170 H 620"/>
              <path d="M-20 280 H 620"/>
              <path d="M-20 390 H 620"/>
              <path d="M170 -20 V 620"/>
              <path d="M390 -20 V 620"/>
            </g>
            <g stroke="rgba(203,213,225,0.30)" strokeWidth="1.5" fill="none" strokeDasharray="8 14">
              <path d="M-20 170 H 620"/>
              <path d="M-20 280 H 620"/>
              <path d="M-20 390 H 620"/>
              <path d="M170 -20 V 620"/>
              <path d="M390 -20 V 620"/>
            </g>

            <path id="route" d="M 80 500 L 80 390 L 390 390 L 390 170 L 520 170" stroke="#10B981" strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" filter="url(#routeGlow)"/>
            <path d="M 80 500 L 80 390 L 390 390 L 390 170 L 520 170" stroke="#10B981" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 80 500 L 80 390 L 390 390 L 390 170 L 520 170" stroke="#ECFDF5" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="route-flow"/>

            <g>
              <circle cx="80" cy="500" r="14" fill="#0F172A" stroke="#10B981" strokeWidth="3"/>
              <circle cx="80" cy="500" r="6"  fill="#10B981"/>
            </g>
            <g>
              <circle cx="520" cy="170" r="22" fill="#10B981" opacity="0.25">
                <animate attributeName="r" values="22;42;22" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.45;0;0.45" dur="2.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="520" cy="170" r="14" fill="#10B981"/>
              <circle cx="520" cy="170" r="6"  fill="white"/>
            </g>

            <g>
              <circle r="16" fill="#10B981" opacity="0.30">
                <animateMotion dur="7.5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#route"/>
                </animateMotion>
              </circle>
              <g>
                <animateMotion dur="7.5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#route"/>
                </animateMotion>
                <g transform="translate(-13 -7)">
                  <rect x="0" y="0" width="26" height="14" rx="4" fill="#ECFDF5"/>
                  <rect x="3" y="2" width="20" height="6" rx="2" fill="#10B981" opacity="0.85"/>
                  <rect x="2" y="-1.5" width="22" height="3" rx="1.5" fill="#0F172A" opacity="0.4"/>
                  <circle cx="6"  cy="14" r="2.6" fill="#0F172A"/>
                  <circle cx="20" cy="14" r="2.6" fill="#0F172A"/>
                </g>
              </g>
            </g>

            <rect width="600" height="600" fill="url(#vignette)"/>
          </svg>
        </div>

        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 hud-pop">
          <div className="inline-flex items-center gap-2 bg-ink/85 backdrop-blur text-white text-[12px] font-semibold px-3 py-1.5 rounded-full ring-1 ring-white/10">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-cta"></span>
              <span className="absolute inset-0 rounded-full bg-cta animate-ping2"></span>
            </span>
            Ao vivo · 1s atrás
          </div>
        </div>

        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-card px-3 py-2 text-ink min-w-[120px]">
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-mute">Distância</div>
            <div className="text-[20px] font-extrabold leading-tight tnum">2,4 km</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cta"></span> Em movimento</div>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
          <div className="bg-ink/85 backdrop-blur text-white rounded-2xl shadow-card px-3 py-2 ring-1 ring-white/10">
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400">Velocidade</div>
            <div className="text-[18px] font-extrabold leading-tight tnum">42 <span className="text-[11px] font-semibold text-slate-300">km/h</span></div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20">
          <div className="flex items-center gap-2.5 bg-white rounded-2xl shadow-card pl-2 pr-3 py-2 ring-1 ring-line">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden hatch">
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-700">Nexo Brasil</div>
              <div className="text-[13px] font-extrabold text-ink">GPS 2 em 1 · USB-C 30W</div>
              <div className="text-[11px] text-mute">Carro + moto compatível</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute -bottom-4 left-6 right-6 justify-center gap-2 flex-wrap">
        <Badge tone="line"><span className="text-emerald-700">{I.check}</span> Sem instalação complicada</Badge>
        <Badge tone="line"><span className="text-ink">{I.bolt}</span> USB-C 30W</Badge>
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-bg to-bg"></div>
        <div className="absolute inset-0 opacity-[0.5]" style={{
          backgroundImage:"radial-gradient(circle at 1px 1px, rgba(15,23,42,.08) 1px, transparent 0)",
          backgroundSize:"22px 22px",
          maskImage:"radial-gradient(ellipse at 50% 0%, #000 30%, transparent 70%)",
          WebkitMaskImage:"radial-gradient(ellipse at 50% 0%, #000 30%, transparent 70%)"
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-12 pb-14 md:pb-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-soft border border-line text-[12px] font-semibold text-ink2">
            <span className="relative inline-flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-cta"></span><span className="absolute inset-0 rounded-full bg-cta animate-ping2"></span></span>
            Rastreador GPS 2 em 1 · Nexo Brasil
          </div>

          <h1 className="mt-4 text-[34px] sm:text-[42px] md:text-[54px] leading-[1.02] font-extrabold tracking-tight text-balance">
            Saiba onde seu veículo está por <span className="text-cta">menos de R$20</span> por mês.
          </h1>

          <p className="mt-4 text-[16px] md:text-[18px] text-mute max-w-xl leading-relaxed">
            Rastreador GPS veicular 2 em 1 com carregador <strong className="text-ink">USB-C 30W</strong>. Ideal para carros e motos com entrada veicular compatível.
          </p>

          <div className="mt-6 inline-flex items-end gap-4 bg-white border border-line rounded-2xl shadow-soft px-5 py-4">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-mute uppercase">A partir de</div>
              <div className="mt-1 flex items-baseline gap-1 tnum">
                <span className="text-[18px] font-bold text-ink">10x</span>
                <span className="text-[14px] text-mute">de</span>
                <span className="text-[34px] md:text-[42px] font-extrabold text-ink leading-none">R$19,<span className="text-[24px] align-top">70</span></span>
              </div>
              <div className="text-[13px] text-mute mt-1">ou <span className="font-semibold text-ink">{PRICE_FULL}</span> à vista</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CTAButton size="lg" pulse>Comprar agora por {PRICE_PARC}</CTAButton>
            <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-line bg-white text-ink font-semibold text-[15px] hover:border-ink/40">
              Ver como funciona <span className="opacity-70">{I.chev}</span>
            </a>
          </div>

          <p className="mt-3 text-[12.5px] text-mute flex items-center gap-2">{I.lock}<span>Compra segura pelo checkout. Suporte pós-compra para configuração.</span></p>
        </div>

        <HeroMap />
      </div>
    </section>
  );
}

/* ── TRUST BAR ── */
function TrustBar() {
  const items = [
    { i:I.lock,  t:"Pagamento seguro" },
    { i:I.truck, t:"Envio acompanhado" },
    { i:I.spark, t:"Produto 2 em 1" },
    { i:I.chat,  t:"Suporte pós-compra" },
  ];
  return (
    <section className="border-y border-line bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {items.map((x,i)=>(
          <div key={i} className="flex items-center gap-3 text-ink2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700">{x.i}</span>
            <div className="text-[13.5px] font-semibold">{x.t}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── PAIN SECTION ── */
function PainSection() {
  const cards = [
    { i:I.shield, t:"Medo de furto ou perda do veículo" },
    { i:I.pin,    t:"Insegurança ao estacionar na rua" },
    { i:I.app,    t:"Falta de controle sobre a localização" },
    { i:I.spark,  t:"Quer solução simples, sem instalação complicada" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel kicker="Por que isso importa" title="Você sabe onde seu veículo está agora?" sub="Quem deixa o carro ou a moto na rua, empresta o veículo ou trabalha dirigindo sabe como é importante ter mais controle sobre a localização no dia a dia." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {cards.map((c,i)=>(
            <div key={i} className="rounded-2xl bg-card border border-line p-5 shadow-soft hover:shadow-card transition">
              <div className="w-10 h-10 grid place-items-center rounded-xl bg-ink text-white">{c.i}</div>
              <p className="mt-4 font-semibold text-[15px] leading-snug">{c.t}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-ink text-white p-5 md:p-6">
          <p className="text-[15px] md:text-[17px] max-w-2xl">Por menos de <strong>R$20 por mês</strong>, você adiciona uma camada extra de controle à sua rotina.</p>
          <CTAButton>Quero mais controle</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ── */
function HowItWorks() {
  const steps = [
    { n:"01", t:"Conecte na entrada veicular compatível",    d:"Encaixe o produto na entrada veicular/acendedor do seu carro ou moto. Sem fios soltos, sem instalação técnica complexa.", i:I.power },
    { n:"02", t:"Configure após a compra com suporte",       d:"Depois da compra, nosso time de suporte ajuda você a configurar o produto e o app passo a passo pelo WhatsApp.", i:I.chat },
    { n:"03", t:"Acompanhe a localização pelo aplicativo",   d:"Enquanto o produto estiver conectado e recebendo alimentação, você acompanha a localização do veículo pelo app.", i:I.app },
  ];
  return (
    <section id="como-funciona" className="py-14 md:py-24 bg-white border-y border-line">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel kicker="Simples na prática" title="Como funciona na prática" sub="Três passos. Sem instalação técnica complicada e com suporte humano depois da compra." />
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((s,i)=>(
            <div key={i} className="relative rounded-2xl border border-line bg-bg p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-[44px] font-extrabold leading-none text-ink/10 tnum">{s.n}</div>
                <div className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-50 text-emerald-700">{s.i}</div>
              </div>
              <h3 className="mt-3 font-bold text-[18px] leading-snug">{s.t}</h3>
              <p className="mt-2 text-[14.5px] text-mute leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BENEFITS ── */
function Benefits() {
  const items = [
    { i:I.app,    t:"Localização pelo aplicativo",              d:"Veja onde seu veículo está direto do celular, enquanto o produto estiver conectado e recebendo energia." },
    { i:I.bolt,   t:"Carregamento rápido USB-C 30W",            d:"Carregue o celular no veículo com velocidade — Power Delivery + QC 3.0." },
    { i:I.spark,  t:"Sem instalação técnica complexa",          d:"Encaixe e use. Nada de oficina, nada de fios espalhados." },
    { i:I.shield, t:"Discreto para uso diário",                 d:"Design compacto que se mistura ao painel do veículo." },
    { i:I.car,    t:"Compatível com carros e motos",            d:"Para veículos com entrada veicular/acendedor ou alimentação compatível." },
    { i:I.whats,  t:"Suporte pós-compra pelo WhatsApp",         d:"Depois do pedido, falamos com você para ajudar na configuração." },
  ];
  return (
    <section id="beneficios" className="py-14 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel kicker="O que você leva" title="2 em 1 que resolve duas dores no mesmo plugue" sub="Localização do veículo + carregamento rápido do celular. Um produto, um encaixe." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((b,i)=>(
            <div key={i} className="rounded-2xl bg-card border border-line p-5 md:p-6 shadow-soft hover:-translate-y-0.5 transition">
              <div className="w-11 h-11 grid place-items-center rounded-xl bg-emerald-50 text-emerald-700">{b.i}</div>
              <h3 className="mt-4 font-bold text-[16px]">{b.t}</h3>
              <p className="mt-1.5 text-[14px] text-mute leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FIT SECTION ── */
function FitSection() {
  const yes = [
    "Quer acompanhar a localização do veículo pelo aplicativo",
    "Usa carro ou moto com entrada veicular compatível",
    "Busca solução simples e discreta",
    "Quer carregar o celular no veículo",
    "Não quer instalação técnica complexa",
  ];
  const no = [
    "Precisa de bloqueio remoto",
    "Quer função de escuta",
    "Precisa de rastreador profissional instalado",
    "Precisa que funcione sem receber energia",
    "Vai usar em moto exposta à chuva sem proteção",
  ];
  return (
    <section className="py-14 md:py-24 bg-white border-y border-line">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel kicker="Para quem é (e para quem não é)" title="Honestidade antes de você decidir" sub="Preferimos um cliente certo do que uma venda desalinhada." />
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 grid place-items-center rounded-lg bg-cta text-white">{I.check}</span>
              <h3 className="font-bold text-[17px]">Esse produto é para você se…</h3>
            </div>
            <ul className="space-y-2.5">
              {yes.map((t,i)=>(
                <li key={i} className="flex gap-3 text-[14.5px] text-ink2"><span className="mt-0.5 w-5 h-5 grid place-items-center rounded-full bg-cta/15 text-emerald-700 shrink-0">{I.check}</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-bg p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 grid place-items-center rounded-lg bg-ink text-white">{I.x}</span>
              <h3 className="font-bold text-[17px]">Esse produto NÃO é para você se…</h3>
            </div>
            <ul className="space-y-2.5">
              {no.map((t,i)=>(
                <li key={i} className="flex gap-3 text-[14.5px] text-ink2"><span className="mt-0.5 w-5 h-5 grid place-items-center rounded-full bg-slate-200 text-slate-700 shrink-0">{I.x}</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TRANSPARENCY BLOCK ── */
function TransparencyBlock() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl bg-warn border border-warnB/30 p-6 md:p-10">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 grid place-items-center rounded-xl bg-white text-warnB shadow-soft">{I.shield}</span>
            <div>
              <div className="text-[12px] font-bold tracking-widest uppercase text-amber-800">Importante antes da compra</div>
              <h3 className="mt-1 text-[22px] md:text-[28px] font-extrabold tracking-tight text-amber-950">Leia isto antes de finalizar</h3>
            </div>
          </div>
          <p className="mt-5 text-[15.5px] leading-relaxed text-amber-950/90">
            Este modelo funciona corretamente <strong>enquanto está conectado e recebendo energia</strong>. Ele é indicado para carros e motos com <strong>entrada veicular/acendedor</strong> ou alimentação compatível. Em motos, proteja o produto contra <strong>água, chuva e exposição excessiva</strong>. O produto <strong>não possui escuta</strong> e <strong>não possui bloqueio remoto</strong>.
          </p>
          <p className="mt-4 text-[14.5px] text-amber-900/80">Essa transparência existe para você comprar sabendo exatamente o que está levando.</p>
        </div>
      </div>
    </section>
  );
}

/* ── COMPARISON ── */
function Comparison() {
  const cheap = [
    "Pouca explicação sobre funcionamento",
    "Limitações pouco claras",
    "Dúvida na configuração",
    "Normalmente sem suporte humanizado",
    "Foco apenas em menor preço",
  ];
  const ours = [
    "Rastreador + carregador USB-C 30W",
    "Página clara, sem promessas vazias",
    "Checkout seguro",
    "Oferta parcelada em 10x de R$19,70",
    "Suporte pós-compra humanizado",
    "Transparência sobre funcionamento",
  ];
  return (
    <section className="py-14 md:py-24 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
        backgroundSize:"36px 36px"
      }}></div>
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel dark center kicker="Comparativo" title="Por que não escolher apenas o mais barato?" sub="Existem muitos produtos parecidos por aí. O que muda é a experiência ao redor da compra." />
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div className="text-[13px] uppercase tracking-widest text-slate-400 font-bold">Outros</div>
              <Badge tone="line">Barato genérico</Badge>
            </div>
            <h3 className="mt-2 font-bold text-white text-[20px]">Produto barato genérico</h3>
            <ul className="mt-5 space-y-3 text-slate-300">
              {cheap.map((t,i)=>(
                <li key={i} className="flex gap-3 text-[14.5px]"><span className="mt-0.5 w-5 h-5 grid place-items-center rounded-full bg-white/10 text-slate-300 shrink-0">{I.x}</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-cta/15 to-cta/5 border border-cta/30 p-6 ring-1 ring-cta/20">
            <div className="flex items-center justify-between">
              <div className="text-[13px] uppercase tracking-widest text-cta font-bold">Nexo Brasil</div>
              <Badge tone="cta">Recomendado</Badge>
            </div>
            <h3 className="mt-2 font-bold text-white text-[20px]">GPS 2 em 1 Nexo Brasil</h3>
            <ul className="mt-5 space-y-3 text-slate-100">
              {ours.map((t,i)=>(
                <li key={i} className="flex gap-3 text-[14.5px]"><span className="mt-0.5 w-5 h-5 grid place-items-center rounded-full bg-cta text-white shrink-0">{I.check}</span>{t}</li>
              ))}
            </ul>
            <div className="mt-6"><CTAButton size="md">Comprar com segurança</CTAButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── OFFER KITS ── */
function OfferKits() {
  return (
    <section id="oferta" className="py-14 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel center kicker="Oferta principal" title="Escolha a melhor opção para você" sub="Frete e prazos exibidos no checkout. Pagamento parcelado em até 10x sem complicação." />
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {KITS.map((k) => (
            <div key={k.id} className={"relative rounded-3xl bg-white border p-6 md:p-7 transition flex flex-col "+(k.featured?"border-cta ring-2 ring-cta/40 shadow-card md:-translate-y-2":"border-line shadow-soft")}>
              {k.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={"inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold "+(k.featured?"bg-cta text-white":"bg-ink text-white")}>
                    {k.featured ? I.star : I.spark}{k.badge}
                  </span>
                </div>
              )}
              <div className="text-[12px] uppercase tracking-widest font-bold text-mute">Kit</div>
              <h3 className="text-[24px] font-extrabold tracking-tight mt-0.5">{k.title}</h3>
              <p className="text-[14px] text-mute mt-1 min-h-[40px]">{k.desc}</p>

              <div className="mt-5 rounded-2xl bg-bg border border-line p-4">
                <div className="flex items-baseline gap-1 tnum">
                  <span className="text-[16px] font-bold text-ink">{k.parc.split(" ")[0]}</span>
                  <span className="text-[13px] text-mute">de</span>
                  <span className="text-[32px] font-extrabold leading-none">{k.parc.split("de ")[1]}</span>
                </div>
                <div className="text-[13px] text-mute mt-1">{k.full}</div>
              </div>

              <ul className="mt-4 space-y-2 text-[13.5px] text-ink2 flex-1">
                <li className="flex gap-2"><span className="text-cta mt-0.5">{I.check}</span>Rastreador GPS 2 em 1</li>
                <li className="flex gap-2"><span className="text-cta mt-0.5">{I.check}</span>Carregador USB-C 30W</li>
                <li className="flex gap-2"><span className="text-cta mt-0.5">{I.check}</span>Suporte pós-compra</li>
                {k.id > 1 && <li className="flex gap-2"><span className="text-cta mt-0.5">{I.check}</span>{k.id} unidades inclusas</li>}
              </ul>

              <CTAButton kit={k.id} className="mt-5 w-full" variant={k.featured ? "primary" : "dark"} pulse={k.featured}>{k.cta}</CTAButton>
            </div>
          ))}
        </div>
        <p className="text-center text-[13px] text-mute mt-6 flex items-center justify-center gap-2">{I.lock} Checkout seguro · pagamento processado por gateway terceiro</p>
      </div>
    </section>
  );
}

/* ── TRUST / TESTIMONIALS ── */
function TrustSection() {
  const seals = ["Checkout seguro","Pagamento protegido","Envio acompanhado","Suporte pós-compra"];
  const testi = [
    { t:"Comprei porque queria algo prático para o carro. Gostei da explicação clara e do suporte após a compra.", a:"Rafael M.", l:"Carro · São Paulo, SP" },
    { t:"O que me chamou atenção foi ser rastreador e carregador ao mesmo tempo. Por menos de R$20 por mês, achei que valia testar.", a:"Juliana T.", l:"Carro + moto · Belo Horizonte, MG" },
    { t:"Eu tinha visto modelos mais baratos, mas preferi comprar onde estava tudo explicado de forma mais clara.", a:"Diego S.", l:"Moto · Curitiba, PR" },
  ];
  return (
    <section className="py-14 md:py-24 bg-white border-y border-line">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionLabel kicker="Prova e confiança" title="Compra segura, suporte depois do pedido" sub="A Nexo Brasil preparou uma experiência de compra direta: você entende o produto, confere as informações principais e finaliza pelo checkout. Depois da compra, o suporte pós-compra ajuda na configuração." />

        <div className="flex flex-wrap gap-2 mb-8">
          {seals.map((s,i)=>(
            <span key={i} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-bg border border-line text-[13px] font-semibold text-ink2">
              <span className="text-emerald-700">{I.check}</span>{s}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testi.map((t,i)=>(
            <figure key={i} className="rounded-2xl bg-bg border border-line p-5 shadow-soft">
              <div className="flex gap-0.5 text-amber-500 mb-3">{[0,0,0,0,0].map((_,j)=>(<span key={j} className="w-4 h-4">{I.star}</span>))}</div>
              <blockquote className="text-[14.5px] text-ink2 leading-relaxed">&ldquo;{t.t}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="w-9 h-9 grid place-items-center rounded-full bg-ink text-white text-[12px] font-bold">{t.a.split(" ").map(p=>p[0]).join("").slice(0,2)}</span>
                <span><span className="block font-semibold text-[13.5px]">{t.a}</span><span className="block text-[12px] text-mute">{t.l}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
function FAQ() {
  const qs = [
    { q:"O valor é R$197 ou 10x de R$19,70?", a:"As duas opções existem: você pode pagar R$197,00 à vista ou parcelar em 10x de R$19,70 no cartão. A escolha é feita no checkout, com pagamento processado em ambiente seguro." },
    { q:"Funciona com o veículo desligado?", a:"O produto funciona corretamente enquanto está conectado e recebendo alimentação pela entrada veicular. Quando não há fornecimento de energia, ele não opera." },
    { q:"Serve para moto?", a:"Sim, desde que a moto tenha entrada veicular/acendedor ou alimentação compatível e o local de uso proteja o produto contra água, chuva e exposição excessiva." },
    { q:"Tem escuta?", a:"Não. O produto não possui função de escuta. Essa é uma limitação que preferimos deixar clara antes da compra." },
    { q:"Tem bloqueio remoto?", a:"Não. O produto não possui função de bloqueio remoto. Ele oferece localização pelo aplicativo enquanto estiver conectado e recebendo energia." },
    { q:"Precisa de instalação técnica?", a:"Não há necessidade de instalação técnica complexa. O produto é encaixado na entrada veicular compatível e o suporte pós-compra orienta a configuração inicial." },
    { q:"Tenho suporte depois da compra?", a:"Sim. Depois da compra, nosso time atende pelo WhatsApp para ajudar na configuração do produto e do aplicativo, além de tirar dúvidas de uso." },
    { q:"É igual aos modelos baratos da Shopee?", a:"O hardware pode parecer similar a outros modelos no mercado. O que muda é a experiência ao redor: página clara, checkout seguro, parcelamento em 10x e suporte humanizado depois da compra." },
    { q:"Como faço a compra?", a:"É só clicar em qualquer botão de compra desta página. Você será direcionado ao checkout seguro, escolhe a forma de pagamento e finaliza. Depois, falamos com você para apoiar a configuração." },
  ];
  return (
    <section id="faq" className="py-14 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <SectionLabel center kicker="Dúvidas frequentes" title="Tira-dúvidas antes da compra" sub="Quanto mais claro antes, melhor a experiência depois." />
        <div className="space-y-3">
          {qs.map((x,i)=>(
            <details key={i} className="group rounded-2xl bg-card border border-line shadow-soft open:shadow-card">
              <summary className="flex items-center gap-4 p-5 md:p-6">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">{I.spark}</span>
                <span className="flex-1 font-bold text-[15.5px] md:text-[16.5px] text-ink">{x.q}</span>
                <span className="chev text-mute">{I.chev}</span>
              </summary>
              <div className="px-6 pb-6 -mt-1 text-[14.5px] text-mute leading-relaxed">{x.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FINAL CTA ── */
function FinalCTA() {
  return (
    <section className="py-14 md:py-24 bg-ink relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full" style={{background:"radial-gradient(closest-side, rgba(16,185,129,.25), transparent)"}}></div>
      <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full" style={{background:"radial-gradient(closest-side, rgba(16,185,129,.18), transparent)"}}></div>
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
        <Badge tone="cta"><span>{I.pin}</span> Oferta atual</Badge>
        <h2 className="mt-4 text-white text-[32px] md:text-[48px] font-extrabold tracking-tight leading-[1.05]">Por menos de R$20 por mês,<br className="hidden md:block"/> tenha mais controle sobre seu veículo.</h2>
        <p className="mt-4 text-slate-300 text-[15.5px] md:text-[17px] max-w-2xl mx-auto">Finalize sua compra pelo checkout de forma rápida e segura. Depois da compra, você poderá acionar o suporte pelo WhatsApp para configuração.</p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton size="lg" pulse>Ir para o checkout — {PRICE_PARC}</CTAButton>
          <span className="text-slate-400 text-[13px] flex items-center gap-2">{I.lock} Pagamento processado em ambiente seguro</span>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="bg-ink2 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <Logo light />
          <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">Rastreador veicular + carregador rápido USB-C 30W. Foco em transparência e suporte pós-compra.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-[14px] mb-3">Páginas</h4>
          <ul className="space-y-2 text-[13.5px]">
            <li><a href="#beneficios" className="hover:text-white">Benefícios</a></li>
            <li><a href="#como-funciona" className="hover:text-white">Como funciona</a></li>
            <li><a href="#oferta" className="hover:text-white">Oferta</a></li>
            <li><a href="#faq" className="hover:text-white">Dúvidas</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-[14px] mb-3">Suporte</h4>
          <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-[13.5px] hover:text-white">
            <span className="w-7 h-7 grid place-items-center rounded-lg bg-white/10">{I.whats}</span>
            Suporte pós-compra via WhatsApp
          </a>
          <p className="mt-4 text-[12px] text-slate-400 leading-relaxed">Produto indicado para veículos compatíveis com entrada de alimentação veicular. Leia as informações antes de comprar. O suporte pelo WhatsApp é destinado ao pós-compra.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-slate-400">
          <div>© {new Date().getFullYear()} Nexo Brasil. Todos os direitos reservados.</div>
          <div className="flex items-center gap-4"><span>CNPJ 00.000.000/0000-00</span><span>·</span><a href="#" className="hover:text-white">Política de privacidade</a><span>·</span><a href="#" className="hover:text-white">Termos</a></div>
        </div>
      </div>
    </footer>
  );
}

/* ── MOBILE STICKY CTA ── */
function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 520);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    trackCheckoutClick("1");
    setTimeout(() => { window.open(CHECKOUT_1, "_blank", "noopener"); }, 150);
  }

  return (
    <div className={"md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 "+(show?"translate-y-0":"translate-y-full")}>
      <div className="bg-white/90 backdrop-blur border-t border-line px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <a href={CHECKOUT_1} onClick={handleClick} target="_blank" rel="noopener" className="cta-ring relative flex items-center justify-between gap-3 w-full bg-cta text-white rounded-2xl px-4 py-3.5 shadow-[0_10px_24px_-8px_rgba(16,185,129,.6)]">
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] font-semibold text-white/85 uppercase tracking-wider">Comprar</span>
            <span className="text-[15px] font-extrabold">{PRICE_PARC}</span>
          </span>
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold">Finalizar {I.arrow}</span>
        </a>
      </div>
    </div>
  );
}

/* ── PAGE ── */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink pb-[88px] md:pb-0">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <PainSection />
        <HowItWorks />
        <Benefits />
        <FitSection />
        <TransparencyBlock />
        <Comparison />
        <OfferKits />
        <TrustSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
