const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_URL ||
  "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20comprei%20na%20Nexo%20Brasil%20e%20preciso%20de%20suporte";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="font-bold text-white">Nexo Brasil</span>
            </div>
            <p className="text-sm leading-relaxed">
              Rastreador GPS Veicular 2 em 1 com Carregador USB-C 30W.
              Tecnologia acessível para proteger o que é seu.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#oferta" className="hover:text-white transition-colors">Ver oferta</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Perguntas frequentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Suporte pós-compra</h4>
            <p className="text-sm mb-3">
              Já realizou sua compra e precisa de ajuda? Fale conosco pelo WhatsApp.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.12 1.523 5.856L.057 23.492a.5.5 0 00.614.614l5.698-1.458A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.9 0-3.68-.511-5.21-1.404l-.374-.222-3.883.993.994-3.795-.245-.39A9.805 9.805 0 012.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z"/>
              </svg>
              Suporte pós-compra via WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          <p>
            © {new Date().getFullYear()} Nexo Brasil. Todos os direitos reservados. · CNPJ: a preencher
          </p>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Este site não pertence ao Facebook/Meta. Os resultados podem variar. O produto funciona enquanto
            conectado à alimentação veicular. Não substitui sistemas de rastreamento profissional. Veja
            todos os detalhes na seção de transparência.
          </p>
        </div>
      </div>
    </footer>
  );
}
