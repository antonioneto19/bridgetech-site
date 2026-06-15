# BRIDGE SITE — Ruflo Agent Context
## Site Institucional | Bridge Tecnologia e Consultoria LTDA
### Versão 1.0 | Antonio Barbosa | Junho 2026

---

> **INSTRUÇÃO**: Este arquivo é lido pelo Ruflo MCP a cada sessão Claude neste repositório.
> Referência ao orquestrador central: `antonioneto19/ruflo-workspace`
>
> **NOTA (CI/CD)**: O workflow do GitHub Actions deste repositório NÃO usa mais agentes Ruflo.
> O CI agora faz apenas validação determinística do site (`.github/workflows/validacao-site.yml`):
> rápido, gratuito e sem dependência de chaves de API. O deploy de produção é feito pela Vercel.
> O uso do Ruflo MCP descrito abaixo continua válido para sessões locais do Claude Code.

---

## IDENTIDADE DO PROJETO

**Projeto**: Site institucional da Bridge Tecnologia e Consultoria LTDA  
**Repositório**: `antonioneto19/bridgetech-site`  
**Stack**: HTML + CSS + JavaScript (site estático, sem build)  
**Deploy**: Vercel (integração Git — branch `main` → produção automática)  
**Domínio**: www.bridgetech.ia.br (DNS no Registro.br)  
**E-mail**: encaminhamento via ImprovMX (contato@ / antonio@ / catch-all → antonio@liderancatech.com)  
**Formulário**: Web3Forms (destino contato@bridgetech.ia.br) + fallback WhatsApp  
**Objetivo**: Presença institucional da Bridge — portfólio, serviços, contato, credibilidade para clientes e parceiros  
**Prioridade Ruflo**: 🔴 CRÍTICA (presença institucional da empresa)

> ℹ️ Documentação completa da infraestrutura: ver `README.md`.

---

## CONTEXTO DO PROPRIETÁRIO

```yaml
nome: Antonio Barbosa
empresa: Bridge Tecnologia e Consultoria LTDA
github: @antonioneto19
email: antonio@liderancatech.com
timezone: America/Fortaleza (BRT, UTC-3)
orquestrador: ruflo-workspace
```

---

## AGENTES ATIVOS NESTE REPOSITÓRIO

| Agente | Responsabilidade | Modelo | Trigger |
|--------|-----------------|--------|---------|
| **architect** | Estrutura do site, SEO técnico, performance (Core Web Vitals) | claude-opus-4 | Nova seção, mudança de layout |
| **developer** | Implementação de componentes, animações, responsividade | claude-sonnet-4 | Issues abertas, features novas |
| **reviewer** | Quality gate antes de merge: código limpo, acessibilidade, padrões | claude-sonnet-4 | Antes de todo merge em main |
| **deployer** | Pipeline Netlify, validação de build, health check pós-deploy | claude-haiku-4 | Após approval do reviewer |
| **security** | Headers HTTP (CSP, HSTS, X-Frame), LGPD compliance, XSS audit | claude-opus-4 | Cada push em main |

---

## STACK E DEPENDÊNCIAS

```yaml
frontend:
  framework: nenhum (HTML/CSS/JS estatico)
  styling: CSS puro (assets/bridge.css)
  linguagem: JavaScript (vanilla)
  assets: imagens otimizadas, fontes Google

deploy:
  plataforma: Vercel
  branch_producao: main
  ci_cd: integracao Git nativa da Vercel (auto-deploy a cada push)
  config: vercel.json (framework null, output raiz, headers de seguranca)
  
padroes:
  seo: meta tags, Open Graph, sitemap.xml
  performance: Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms)
  acessibilidade: WCAG 2.1 AA
  lgpd: política de privacidade, cookies, DPA
```

---

## PROTOCOLOS DE OPERAÇÃO

### Ao iniciar qualquer sessão neste repositório:

```bash
# 1. Verificar status do deploy mais recente
gh run list --repo antonioneto19/bridgetech-site --limit 3

# 2. Verificar issues abertas
gh issue list --repo antonioneto19/bridgetech-site --state open

# 3. Sync memória Ruflo
ruflo memory sync --backend agentdb-persistent

# 4. Verificar Lighthouse score (se possível)
# npx lighthouse <URL_PRODUCAO> --output json --quiet
```

### Antes de qualquer merge em main:
1. Reviewer agent aprova o código
2. Security agent valida headers e LGPD
3. Build local sem erros (`npm run build`)
4. Deploy Netlify preview funcional

---

## PADRÕES DE QUALIDADE

### Performance
- LCP < 2.5s em mobile
- Bundle JS < 200kb (gzipped)
- Imagens em formato WebP/AVIF com lazy loading
- Fontes com `font-display: swap`

### SEO
- Título único por página (< 60 chars)
- Meta description (< 160 chars)
- Open Graph para todas as páginas principais
- sitemap.xml atualizado a cada deploy

### LGPD / Segurança
- Banner de cookies com opt-in explícito
- Política de privacidade linkada no footer
- Nenhum dado pessoal coletado sem consentimento
- Headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security`

---

## INTEGRAÇÃO COM RUFLO WORKSPACE

```bash
# Ativar Ruflo MCP neste projeto
claude mcp add ruflo -- npx ruflo@latest mcp start

# Verificar conexão
claude mcp list

# Rodar agente específico
ruflo agent run reviewer --task "review PR changes"
ruflo agent run security --task "audit HTTP headers and LGPD compliance"
```

---

## REFERÊNCIAS

- [Ruflo Workspace](https://github.com/antonioneto19/ruflo-workspace)
- [STATUS.md](https://github.com/antonioneto19/ruflo-workspace/blob/main/STATUS.md)
- [CLAUDE.md master](https://github.com/antonioneto19/ruflo-workspace/blob/main/CLAUDE.md)
- [SECRETS-GUIDE.md](https://github.com/antonioneto19/ruflo-workspace/blob/main/SECRETS-GUIDE.md)
