const pains = [
  {
    icon: "😰",
    title: "Medo de ter o veículo roubado?",
    description:
      "Um roubo pode custar dezenas de milhares de reais. Sem rastreamento, a chance de recuperar é mínima.",
  },
  {
    icon: "💸",
    title: "Rastreadores profissionais são caros demais?",
    description:
      "Planos mensais de R$60, R$80 ou mais. Instalação paga. Fidelidade. Tudo isso sem necessidade.",
  },
  {
    icon: "😤",
    title: "Filho/funcionário usando o carro sem você saber?",
    description:
      "Sem rastreamento, você nunca sabe realmente onde seu veículo está neste momento.",
  },
  {
    icon: "🔌",
    title: "Cansado de carregar o celular no cabo?",
    description:
      "Rastreador no acendedor e carregador USB-C 30W no mesmo dispositivo. Dois problemas resolvidos.",
  },
];

export function PainSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Você já passou por isso?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Esses problemas são mais comuns do que parecem — e têm solução simples.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pains.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
