const forYou = [
  "Quer saber onde seu veículo está a qualquer momento",
  "Quer monitorar o carro do filho ou funcionário",
  "Tem carro ou moto com entrada veicular 12V/24V",
  "Quer rastreamento sem contrato de fidelidade",
  "Quer também carregar o celular com USB-C 30W",
  "Busca custo acessível por menos de R$20/mês",
];

const notForYou = [
  "Precisa de bloqueio remoto do veículo",
  "Precisa de escuta ambiental",
  "Quer rastreamento profissional instalado na lataria",
  "Veículo não tem entrada veicular compatível",
  "Moto exposta a muita chuva sem proteção adicional",
];

export function FitSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Este produto é para você?
          </h2>
          <p className="text-gray-600 text-lg">
            Somos transparentes. Veja se o Nexo Brasil faz sentido para o seu caso.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h3 className="text-xl font-black text-green-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">✅</span> Para quem é ideal
            </h3>
            <ul className="space-y-3">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-black text-gray-700 mb-6 flex items-center gap-2">
              <span className="text-2xl">❌</span> Não é para quem
            </h3>
            <ul className="space-y-3">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
