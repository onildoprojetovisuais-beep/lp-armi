# CONTRATO — LP ARMI Club (trabalho paralelo)

Página de vendas **alto padrão**, fiel ao layout aprovado + motion. HTML/CSS/JS estático, GSAP 3.12.5 + ScrollTrigger + Lenis via CDN (já no `src/shell.html`). Sem framework, sem npm install obrigatório.

## Fontes da verdade
- Layout: `layout/ARMI - Desktop 30.10.26.pdf` (1920 de largura, 1 página longa) e `layout/ARMI - mobile 30.10.26.pdf` (375 de largura).
- Renders prontos: `_ref/desktop-p1-full.png` (1000px de largura = escala 0,52 do original) e fatias `_ref/desk-slice-01..08.png`; mobile `_ref/mobile-p1-full.png` (500px = escala 1,33) e `_ref/mob-slice-01..11.png`.
- Textos extraídos: `_ref/TEXTOS-desktop.txt` e `_ref/TEXTOS-mobile.txt`. **Copiar textos literalmente** (manter acentos; corrigir só erro de digitação óbvio e registrar no relatório).
- Para medir com precisão, re-renderize o recorte que precisa com PyMuPDF (`python -I`, `fitz`, clip + zoom alto). Para imagens que faltam em `assets/` (thumb do vídeo do hero, thumbs do confessionário, ícones), extraia as imagens embutidas do PDF (`page.get_images` / `doc.extract_image`) para `assets/img/extraido/<sua-secao>-*.png`. Nunca grave fora da sua pasta de prefixo.

## Estrutura e propriedade de arquivos (NÃO edite arquivos de outra seção)
```
src/shell.html            -> Fundação
css/tokens.css, base.css  -> Fundação (variáveis de tokens.css são contrato: pode mudar valores, não nomes)
js/core.js, js/config.js  -> Fundação (API window.ARMI é contrato)
build.mjs                 -> não mexer
src/sections/NN-nome.html -> agente da seção
css/sections/NN-nome.css  -> agente da seção
js/sections/NN-nome.js    -> agente da seção (opcional)
```
Ordem das seções (prefixo):
01-hero · 02-proposito (inclui barra de números +15 anos/+12 milhões/+250 mil) · 03-pilares · 04-fundadores (inclui card de vidro "ARMI CLUB") · 05-mentorados · 06-experiencia (galeria + card próximo evento) · 07-confessionario · 08-depoimentos · 09-como-funciona (infográfico SVG) · 10-jornada (7 cards + CTA) · 11-final (dobra final, WhatsApp, rodapé)

`node build.mjs` gera `index.html` (nunca edite `index.html` à mão). Teste servindo a pasta (`npx serve -l <sua porta>` ou `python -m http.server <porta>`), na porta indicada no seu briefing.

## Convenções
- Raiz: `<section class="s-<nome>" id="<nome>">`. **Todo seletor CSS prefixado com `.s-<nome>`**. Nada de estilos globais em arquivos de seção.
- Usar `var(--...)` de `css/tokens.css` para cor, fonte, raio, easing. Utilitários globais (`.container`, `.btn-gold`, `.reveal` etc.) quem define é a Fundação em `base.css` — documentados abaixo. Se precisar antes de existir, crie a sua versão prefixada.
- Breakpoint: mobile ≤ 767px (layout do PDF mobile), desktop ≥ 1024px (PDF desktop), tablet intermediário coerente. Desktop: conteúdo centrado em `--container` como no PDF (o PDF de 1920 tem a coluna útil de ~1280–1330px, ver proporções).
- CTAs "QUERO APLICAR": `<a class="btn-gold" data-cta href="#aplicar">QUERO APLICAR</a>`. WhatsApp: `data-whatsapp`. Links reais ficam em `js/config.js`.
- Imagens: `<img>` com `width`/`height`, `alt` em português, `loading="lazy"` (exceto hero), `decoding="async"`. Use `<picture>` com fonte mobile quando existir `*-mobile.png`. Paths relativos `assets/img/...`.
- Motion: JS de seção dentro de IIFE, começando com `ARMI.onReady(({ reduced }) => { ... })`. Se `reduced`, mostrar estado final sem animação. Conteúdo **visível sem JS** (estado inicial escondido só via classe `.js` no `<html>` posta pelo core, ou via `gsap.from`). Animar só `transform`/`opacity`/`clip-path`/`filter` leve. Nada de layout shift. ScrollTrigger com `once`/scrub conforme o caso; nunca pin que quebre no mobile.
- Tom de motion: luxo, contido, lento-elegante (ease `--ease-out` / `power3.out`/`expo.out`, 0,9–1,4s, stagger 0,06–0,12). Reveals por máscara de linha nos títulos serifados, fade-up curto no corpo, parallax sutil em fotos, brilho dourado varrendo nos botões no hover. Nada de bounce/elastic.
- Regras do usuário: botão do hero visível na primeira dobra sem rolar (desktop e mobile); **nunca palavra órfã/preposição sozinha no fim da linha** — use `text-wrap: balance`/`pretty` e `&nbsp;` onde necessário e confira no render.
- Acessibilidade: contraste AA, foco visível, carrosséis operáveis por teclado e com `aria-label`, `prefers-reduced-motion` respeitado.

## Skills obrigatórias (invoque com a ferramenta Skill antes de codar)
`frontend-design`, `ui-ux-pro-max`, `gsap-scrolltrigger:gsap-scrolltrigger`. Para verificação visual: `agent-browser` (screenshots em 1440×900 e 390×844, compare com as fatias de `_ref/`).

## Entrega de cada agente
Relatório curto: arquivos criados, desvios do layout e motivo, pendências (mídias/links/textos ausentes), screenshots salvos em `_ref/qa/<secao>-desktop.png` e `-mobile.png`.

## Utilitários disponíveis (Fundação)

**Fontes** (WOFF2 em `assets/fonts/`, já com @font-face em `tokens.css`). Os arquivos Ivy Presto são **itálicos verdadeiros** (italicAngle −12°), declarados com `font-style: italic` — nunca use itálico sintético nem `transform: skew`.
- `var(--f-display)` → Ivy Presto Display, **sempre itálico**. `font-weight: 300` = Light Italic (quase todos os títulos: hero, "Nosso propósito", "Os negócios começam…", "Como funciona…", nomes de mentorados). `font-weight: 700` = Bold Italic ("Os pilares do ARMI", "Direção", "+15 anos", frase "Juntos, construímos…" se quiser peso).
- `var(--f-serif)` → Ivy Presto Text **Bold romano** (único romano Ivy disponível).
- `var(--f-eyebrow)` → Cormorant Garamond 500 (substituto do Ivy Text Regular para caixa alta espaçada e rótulos serifados romanos tipo "ENCONTROS PRESENCIAIS").
- `var(--f-sans)` → Satoshi 300/400/500/700/900 (+400 itálico). Satoshi não tem `º`/`ª` (cai no fallback do sistema).
- Ivy não tem `→`: use Satoshi para setas.

**Cores**: `--c-bg #080f18` (azul-noite), `--c-bg-deep #05060a` (dobra final), `--c-bg-2`, `--c-surface`, `--c-surface-glass`, `--c-light #d8d8d8` (propósito), `--c-light-2 #e6e6e6` (depoimentos), `--c-white` (fundadores), `--c-ink #080f18` (texto em dobra clara), `--c-ink-dim`, `--c-text`, `--c-text-dim`, `--c-gold #cfbd90` (títulos dourados — chapado no PDF), `--c-gold-deep #977535`, `--c-gold-soft`, `--c-line`, `--c-line-gold`, `--c-glow`. Degradês: `--g-gold` (botão), `--g-gold-text` (texto), `--g-gold-line` (linha que some nas pontas).

**Escala fluida** (375→1920, medida no PDF): `--fs-display` 41→75 · `--fs-h2` 44→69 · `--fs-h2-lg` 45→85 · `--fs-h3` 30→50 · `--fs-lead` 17,5→33 · `--fs-body` 16→25 · `--fs-small` 14→20 · `--fs-eyebrow` 17→24 · `--fs-btn`. Entrelinhas `--lh-tight` 1.18, `--lh-snug` 1.3, `--lh-body` 1.5; `--ls-eyebrow` .32em.
**Espaço**: `--space-section` 64→150 (padding vertical da dobra) · `--space-block` 32→72 (título→conteúdo) · `--space-stack` 16→28 · `--space-xs/sm/md/lg/xl`. **Layout**: `--container` 1280px, `--container-narrow` 860px, `--gutter`. Outros: `--btn-h`, `--btn-px`, `--shadow-card`, `--shadow-gold`, `--dur-fast/--dur/--dur-slow`, `--z-*`.

**Classes (base.css)**
- `.container` / `.container--narrow` — `<div class="container">…</div>`
- `.section-pad` — padding vertical padrão: `<section class="s-pilares section-pad" id="pilares">`
- `.on-light` — texto `--c-ink` para dobra clara.
- `.title-serif` (+ `.title-serif--bold`) — `<h2 class="title-serif title-gold fs-h2">Os negócios começam…</h2>`
- `.title-gold` (cor chapada) / `.title-gold title-gold--grad` (degradê no texto)
- `.fs-display .fs-h2 .fs-h2-lg .fs-h3 .fs-lead .fs-body .fs-small` — atalhos de tamanho.
- `.eyebrow` — `<p class="eyebrow">Experiência presencial ARMI Club</p>` (caixa alta e tracking automáticos, compensa o tracking final para centralizar).
- `.btn-gold` (+ `.btn-gold--block` p/ largura total) — `<a class="btn-gold" data-cta href="#aplicar">QUERO APLICAR</a>` (degradê, brilho no hover, lift, foco visível, min 44px).
- `.rule-gold` — `<hr class="rule-gold">` linha dourada 1px.
- `.sr-only`, `.skip-link` (já no shell).

**Atributos de motion (core.js — não precisa de JS na seção)**
- `data-reveal="fade-up|fade|scale|mask"` + opcional `data-reveal-delay="0.2"` — `<p data-reveal="fade-up" data-reveal-delay=".15">…</p>`
- `data-reveal-group` (+ opcional `data-reveal-stagger=".1"`) — filhos diretos entram em sequência: `<ul data-reveal-group>…</ul>`
- `data-split` — título revelado linha a linha por máscara (split por palavras agrupadas por linha, refeito no resize, preserva `&nbsp;`/`<em>`/`<span>`): `<h2 class="title-serif" data-split>…</h2>`. Não combine `data-split` com `data-reveal` no mesmo elemento.
- Todos ficam visíveis sem JS e em reduced-motion; recebem `.is-revealed` ao terminar. Esconder estado inicial só sob `html.js`.

**API JS (`window.ARMI`)**: `onReady(fn)`, `reduced`, `isTouch`, `lenis` (null em touch/reduced), `isMobile()`, `scrollTo(alvo, {offset, duration})`, `split(el)` (retorna as `.split-inner` para animar você mesmo), `refresh()` (= `ScrollTrigger.refresh()`). Âncoras `href="#id"` já rolam suave via Lenis. `ScrollTrigger.refresh()` automático após `load` e `document.fonts.ready`.
