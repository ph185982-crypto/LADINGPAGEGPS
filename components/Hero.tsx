import { CheckoutButton } from "./CheckoutButton";

const CHECKOUT_1 = process.env.NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL || "#checkout";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-600 bg-opacity-20 border border-green-500 rounded-full px-4 py-1.5 text-green-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Mais de 5.000 veículos protegidos
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Saiba onde seu veículo está por menos de{" "}
              <span className="text-green-400">R$20 por mês</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Rastreador GPS veicular 2 em 1 com carregador USB-C 30W. Ideal
              para carros e motos com entrada veicular compatível.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
              <div>
                <div className="text-3xl font-black text-white">
                  10x de <span className="text-green-400">R$19,70</span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  ou R$197,00 à vista
                </div>
              </div>
            </div>

            <CheckoutButton
              kit="1"
              url={CHECKOUT_1}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40 hover:scale-105 active:scale-95"
            >
              Comprar agora por 10x de R$19,70
            </CheckoutButton>

            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Frete grátis · Garantia de 30 dias · Pagamento seguro</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center border border-gray-600 shadow-2xl">
                <div className="text-center text-gray-400 p-8">
                  <svg className="w-24 h-24 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium">Rastreador GPS Veicular</p>
                  <p className="text-xs mt-1">2 em 1 + Carregador USB-C 30W</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                2 EM 1
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
