const testimonials = [
  {
    name: "Marcos A.",
    vehicle: "Toyota Corolla 2021",
    stars: 5,
    text: "Instalei em 2 minutos. Agora sei exatamente onde meu carro está quando meu filho usa. Tranquilidade total.",
  },
  {
    name: "Fernanda C.",
    vehicle: "Honda CB 500",
    stars: 5,
    text: "Comprei o kit 2 unidades para a moto e para o carro da minha mãe. Chegou rápido e funcionou de primeira.",
  },
  {
    name: "Roberto S.",
    vehicle: "Fiat Strada 2023",
    stars: 5,
    text: "Estava pagando R$80/mês num rastreador profissional. Mudei para o Nexo Brasil e economizo muito. Recomendo.",
  },
  {
    name: "Ana Paula M.",
    vehicle: "Volkswagen Polo",
    stars: 5,
    text: "Simples, barato e funciona. O carregador USB-C de 30W é um bônus incrível. Celular sempre carregado.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Clientes que já protegem seus veículos
          </h2>
          <div className="flex justify-center items-center gap-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-700 font-bold ml-2">4.9/5 — 5.000+ clientes</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-3">
                {[...Array(t.stars)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                <div className="text-gray-400 text-xs">{t.vehicle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {[
            { icon: "🔒", title: "Compra Segura", text: "SSL, pagamento criptografado e proteção total dos seus dados." },
            { icon: "↩️", title: "30 Dias de Garantia", text: "Não ficou satisfeito? Devolva em até 30 dias e receba o reembolso." },
            { icon: "🚚", title: "Frete Grátis", text: "Entregamos para todo o Brasil sem custo adicional." },
          ].map((item) => (
            <div key={item.title} className="text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
