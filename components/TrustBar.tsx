const items = [
  { icon: "🔒", text: "Pagamento 100% seguro" },
  { icon: "🚚", text: "Frete grátis para todo Brasil" },
  { icon: "↩️", text: "30 dias de garantia" },
  { icon: "📍", text: "Rastreamento em tempo real" },
  { icon: "⚡", text: "Plug & play — sem instalação" },
];

export function TrustBar() {
  return (
    <section className="bg-green-600 text-white py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm font-medium">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
