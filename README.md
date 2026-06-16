# BRIDGE — Site Institucional

Site institucional da **Bridge Tecnologia e Consultoria LTDA** — IA aplicada, automação e software sob medida.

🌐 **Produção:** [www.bridgetech.ia.br](https://www.bridgetech.ia.br)

---

## 📦 Stack

| Item | Tecnologia |
|------|------------|
| Frontend | HTML + CSS + JavaScript (estático, sem build) |
| Hospedagem | Vercel (deploy estático) |
| Domínio / DNS | Registro.br |
| E-mail (encaminhamento) | ImprovMX (grátis) |
| Formulário de contato | Web3Forms (grátis) + fallback WhatsApp |

> Não há etapa de build. O `vercel.json` define `framework: null` e serve os arquivos da raiz diretamente.

---

## 🚀 Deploy (automático)

O deploy é **automático via integração Git com a Vercel**:

- Todo `push` na branch **`main`** dispara um novo deploy de produção na Vercel automaticamente.
- Projeto Vercel: **`bridgetech-site`** (team `antonio-8767's projects`).
- Não é necessário rodar nada manualmente — basta commitar e dar push.

```bash
git add .
git commit -m "sua mensagem"
git push origin main   # -> Vercel republica sozinho em segundos
```

### Domínios
- `www.bridgetech.ia.br` → site (HTTP 200, HTTPS)
- `bridgetech.ia.br` (apex) → redireciona (308) para `www`
- DNS gerenciado no Registro.br, apontando para a Vercel.

---

## 🔒 Segurança (vercel.json)

Headers de segurança aplicados a todas as rotas via `vercel.json`:

- `Content-Security-Policy` (restritiva; libera Google Fonts e `api.web3forms.com`)
- `Strict-Transport-Security` (HSTS, 2 anos, preload)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (bloqueia câmera, microfone, geolocalização etc.)
- `Cross-Origin-Opener-Policy: same-origin`

Cache de assets (`/assets/*`): `public, max-age=3600, stale-while-revalidate=86400`.

---

## 📧 E-mail do domínio (ImprovMX — grátis)

Os e-mails do domínio `bridgetech.ia.br` são **encaminhados** para `antonio@liderancatech.com` via ImprovMX (sem custo). DNS (no Registro.br):

```
MX   10  mx1.improvmx.com
MX   20  mx2.improvmx.com
TXT      v=spf1 include:spf.improvmx.com ~all
```

Aliases configurados no painel do ImprovMX:

| Endereço | Encaminha para |
|----------|----------------|
| `contato@bridgetech.ia.br` | `antonio@liderancatech.com` |
| `antonio@bridgetech.ia.br` | `antonio@liderancatech.com` |
| `*@bridgetech.ia.br` (catch-all) | `antonio@liderancatech.com` |

### Enviar como contato@ (Gmail)
O Gmail (`antonio@liderancatech.com`) está configurado com **"Enviar e-mail como" `contato@bridgetech.ia.br`** usando o SMTP do Google (`smtp.gmail.com:587`, TLS) com uma Senha de App — grátis. Permite responder leads já com o endereço institucional.

---

## 📨 Formulário de contato

Arquivo: `assets/contato.js` (página `contato.html`).

- Serviço: **Web3Forms** (`https://api.web3forms.com/submit`).
- Chave de acesso vinculada ao destino **`contato@bridgetech.ia.br`**: `77778dfd-f430-4188-9a51-e6aa4b795dee`.
- `ccemail`: envia cópia direta para `antonio@liderancatech.com`.
- `replyto`: definido com o e-mail do lead (responde direto ao cliente).
- **Fallback WhatsApp:** se a chave estiver vazia, o formulário redireciona para o WhatsApp `(81) 9.7118-1007`.
- Proteção anti-spam: honeypot (`botcheck`) + validação de campos + consentimento LGPD obrigatório.

Fluxo: formulário → `contato@bridgetech.ia.br` (encaminha p/ Gmail) + cópia para `antonio@`.

---

## 📁 Estrutura

```
.
├── index.html              # Home
├── servicos.html           # Serviços
├── sobre.html              # Sobre
├── cases.html              # Cases / portfólio
├── contato.html            # Contato (formulário)
├── privacidade.html        # Política de Privacidade (LGPD)
├── 404.html                # Página de erro
├── robots.txt              # SEO + permissões de crawlers de IA
├── sitemap.xml             # Mapa do site
├── llms.txt                # Contexto para LLMs
├── vercel.json             # Config de deploy + headers de segurança
└── assets/
    ├── bridge.css          # Estilos
    ├── bridge.js           # Scripts (animações, interações)
    ├── contato.js          # Lógica do formulário (Web3Forms)
    ├── favicon.svg / .png  # Ícones
    ├── og-image.png        # Imagem Open Graph
    ├── logos/              # Logos de clientes/cases
    └── svc/                # Imagens dos serviços
```

---

## 🔍 SEO

- `canonical` e Open Graph apontando para `https://www.bridgetech.ia.br/`
- `sitemap.xml` e `robots.txt` (libera explicitamente GPTBot, ClaudeBot, PerplexityBot, etc.)
- Meta tags, geo tags (Natal/RN) e Twitter cards por página

---

## 🩺 Monitoramento

Verificação automática a cada 6 horas (HTTP 200, HTTPS e headers de segurança nos dois domínios + status do último deploy na Vercel). Em caso de falha, alerta por notificação no app, e-mail e push.

---

## 🛠️ Desenvolvimento local

Por ser estático, basta servir a pasta:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

---

© BRIDGE Tecnologia e Consultoria LTDA — Natal/RN, atuação nacional.
