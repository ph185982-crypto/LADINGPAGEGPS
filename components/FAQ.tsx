"use client";

import { useState } from "react";

const faqs = [
  {
    q: "O Nexo Brasil funciona em qualquer veículo?",
    a: "Funciona em carros e motos que possuam entrada veicular (acendedor) de 12V ou 24V compatível. Verifique se seu veículo tem essa entrada antes de comprar.",
  },
  {
    q: "Precisa de chip ou mensalidade?",
    a: "O produto utiliza conectividade própria. Não existe mensalidade obrigatória nem necessidade de inserir chip separadamente. Consulte as condições de conectividade na embalagem.",
  },
  {
    q: "Funciona em motos?",
    a: "Sim, mas recomendamos proteger o dispositivo contra chuva e exposição excessiva à água. Em motos muito expostas ao tempo, utilize uma proteção adicional.",
  },
  {
    q: "Posso bloquear o veículo remotamente?",
    a: "Não. O Nexo Brasil é um rastreador GPS. Não possui função de bloqueio remoto. Para bloqueio, considere um rastreador profissional instalado.",
  },
  {
    q: "Tem escuta ambiental?",
    a: "Não. O dispositivo não possui microfone nem escuta ambiental. Respeita totalmente a privacidade dos ocupantes.",
  },
  {
    q: "Em quanto tempo recebo?",
    a: "Os pedidos são processados em até 1 dia útil. O prazo de entrega varia por região, geralmente entre 5 e 12 dias úteis.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Garantia de 30 dias a contar da data de recebimento. Se não estiver satisfeito por qualquer motivo, entre em contato para devolução e reembolso completo.",
  },
  {
    q: "O carregador USB-C 30W funciona independente?",
    a: "Sim! Mesmo que você não use a função de rastreamento imediatamente, o carregador USB-C 30W funciona normalmente.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-gray-600 text-lg">Tudo que você precisa saber antes de comprar.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
