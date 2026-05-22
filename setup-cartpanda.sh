#!/usr/bin/env bash
# =============================================================
# NEXO BRASIL — Script de configuração Cartpanda
# Rodar LOCALMENTE (não neste ambiente cloud)
# =============================================================
# USO:
#   1. Copie este arquivo para sua máquina local
#   2. Edite as variáveis abaixo com seus dados reais
#   3. chmod +x setup-cartpanda.sh
#   4. Rode DRY_RUN primeiro: DRY_RUN=true bash setup-cartpanda.sh
#   5. Confirme os payloads e rode: DRY_RUN=false bash setup-cartpanda.sh
# =============================================================

set -euo pipefail

# ---------- CONFIGURE AQUI ----------
# Você pode passar o token via variável de ambiente ou deixar hardcoded abaixo:
#   export CARTPANDA_API_TOKEN=dtezlOs7K3MNJ1rYbcn06xg5lXUbHEsmjtSfLgkFby4lsymoC2WEH4jfed6K
#   export CARTPANDA_STORE_SLUG=SEU_SLUG_AQUI
CP_TOKEN="${CARTPANDA_API_TOKEN:-PREENCHER_TOKEN_AQUI}"
CP_STORE="${CARTPANDA_STORE_SLUG:-PREENCHER_SLUG_AQUI}"   # slug da loja (ex: nexobr, nexobrasil, etc.)
DRY_RUN="${DRY_RUN:-true}"                                 # true = só mostra, false = executa

# Dados de rastreamento (já configurados na landing)
META_PIXEL_ID="628397072200898"
META_CAPI_TOKEN="EAAcNazmVPQ8BQ7ZC1RsqPQtZABhjaH3FQi9OjXXk8gojv3gSjPy7dCXHJTMxJrOfPhwo34ENt4Yx25eYtsr4dStu6W3PgUJkha3ZCj7IcuL3vnkCAQfEyR19kN0EJaA88JzQtkmGJK9eTPLGnJdXeE2vRZCeMq6AOz4F2dQZCM1gE8RLZC9ZBY9tkYE2CNFpaWDYAZDZD"
# ------------------------------------

# Tenta variações de base URL comuns na Cartpanda
BASE_URLS=(
  "https://${CP_STORE}.cartpanda.com/api/v1"
  "https://api.cartpanda.com/v1/shops/${CP_STORE}"
  "https://${CP_STORE}.cartpanda.com/api"
)

BASE_URL=""

# ----------- Funções utilitárias -----------

log()  { echo "[INFO]  $*"; }
warn() { echo "[WARN]  $*"; }
err()  { echo "[ERROR] $*" >&2; }

# Nunca imprime o token
safe_curl() {
  local method="$1" url="$2" data="${3:-}"
  local args=(-s -w "\n%{http_code}" -H "Authorization: Bearer ${CP_TOKEN}" -H "Content-Type: application/json")
  [[ -n "$data" ]] && args+=(-d "$data")
  curl "${args[@]}" -X "$method" "$url" 2>/dev/null
}

# Detecta base URL que responde
detect_base_url() {
  log "Detectando URL base da API Cartpanda..."
  for url in "${BASE_URLS[@]}"; do
    resp=$(curl -s -o /tmp/cp_probe.json -w "%{http_code}" \
      -H "Authorization: Bearer ${CP_TOKEN}" \
      --connect-timeout 8 \
      "${url}/products" 2>/dev/null)
    if [[ "$resp" == "200" || "$resp" == "401" ]]; then
      BASE_URL="$url"
      log "Base URL encontrada: $BASE_URL (HTTP $resp)"
      return 0
    fi
    log "  [${resp}] ${url}/products — tentando próxima..."
  done
  err "Nenhuma URL base respondeu. Verifique:"
  err "  1. Se a loja '$CP_STORE' existe no Cartpanda"
  err "  2. Se o token está correto"
  err "  3. Se está rodando em rede com acesso à Cartpanda"
  exit 1
}

# Cria produto (DRY_RUN ou real)
create_product() {
  local name="$1" payload="$2"
  echo ""
  echo "========================================"
  echo "PRODUTO: $name"
  echo "========================================"
  echo "PAYLOAD (DRY_RUN=$DRY_RUN):"
  echo "$payload" | python3 -m json.tool 2>/dev/null || echo "$payload"

  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY_RUN=true — produto NÃO foi criado. Rode com DRY_RUN=false para criar."
    return 0
  fi

  read -rp "Confirmar criação de '$name'? [s/N] " confirm
  [[ "$confirm" != "s" && "$confirm" != "S" ]] && { warn "Pulado."; return 0; }

  local response
  response=$(safe_curl POST "${BASE_URL}/products" "$payload")
  local body http_code
  body=$(echo "$response" | head -n -1)
  http_code=$(echo "$response" | tail -n1)

  if [[ "$http_code" == "200" || "$http_code" == "201" ]]; then
    local prod_id handle
    prod_id=$(echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('product',d).get('id','N/A'))" 2>/dev/null || echo "N/A")
    handle=$(echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('product',d).get('handle','N/A'))" 2>/dev/null || echo "N/A")
    log "✅ Criado! ID: $prod_id | Handle: $handle"
    echo "  Checkout: https://${CP_STORE}.cartpanda.com/checkout/${handle}"
    echo "$name|$prod_id|$handle" >> /tmp/cartpanda_produtos.txt
  else
    err "Erro HTTP $http_code ao criar $name"
    echo "Response: $body" | head -c 500
  fi
}

# ----------- Payloads dos produtos -----------

PAYLOAD_PRODUTO_1=$(cat <<'JSON'
{
  "product": {
    "title": "Rastreador GPS Veicular 2 em 1 + Carregador USB-C 30W",
    "body_html": "<p>O Rastreador GPS Veicular 2 em 1 da Nexo Brasil une praticidade, localização e carregamento rápido em um único dispositivo.</p><p>Com ele, você pode acompanhar a localização do veículo pelo aplicativo enquanto o aparelho estiver conectado e recebendo alimentação.</p><p>Além disso, funciona como carregador rápido USB-C 30W. Compatível com carros e motos com entrada veicular/acendedor compatível.</p><p><strong>Importante:</strong> Precisa estar conectado para funcionar. Em motos, proteger contra água. Sem escuta. Sem bloqueio remoto.</p>",
    "vendor": "Nexo Brasil",
    "product_type": "Produto físico",
    "status": "active",
    "variants": [
      {
        "title": "Default",
        "price": "197.00",
        "sku": "GPS-2EM1-1UN",
        "inventory_quantity": 9999,
        "fulfillment_service": "manual",
        "requires_shipping": true,
        "taxable": true
      }
    ]
  }
}
JSON
)

PAYLOAD_PRODUTO_2=$(cat <<'JSON'
{
  "product": {
    "title": "Kit 2 Unidades - Rastreador GPS 2 em 1",
    "body_html": "<p>Ideal para casal, família ou dois veículos compatíveis. 2x Rastreador GPS Veicular 2 em 1 + Carregador USB-C 30W da Nexo Brasil.</p>",
    "vendor": "Nexo Brasil",
    "product_type": "Produto físico",
    "status": "active",
    "variants": [
      {
        "title": "Default",
        "price": "347.00",
        "sku": "GPS-2EM1-2UN",
        "inventory_quantity": 9999,
        "fulfillment_service": "manual",
        "requires_shipping": true,
        "taxable": true
      }
    ]
  }
}
JSON
)

PAYLOAD_PRODUTO_3=$(cat <<'JSON'
{
  "product": {
    "title": "Kit 3 Unidades - Rastreador GPS 2 em 1",
    "body_html": "<p>Ideal para família, frota pequena ou três veículos compatíveis. 3x Rastreador GPS Veicular 2 em 1 + Carregador USB-C 30W da Nexo Brasil.</p>",
    "vendor": "Nexo Brasil",
    "product_type": "Produto físico",
    "status": "active",
    "variants": [
      {
        "title": "Default",
        "price": "479.00",
        "sku": "GPS-2EM1-3UN",
        "inventory_quantity": 9999,
        "fulfillment_service": "manual",
        "requires_shipping": true,
        "taxable": true
      }
    ]
  }
}
JSON
)

PAYLOAD_ORDER_BUMP=$(cat <<'JSON'
{
  "product": {
    "title": "Atendimento Prioritário de Configuração",
    "body_html": "<p>Receba prioridade no suporte pós-compra para configurar seu Rastreador GPS 2 em 1 com mais rapidez após a confirmação do pedido.</p>",
    "vendor": "Nexo Brasil",
    "product_type": "Serviço digital",
    "status": "active",
    "variants": [
      {
        "title": "Default",
        "price": "19.90",
        "sku": "ATEND-PRIORITARIO",
        "requires_shipping": false,
        "taxable": true
      }
    ]
  }
}
JSON
)

PAYLOAD_UPSELL=$(cat <<'JSON'
{
  "product": {
    "title": "Rastreador GPS 2 em 1 - Segunda Unidade com Desconto",
    "body_html": "<p>Adicione mais 1 unidade para outro veículo da família, carro do trabalho ou moto com entrada veicular compatível. Mesmo envio, mais economia.</p>",
    "vendor": "Nexo Brasil",
    "product_type": "Produto físico",
    "status": "active",
    "variants": [
      {
        "title": "Default",
        "price": "167.00",
        "sku": "GPS-2EM1-UPSELL",
        "inventory_quantity": 9999,
        "fulfillment_service": "manual",
        "requires_shipping": true,
        "taxable": true
      }
    ]
  }
}
JSON
)

# ----------- Execução principal -----------

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║     NEXO BRASIL — Configuração Cartpanda              ║"
echo "║     DRY_RUN=${DRY_RUN}                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if [[ "$CP_TOKEN" == "PREENCHER_TOKEN_AQUI" ]]; then
  err "Configure CARTPANDA_API_TOKEN antes de rodar."
  err "  export CARTPANDA_API_TOKEN=seu_token_aqui"
  exit 1
fi

> /tmp/cartpanda_produtos.txt

# Etapa 1: detectar base URL
detect_base_url

# Etapa 2: criar produtos
create_product "Produto Principal (1 unidade — R\$197)" "$PAYLOAD_PRODUTO_1"
create_product "Kit 2 Unidades (R\$347)" "$PAYLOAD_PRODUTO_2"
create_product "Kit 3 Unidades (R\$479)" "$PAYLOAD_PRODUTO_3"
create_product "Order Bump — Atendimento Prioritário (R\$19,90)" "$PAYLOAD_ORDER_BUMP"
create_product "Upsell — Segunda Unidade com Desconto (R\$167)" "$PAYLOAD_UPSELL"

# Etapa 3: relatório
echo ""
echo "════════════════════════════════════════════════════════"
echo " RELATÓRIO FINAL"
echo "════════════════════════════════════════════════════════"
if [[ -s /tmp/cartpanda_produtos.txt ]]; then
  echo ""
  echo "Produtos criados:"
  while IFS='|' read -r nome id handle; do
    echo "  ✅ $nome"
    echo "     ID: $id"
    echo "     Checkout: https://${CP_STORE}.cartpanda.com/checkout/${handle}"
  done < /tmp/cartpanda_produtos.txt
  echo ""
  echo "Variáveis para a landing page (atualizar na Vercel):"
  echo ""
  # Extrair handles por SKU
  p1_handle=$(grep "GPS-2EM1-1UN" /tmp/cartpanda_produtos.txt 2>/dev/null | cut -d'|' -f3 || echo "PREENCHER")
  p2_handle=$(grep "GPS-2EM1-2UN" /tmp/cartpanda_produtos.txt 2>/dev/null | cut -d'|' -f3 || echo "PREENCHER")
  p3_handle=$(grep "GPS-2EM1-3UN" /tmp/cartpanda_produtos.txt 2>/dev/null | cut -d'|' -f3 || echo "PREENCHER")
  echo "NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL=https://${CP_STORE}.cartpanda.com/checkout/${p1_handle}"
  echo "NEXT_PUBLIC_CHECKOUT_2_UNIDADES_URL=https://${CP_STORE}.cartpanda.com/checkout/${p2_handle}"
  echo "NEXT_PUBLIC_CHECKOUT_3_UNIDADES_URL=https://${CP_STORE}.cartpanda.com/checkout/${p3_handle}"
else
  warn "Nenhum produto foi criado (DRY_RUN=$DRY_RUN ou confirmações negadas)."
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo " ETAPAS MANUAIS RESTANTES (no painel Cartpanda)"
echo "════════════════════════════════════════════════════════"
cat <<'MANUAL'

1. ORDER BUMP
   Checkout → Order Bumps → Novo
   Produto: Atendimento Prioritário (R$19,90)
   Título: "Adicione atendimento prioritário por apenas R$19,90"
   Checkbox: "Sim, quero atendimento prioritário por R$19,90"
   Regra: exibir para produto principal + kit 2 + kit 3

2. UPSELL PÓS-COMPRA
   Checkout → Upsells → Novo
   Produto: Segunda Unidade com Desconto (R$167)
   Título: "Adicione mais 1 unidade com desconto"
   Botão aceitar: "Sim, adicionar mais 1 com desconto"
   Botão recusar: "Não, obrigado. Quero continuar com apenas 1 unidade."
   Regra: exibir apenas para quem comprou 1 unidade

3. FRETE
   Configurações → Frete → Nova zona → Brasil
   Método: Fixo → R$19,90
   Aplicar a: produtos físicos

4. PAGAMENTO
   Configurações → Pagamentos
   Ativar: Pix ✓ | Cartão ✓ | Parcelamento até 10x

5. PIXELS — META (FACEBOOK)
   Caminho no painel: Admin → Rastreamento e scripts → Pixels → Novo Pixel
   Tipo: Padrão + API (recomendado para CAPI)

   Campos a preencher:
     Nome do pixel:          Pixel Facebook Nexo Brasil
     Facebook Pixel ID:      628397072200898
     Token de acesso (CAPI): EAAcNazmVPQ8BQ7ZC1RsqPQtZABhjaH3FQi9OjXXk8gojv3gSjPy7dCXHJTMxJrOfPhwo34ENt4Yx25eYtsr4dStu6W3PgUJkha3ZCj7IcuL3vnkCAQfEyR19kN0EJaA88JzQtkmGJK9eTPLGnJdXeE2vRZCeMq6AOz4F2dQZCM1gE8RLZC9ZBY9tkYE2CNFpaWDYAZDZD

   Opções recomendadas:
     ✓ Disparar compra para boleto bancário
     ✓ Disparar compra na página de pagamento PIX
     ✓ Incluir valor do frete no evento de compra

   Após salvar: teste com Meta Pixel Helper ou Gerenciador de Eventos → Teste de Eventos

6. DOMÍNIO DO CHECKOUT
   Configurações → Domínio personalizado
   Adicionar: pagamento.SEUDOMINIO.com.br
   Copiar CNAME da Cartpanda e criar no seu provedor de domínio

7. PÁGINA DE OBRIGADO
   Checkout → Página de Obrigado
   Título: "Pedido confirmado!"
   Botão WhatsApp: "Suporte pós-compra via WhatsApp"
   (NÃO adicionar WhatsApp no checkout em si)

MANUAL

echo "Script concluído."
