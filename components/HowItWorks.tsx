const steps = [
  {
    step: "01",
    title: "Plugue no acendedor",
    description:
      "Conecte o Nexo Brasil à entrada veicular do seu carro ou moto. Sem ferramentas, sem instalação técnica.",
  },
  {
    step: "02",
    title: "Baixe o app parceiro",
    description:
      "Acesse o aplicativo indicado e cadastre seu dispositivo com o número de série.",
  },
  {
    step: "03",
    title: "Acompanhe em tempo real",
    description:
      "Veja a localização do seu veículo a qualquer momento pelo celular, onde você estiver.",
  },
  {
    step: "04",
    title: "Carregue seu celular também",
    description:
      "A porta USB-C 30W no mesmo dispositivo garante que seu celular fique sempre carregado.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Como funciona em 4 passos
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Plug & play. Sem obras, sem instalação profissional, sem mensalidade escondida.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-3/4 w-1/2 border-t-2 border-dashed border-green-200 z-0" />
              )}
              <div className="relative z-10 inline-flex w-16 h-16 rounded-full bg-green-600 text-white font-black text-xl items-center justify-center shadow-lg mb-4">
                {s.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
