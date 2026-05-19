const rows = [
  { feature: "Rastreamento GPS", nexo: true, traditional: true, none: false },
  { feature: "Plug & play", nexo: true, traditional: false, none: false },
  { feature: "Carregador USB-C 30W", nexo: true, traditional: false, none: false },
  { feature: "Sem mensalidade obrigatória", nexo: true, traditional: false, none: true },
  { feature: "Sem contrato de fidelidade", nexo: true, traditional: false, none: true },
  { feature: "Instalação em segundos", nexo: true, traditional: false, none: true },
  { feature: "Custo abaixo de R$20/mês", nexo: true, traditional: false, none: true },
  { feature: "Funciona sem chip adicional", nexo: true, traditional: false, none: false },
];

function Check({ value }: { value: boolean }) {
  return value ? (
    <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-red-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

export function Comparison() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Nexo Brasil vs. alternativas
          </h2>
          <p className="text-gray-600 text-lg">Compara antes de decidir.</p>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="grid grid-cols-4 bg-gray-900 text-white text-sm font-bold">
            <div className="p-4">Recurso</div>
            <div className="p-4 text-center text-green-400">Nexo Brasil</div>
            <div className="p-4 text-center text-gray-300">Rastreador tradicional</div>
            <div className="p-4 text-center text-gray-400">Sem rastreador</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 border-b border-gray-100 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <div className="p-4 font-medium text-gray-700">{row.feature}</div>
              <div className="p-4">
                <Check value={row.nexo} />
              </div>
              <div className="p-4">
                <Check value={row.traditional} />
              </div>
              <div className="p-4">
                <Check value={row.none} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
