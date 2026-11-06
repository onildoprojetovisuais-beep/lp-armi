# LP ARMI Club — Relatório de integração e QA final

Data: 2026-11-06 · Build: `node build.mjs` → `index.html` · Teste local: `python -m http.server 5110` (servidor sem cache usado no QA)
Navegador: Chromium (agent-browser), sem deploy/publicação.

## 1. O que foi corrigido na integração

| # | Problema | Correção | Arquivo |
|---|---|---|---|
| 1 | Link "Pular para o conteúdo" aparecia fixo nas capturas | Escondido com `opacity:0 + clip-path` (não depende de `transform`, que capturas de página inteira ignoram); aparece só com foco do teclado (testado com Tab: `opacity 1`) | `css/base.css` |
| 2 | `ARMI.split` agrupava errado títulos com `<br>` | Os `<br>` agora só saem **depois** de medir as linhas (antes, removê-los fazia o texto refluir e misturar linhas). Conferidos todos os `data-split` (Nosso propósito, Jornada) em desktop e mobile | `js/core.js` |
| 3 | Erro "reading 'pin'/'end'" travava ScrollTriggers seguintes (reveals ficavam com opacity 0) | Causa raiz encontrada: no ScrollTrigger 3.12.x, criar triggers com a página **já rolada** (recarregar no meio, link com #âncora, rolar antes das fontes) faz triggers `once` já ultrapassados se matarem durante o refresh interno, lançando o erro e deixando o refresh travado para todos os triggers seguintes. Correção no core: os triggers das seções e os reveals são criados com a página no topo e a posição é devolvida no mesmo frame (`atTop`), + restauração de rolagem própria só em recarregar/voltar (`history.scrollRestoration='manual'`), porque a nativa do Chrome reaplicava a posição aos poucos no meio da criação dos triggers. Também testado com GSAP 3.13 (mesmo bug) — mantida a 3.12.5 do contrato | `js/core.js`, `src/shell.html` |
| 4 | Palavras curtas/preposições no fim de linha (regra do cliente) | (a) `build.mjs` cola artigos/preposições curtos à palavra seguinte com espaço inseparável em todo o HTML das seções (só minúsculas/inicial maiúscula; CAIXA ALTA fica como no layout); (b) o core faz o mesmo no texto gerado por JS (carrosséis), inclusive antes de `<mark>`; (c) quebras manuais (`<br>`) reescritas onde terminavam em preposição: Pilares (Direção, Aceleração, Aliança), Como funciona (4 etapas), título dos Depoimentos ("O ARMI CLUB é / um ambiente de crescimento."), Jornada ("CONSTRUÇÃO / DA INFLUÊNCIA", "ESTEIRA / DE PRODUTOS"), descrições de Mateus Nogueira e Karina Pantaleo | `build.mjs`, `js/core.js`, `src/sections/03,05,08,09,10`, `js/sections/05-mentorados.js` |
| 5 | Rolagem horizontal de 5–6 px no mobile durante a entrada da foto dos fundadores (`scale 1.08`) | `main { overflow-x: clip }` (não cria contêiner de rolagem; sticky/pin continuam funcionando) | `css/base.css` |
| 6 | Título "Como funciona o ARMI Club" com peso 400/estilo normal (fora do padrão dos demais títulos) | `font-weight:300; font-style:italic` como os outros títulos Ivy Light | `css/sections/09-como-funciona.css` |
| 7 | Erros de seção sem pilha legível no console | `console.error` do core passa a mostrar a pilha completa | `js/core.js` |
| 8 | Peso de imagens | 29 fotos do carrossel de mentorados (PNG 301×430, ~175 KB cada, **5,1 MB**) → WebP em `assets/img/opt/mentorados/` (**356 KB** no total); avatares do hero PNG → WebP (`assets/img/opt/`); originais preservados | `js/sections/05-mentorados.js`, `src/sections/01-hero.html` |
| 9 | Arte do hero com `alt=""` | `alt="Adriana Sant’Anna e Rodrigão, fundadores do ARMI Club"` | `src/sections/01-hero.html` |
| 10 | Rodapé com faixa mais clara "colando" na dobra final | Degradê do rodapé começa no azul-noite da página (sem degrau) | `css/sections/11-final.css` |

### Troca da imagem da seção 11 (pedido extra do usuário)
- Sai a cena do lobby (`final-lobby*.webp` / `dobra-final.png`, arquivos mantidos no disco) e entra a **foto do grupo no palco** (`assets/img/Armi Club-01053.jpg`, original intacto — na verdade 6596×4397).
- Geradas `assets/img/extraido/final-grupo.webp` (1920×1280, 286 KB) e `final-grupo-960.webp` (960×768, 135 KB — recorte 5:4 já centrado no casal, para o mobile), servidas por `<picture>`.
- Desktop: a foto ocupa a largura toda; o bloco "Precisa de AJUDA?" + WhatsApp fica na faixa do piso/tapete, avançando para o fundo azul-noite abaixo da foto. Degradê azul-noite (`var(--c-bg)`) de baixo + vinheta leve nas bordas + leve sombra radial atrás do texto; casal e grupo ficam livres acima do bloco em 1920/1440/1024.
- Mobile: foto 5:4 com `object-position` no casal; bloco de ajuda abaixo da foto.
- Motion mantido (zoom-out lento + parallax). O reflexo que varria o logo foi **removido** (não há mais logo); ficou só um brilho dourado suave "respirando" sobre o brasão ao fundo. Faixa dourada no topo mantida.
- **Não** recriei o logo ARMI nem "Resultados com consistência": a composição não ficou vazia (o brasão e o grupo preenchem a cena).
- Alt: "Membros do ARMI Club reunidos no palco do evento presencial, acenando, com Adriana Sant’Anna e Rodrigão sentados no centro e o brasão do clube ao fundo".
- Capturas: `_ref/qa/final/final-grupo-desktop.png`, `_ref/qa/final/final-grupo-mobile.png`.

## 2. Junções entre seções (conferidas no render)
- **02 → 03**: barra de números (+15 anos / +12 milhões / +250 mil) sobre o topo da 03 sem colidir com "Os pilares do ARMI" (folga ≈ 80 px em 1440; idem 1920/1366/1024/mobile).
- **04 → 05**: card de vidro ARMI CLUB sobre a faixa oliva/escura; a faixa com margem negativa casa com o degradê do topo da 05, sem fresta nem fundo duplicado.
- **08 (cinza) → 09**: corte limpo, sem fresta.
- **09 → 10**: linha dourada de 1 px no fim da 09, sem duplicar.
- **10 → faixa dourada → 11**: faixa dourada contínua, sem fresta.

## 3. Resultado por tamanho de tela

| Tela | Botão hero (base) | 1 h1 | Rol. horizontal | Console | CLS carga | Altura pág. | Ocultos ao fim | Palavra curta no fim de linha |
|---|---|---|---|---|---|---|---|---|
| 1920×1080 | ✅ 866 px / 1080 | ✅ | nenhuma | limpo | 0 | 15 712 | só intencionais | nenhuma ¹ |
| 1440×900 | ✅ 649 / 900 | ✅ | nenhuma | limpo | 0 | 11 966 | só intencionais | nenhuma ¹ |
| 1366×768 | ✅ 616 / 768 | ✅ | nenhuma | limpo | 0 | 11 392 | só intencionais | nenhuma ¹ |
| 1024×768 | ✅ 472 / 768 | ✅ | nenhuma | limpo | 0 | 11 497 | só intencionais | nenhuma ¹ |
| 768×1024 | ✅ 1000 / 1024 | ✅ | nenhuma | limpo | 0 | 14 030 | só intencionais | nenhuma ¹ |
| 390×844 | ✅ 669 / 844 | ✅ | nenhuma | limpo | 0 | 16 139 | só intencionais | nenhuma ¹ |
| 360×740 | ✅ 621 / 740 | ✅ | nenhuma | limpo | 0 | 15 673 | só intencionais | nenhuma ¹ |

¹ Verificação automática no render (todas as linhas de h1–h3, p, li, blockquote). Ficam só casos aceitos de propósito: o rótulo "de seguidores / somados" da barra de números (quebra do layout, rótulo curto), "HOTSEAT + / ACELERAÇÃO / ESTRUTURAL" (título em caixa alta do layout) e "Criação do seu / programa high ticket" na etapa 3 do infográfico desktop ("seu" não é preposição). Em 1024 o detector aponta "direcionamentos e," — a vírgula colada ao "e" é do texto original do depoimento.

Legenda: "Botão hero" = `QUERO APLICAR` do hero inteiro visível sem rolar. "Ocultos ao fim" = elementos com opacity 0 depois de rolar até o rodapé (todos intencionais: cards do carrossel de mentorados fora da janela, tooltip "em breve" do confessionário, halos/pinos do infográfico 09 que só aparecem em hover/foco). Rolagem horizontal: nenhuma (scrollWidth = clientWidth em todos).

Testes extras:
- **Redimensionar 1440 → 390 ao vivo** (no meio da página): sem erros, sem rolagem horizontal, títulos `data-split` refeitos, reveals completos.
- **Recarregar no meio da página** (y = 4000, 9000 e no fim) em 1440 e 390: posição mantida, 0 triggers travados, 0 elementos ocultos na tela, console limpo. Abrir com `#jornada` também ok.
- **Touch emulado** (matchMedia hover:none / pointer:coarse, sem Lenis) em 390/360/768: console limpo, todos os reveals disparam.
- **prefers-reduced-motion** emulado: `ARMI.reduced = true`, 0 ScrollTriggers, 0 tweens ativos, tudo visível e estático sem rolar (inclusive os textos do infográfico 09). Captura: `_ref/qa/final/reduced-motion-1440.png` (as imagens lazy aparecem vazias só porque a captura de página inteira não rola).
- **Teclado**: skip-link aparece no 1º Tab; foco visível global (`:focus-visible` dourado); carrosséis de mentorados, confessionário e depoimentos com botões anterior/próximo rotulados e navegação por setas; clones do loop com `aria-hidden` e `tabindex=-1`; etapas do 09 são `<button>` com `aria-expanded`/`aria-labelledby`.
- **Headings**: um único `h1` (hero); h2 por seção; h3 nos itens. Hierarquia ok.
- **CTA**: os 3 botões QUERO APLICAR (hero, pilares, jornada) são `.btn-gold[data-cta]`; o do hero fica um pouco menor em telas baixas por escalar com a altura da dobra (para caber na primeira dobra).
- **Escala de títulos**: conferida contra o PDF (tamanhos em 1920: propósito/pilares 84,7; mentorados/experiência/confessionário/como funciona 69,1; depoimentos 74,4; jornada 80; ajuda 60,5) — as diferenças entre seções são do próprio layout e estão proporcionais.

## 4. Pesos (transferido, servidor local sem cache e sem compressão)

| Cenário | Requisições | Total | Imagens | Fontes | CSS | JS | HTML |
|---|---|---|---|---|---|---|---|
| 1440×900 — carga inicial | 52 | **931 KB** | 474 KB | 136 KB | 111 KB | 132 KB | 79 KB |
| 1440×900 — após rolar até o rodapé | 96 | **2,16 MB** | 1,71 MB | 136 KB | 111 KB | 132 KB | 79 KB |
| 390×844 — carga inicial | 50 | **937 KB** | 480 KB | 136 KB | 111 KB | 132 KB | 79 KB |
| 390×844 — após rolar até o rodapé | 96 | **1,89 MB** | 1,44 MB | 136 KB | 111 KB | 132 KB | 79 KB |

Valores sem gzip/brotli (servidor local); na Vercel CSS/JS/HTML caem para ~¼. Antes da conversão dos mentorados, rolar a página inteira custava ~4,8 MB a mais só no carrossel.

## 5. Performance / imagens
- `fetchpriority="high"` na arte do hero e no logo; sem `loading="lazy"` na primeira dobra.
- Todas as imagens fora da primeira dobra com `loading="lazy"` + `decoding="async"`; todas as `<img>` com `width`/`height` (0 faltando, inclusive as geradas por JS).
- CLS medido na carga (PerformanceObserver): **0** em todos os 7 tamanhos (nenhum deslocamento de layout na carga).
- `vercel.json` mínimo: cache de 1 ano (`immutable`) para `assets/fonts/*` e `assets/img/*`, 1 h para css/js. **Atenção**: ao trocar uma imagem/fonte, use nome novo (o cache é imutável). `.vercelignore` exclui `_ref`, `layout`, `src`, `qa`, `build.mjs`, `CONTRATO.md` do deploy.
- `.gitignore` criado (`node_modules/`, `.vercel/`).
- og:image agora aponta para `assets/img/opt/og-armi.jpg` (1200×630, captura do hero); precisa de URL absoluta quando houver domínio.

## 6. Limpeza
- Apagadas: `_ref/qa/t1024.png`, `_ref/qa/t800.png`, `_ref/qa/pilares-fundadores-*.png`.
- Encerrados os servidores estáticos deixados pelos agentes nas portas 5101, 5102, 5104, 5105, 5107 (`python -m http.server`) e 5103, 5106 (`npx serve`) — todos conferidos antes como servidores desta pasta. O servidor de QA da porta 5110 também foi encerrado ao final.
- Nada foi publicado nem implantado.

## 7. Pendências do cliente (lista consolidada)
1. **Links em `js/config.js`**: `ctaUrl` (formulário de aplicação — hoje `#aplicar`), `whatsappUrl` (hoje `#whatsapp`), `heroVideoUrl` (vídeo do hero), `confessionarioVideos` (3 vídeos), `siteUrl`.
2. **Textos reais do confessionário**: os 3 cards usam o placeholder do layout ("Participante / Especialização / trecho marcante do depoimento…").
3. **Fotos nítidas de Rafael Wollmann e Andressa Rada** (o PDF só traz versões desfocadas; hoje entram sem foto).
4. **Adriana Ricci e Gabriela Karasek com a mesma descrição** ("Empresária e Fundadora do Grupo SHS Assessoria BTG") — confirmar.
5. **Grafia Gotschall × gottschall**: nome "Cristiane Gotschall", @ "@dracrisgottschall" — confirmar.
6. **Autorização de uso dos prints de depoimentos** (seção 08, reproduzidos como texto).
7. **Licença web das fontes Ivy Presto Display e Ivy Presto Text Regular** — sem a Text Regular, as linhas em caixa alta espaçada usam Cormorant Garamond como substituta.
8. **Ano do copyright**: está "© Copyright 2025" (como no layout) — confirmar se vira 2026.
9. **Domínio final** para `og:image`/`twitter:image` absolutos (hoje caminho relativo, que redes sociais não leem).
10. **Foto da dobra final**: confirmar a troca (lobby → grupo no palco) e se o logo ARMI / "Resultados com consistência" devem voltar como elemento separado.

## 8. Capturas (`_ref/qa/final/`)
`full-1440.png`, `full-390.png` (páginas inteiras, montadas por rolagem real), `fold-1920.png`, `fold-1440.png`, `fold-1366.png`, `fold-1024.png`, `fold-768.png`, `fold-390.png`, `fold-360.png` (primeiras dobras), `final-grupo-desktop.png`, `final-grupo-mobile.png`, `reduced-motion-1440.png`.
