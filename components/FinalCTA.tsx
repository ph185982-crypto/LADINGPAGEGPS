import { CheckoutButton } from "./CheckoutButton";

const CHECKOUT_1 = process.env.NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL || "#checkout";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Seu veículo merece proteção agora
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Por menos de R$20 por mês você sabe onde seu veículo está a qualquer momento.
          Plug & play. Sem contrato. Sem instalação.
        </p>

        <div className="mb-6">
          <div className="text-4xl font-black text-white">
            10x de <span className="text-green-400">R$19,70</span>
          </div>
          <div className="text-gray-400 mt-1">ou R$197,00 à vista com Pix</div>
        </div>

        <CheckoutButton
          kit="1"
          url={CHECKOUT_1}
          className="bg-green-500 hover:bg-green-400 text-white font-black text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-green-900/40 hover:scale-105 active:scale-95 inline-block"
        >
          Ir para o checkout →
        </CheckoutButton>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <span>🔒 Pagamento seguro</span>
          <span>🚚 Frete grátis</span>
          <span>↩️ 30 dias de garantia</span>
        </div>
      </div>
    </section>
  );
}
