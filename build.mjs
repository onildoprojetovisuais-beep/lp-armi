// Monta index.html a partir de src/shell.html + src/sections/*.html (ordem pelo prefixo NN-)
// e injeta automaticamente css/sections/*.css e js/sections/*.js. Uso: node build.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
const ls = (d, ext) => existsSync(d) ? readdirSync(d).filter(f => f.endsWith(ext)).sort() : [];

// Regra do cliente: nenhuma preposição/artigo curto sozinho no fim da linha.
// Cola a palavra curta à seguinte com espaço inseparável (NBSP, código 160) — só em nós de texto,
// fora de <script>/<style>/atributos, e só em minúsculas ou inicial maiúscula (títulos em CAIXA ALTA ficam como no layout).
const NBSP = String.fromCharCode(160);
const SHORT = 'a o e as os à às ao aos de da do das dos em no na nos nas num numa um uma com por para pra pelo pela que se ou sem seu sua seus suas'.split(' ');
const WORDS = [...SHORT, ...SHORT.map(w => w[0].toUpperCase() + w.slice(1))];
const GLUE = new RegExp('(?<=^|[\\s' + NBSP + '(“"—])(' + WORDS.join('|') + ')[ \\t\\r\\n]+(?=[^\\s<])', 'g');
function glue(html) {
  let inRaw = false;
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith('<')) {
      if (/^<(script|style)\b/i.test(part)) inRaw = true;
      else if (/^<\/(script|style)/i.test(part)) inRaw = false;
      return part;
    }
    return inRaw ? part : part.replace(GLUE, '$1' + NBSP);
  }).join('');
}

const shell = readFileSync('src/shell.html', 'utf8');
const sections = ls('src/sections', '.html').map(f => `<!-- ${f} -->\n` + glue(readFileSync(`src/sections/${f}`, 'utf8'))).join('\n');
const css = ls('css/sections', '.css').map(f => `<link rel="stylesheet" href="css/sections/${f}">`).join('\n  ');
const js = ls('js/sections', '.js').map(f => `<script defer src="js/sections/${f}"></script>`).join('\n  ');
writeFileSync('index.html', shell.replace('<!-- SECTION_CSS -->', css).replace('<!-- SECTIONS -->', sections).replace('<!-- SECTION_JS -->', js));
console.log('index.html ok —', ls('src/sections', '.html').length, 'seções');
