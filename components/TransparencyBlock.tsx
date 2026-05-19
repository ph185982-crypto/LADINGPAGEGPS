const disclosures = [
  "Funciona corretamente enquanto conectado e recebendo alimentação veicular.",
  "Compatível com carros e motos com entrada veicular/acendedor de 12V ou 24V compatível.",
  "Em motos, recomendamos proteger o dispositivo contra chuva e exposição excessiva à água.",
  "Não possui função de escuta ambiental.",
  "Não possui função de bloqueio remoto do veículo.",
  "Não garantimos proteção absoluta contra roubo — é uma ferramenta de rastreamento, não um sistema antifurto.",
  "Não substitui rastreamento profissional instalado diretamente na lataria do veículo.",
];

export function TransparencyBlock() {
  return (
    <section className="py-12 md:py-16 bg-yellow-50 border-y border-yellow-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">⚠️</div>
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">
              Transparência total — leia antes de comprar
            </h2>
            <ul className="space-y-3">
              {disclosures.map((d) => (
                <li key={d} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                  <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
