const benefits = [
  {
    icon: "📍",
    title: "Localização em tempo real",
    description: "Acompanhe a posição do veículo diretamente no app, a qualquer hora do dia.",
  },
  {
    icon: "⚡",
    title: "Carregador USB-C 30W incluso",
    description: "Dois produtos em um. Rastreie e carregue seu celular ao mesmo tempo.",
  },
  {
    icon: "🔌",
    title: "Plug & play — sem instalação",
    description: "Basta conectar na entrada veicular. Funciona em segundos.",
  },
  {
    icon: "📱",
    title: "Controle pelo celular",
    description: "App intuitivo compatível com Android e iOS. Histórico de rotas disponível.",
  },
  {
    icon: "💰",
    title: "Sem mensalidade obrigatória",
    description: "Sem contrato de fidelidade. Você decide como e quando usar.",
  },
  {
    icon: "🚗",
    title: "Compatível com carros e motos",
    description: "Funciona em qualquer veículo com entrada veicular de 12V ou 24V compatível.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Por que o Nexo Brasil?
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Rastreamento inteligente sem complicação e sem custo abusivo.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4"
            >
              <div className="text-3xl flex-shrink-0">{b.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
