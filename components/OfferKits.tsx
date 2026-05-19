import { CheckoutButton } from "./CheckoutButton";

const CHECKOUT_1 = process.env.NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL || "#checkout";
const CHECKOUT_2 = process.env.NEXT_PUBLIC_CHECKOUT_2_UNIDADES_URL || "#checkout";
const CHECKOUT_3 = process.env.NEXT_PUBLIC_CHECKOUT_3_UNIDADES_URL || "#checkout";

const kits = [
  {
    id: "1" as const,
    title: "1 Unidade",
    subtitle: "Para um veículo",
    price: "10x de R$19,70",
    total: "ou R$197,00 à vista",
    badge: null,
    items: ["1x Rastreador GPS Nexo Brasil", "1x Carregador USB-C 30W integrado", "Garantia de 30 dias", "Frete grátis"],
    buttonText: "Comprar 1 unidade",
    url: CHECKOUT_1,
    highlight: false,
  },
  {
    id: "2" as const,
    title: "Kit 2 Unidades",
    subtitle: "Para dois veículos",
    price: "10x de R$34,70",
    total: "ou R$347,00 à vista",
    badge: "Mais escolhido",
    items: ["2x Rastreador GPS Nexo Brasil", "2x Carregador USB-C 30W integrado", "Garantia de 30 dias", "Frete grátis"],
    buttonText: "Comprar kit com 2",
    url: CHECKOUT_2,
    highlight: true,
  },
  {
    id: "3" as const,
    title: "Kit 3 Unidades",
    subtitle: "Para a família toda",
    price: "10x de R$47,90",
    total: "ou R$479,00 à vista",
    badge: "Melhor custo por unidade",
    items: ["3x Rastreador GPS Nexo Brasil", "3x Carregador USB-C 30W integrado", "Garantia de 30 dias", "Frete grátis"],
    buttonText: "Comprar kit com 3",
    url: CHECKOUT_3,
    highlight: false,
  },
];

export function OfferKits() {
  return (
    <section id="oferta" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Escolha o seu kit
          </h2>
          <p className="text-gray-600 text-lg">
            Quanto mais você protege, mais econômico por unidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className={`relative rounded-2xl border-2 p-8 ${
                kit.highlight
                  ? "border-green-500 shadow-xl shadow-green-100 scale-105"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {kit.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black whitespace-nowrap ${
                    kit.highlight
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-gray-900"
                  }`}
                >
                  {kit.badge}
                </div>
              )}

              <h3 className="text-xl font-black text-gray-900 mb-1">{kit.title}</h3>
              <p className="text-gray-500 text-sm mb-6">{kit.subtitle}</p>

              <div className="mb-6">
                <div className={`text-3xl font-black ${kit.highlight ? "text-green-600" : "text-gray-900"}`}>
                  {kit.price}
                </div>
                <div className="text-gray-400 text-sm mt-1">{kit.total}</div>
              </div>

              <ul className="space-y-2 mb-8">
                {kit.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <CheckoutButton
                kit={kit.id}
                url={kit.url}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95 ${
                  kit.highlight
                    ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-200"
                    : "bg-gray-900 hover:bg-gray-700 text-white"
                }`}
              >
                {kit.buttonText}
              </CheckoutButton>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Pagamento seguro via Pix, cartão de crédito ou boleto.
        </p>
      </div>
    </section>
  );
}
