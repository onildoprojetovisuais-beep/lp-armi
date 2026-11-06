// ==========================================================================
// ARMI Club — Núcleo de motion (Fundação)
// API pública (CONTRATO): window.ARMI.onReady(fn), .reduced, .lenis, .isMobile()
// Extras: ARMI.isTouch, ARMI.scrollTo(target, opts), ARMI.split(el), ARMI.refresh()
// ==========================================================================
(function () {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js'); // redundante com o script inline do <head>, por segurança

  const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = mqReduced.matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const queue = [];

  const ARMI = window.ARMI = {
    reduced,
    isTouch,
    lenis: null,
    ready: false,
    onReady(fn) { ARMI.ready ? fn(ARMI) : queue.push(fn); },
    isMobile: () => window.matchMedia('(max-width: 767px)').matches,
    scrollTo,
    split: splitLines,
    refresh: () => window.ScrollTrigger && ScrollTrigger.refresh()
  };

  const hasGSAP = () => !!(window.gsap && window.ScrollTrigger);

  // ------------------------------------------------------------------
  // Scroll suave (Lenis) — desligado em reduced-motion e em touch
  // ------------------------------------------------------------------
  function initLenis() {
    if (reduced || isTouch || !window.Lenis) return;
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    ARMI.lenis = lenis;
    if (hasGSAP()) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollTo(target, opts = {}) {
    const el = typeof target === 'string' ? (target === '#' || target === '#top' ? 0 : document.querySelector(target)) : target;
    if (el == null) return;
    const offset = opts.offset ?? 0;
    if (ARMI.lenis) { ARMI.lenis.scrollTo(el, { offset, duration: opts.duration ?? 1.4 }); return; }
    const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  // Âncoras internas (#id) com scroll suave; ignora links de CTA/WhatsApp externos
  function initAnchors() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute('href');
      if (href === '#') return;
      const el = href === '#top' ? document.body : document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollTo(href === '#top' ? 0 : el);
      if (history.replaceState) history.replaceState(null, '', href);
      if (el !== document.body) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    });
  }

  // ------------------------------------------------------------------
  // Split de linhas para [data-split] (sem plugin pago)
  // Divide em palavras (preserva &nbsp; e elementos inline como <em>/<span>),
  // agrupa pela posição vertical e envolve cada linha em .split-line > .split-inner.
  // ------------------------------------------------------------------
  const splitCache = new WeakMap();

  function splitLines(el) {
    if (!splitCache.has(el)) splitCache.set(el, el.innerHTML);
    else el.innerHTML = splitCache.get(el);
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

    // 1) envolve palavras em spans temporários
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    let pendingSpace = false;
    texts.forEach(node => {
      const parts = node.nodeValue.split(/([ \t\n\r]+)/); // NÃO quebra em &nbsp;
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (!p) return;
        if (/^[ \t\n\r]+$/.test(p)) { pendingSpace = true; return; }
        const w = document.createElement('span');
        w.className = 'split-word';
        w.style.display = 'inline-block';
        w.textContent = p;
        frag.appendChild(w);
        words.push({ el: w, space: pendingSpace && words.length > 0 });
        pendingSpace = false;
      });
      node.parentNode.replaceChild(frag, node);
    });
    if (!words.length) { el.querySelectorAll('br').forEach(br => br.remove()); return []; }

    // 2) agrupa por linha (offsetTop arredondado)
    const lines = [];
    let lastTop = null;
    words.forEach(w => {
      const top = Math.round(w.el.getBoundingClientRect().top);
      if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(w);
    });
    // <br> só sai DEPOIS de medir: assim as linhas respeitam a quebra manual
    // (remover antes fazia o texto refluir e agrupar palavras de linhas diferentes)
    el.querySelectorAll('br').forEach(br => br.remove());

    // 3) reconstrói: cada palavra mantém a cadeia de ancestrais inline (clonados raso)
    const ancestorsOf = node => {
      const chain = [];
      let p = node.parentNode;
      while (p && p !== el) { chain.unshift(p); p = p.parentNode; }
      return chain;
    };
    const out = document.createDocumentFragment();
    const inners = [];
    lines.forEach(line => {
      const lineEl = document.createElement('span');
      lineEl.className = 'split-line';
      const inner = document.createElement('span');
      inner.className = 'split-inner';
      lineEl.appendChild(inner);
      let openChain = [], openClones = [];
      line.forEach((w, i) => {
        const chain = ancestorsOf(w.el);
        let k = 0;
        while (k < chain.length && k < openChain.length && chain[k] === openChain[k]) k++;
        openChain = openChain.slice(0, k); openClones = openClones.slice(0, k);
        if (i > 0 && w.space) (openClones[k - 1] || inner).appendChild(document.createTextNode(' '));
        for (let j = k; j < chain.length; j++) {
          const c = chain[j].cloneNode(false);
          (openClones[j - 1] || inner).appendChild(c);
          openChain.push(chain[j]); openClones.push(c);
        }
        (openClones[openClones.length - 1] || inner).appendChild(document.createTextNode(w.el.textContent));
      });
      out.appendChild(lineEl);
      inners.push(inner);
    });
    el.innerHTML = '';
    el.appendChild(out);
    el.classList.add('is-split');
    return inners;
  }


  // ------------------------------------------------------------------
  // Regra do cliente: nenhuma preposição/artigo curto no fim da linha.
  // O build já cola o HTML estático; isto cobre o texto que as seções geram via JS
  // (carrosséis/dados). Mesma lista do build.mjs; CAIXA ALTA fica como no layout.
  // ------------------------------------------------------------------
  const NB = String.fromCharCode(160);
  const SHORT = 'a o e as os à às ao aos de da do das dos em no na nos nas num numa um uma com por para pra pelo pela que se ou sem seu sua seus suas'.split(' ');
  const GLUE_RE = new RegExp('(^|[\\s' + NB + '(“"—])(' + SHORT.concat(SHORT.map(w => w[0].toUpperCase() + w.slice(1))).join('|') + ')[ \\t\\r\\n]+(?=\\S)', 'g');
  const GLUE_END_RE = new RegExp(GLUE_RE.source.replace(/\(\?=.*\)$/, '$'));
  function glueShortWords(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement && n.parentElement.closest('script,style,[data-no-glue]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      // duas passadas: "de a casa" -> as duas palavras curtas coladas
      let v = n.nodeValue.replace(GLUE_RE, '$1$2' + NB).replace(GLUE_RE, '$1$2' + NB);
      // palavra curta no fim do nó seguida de elemento inline (ex.: "que <mark>dobrou</mark>")
      if (n.nextSibling && n.nextSibling.nodeType === 1 && n.nextSibling.tagName !== 'BR') v = v.replace(GLUE_END_RE, '$1$2' + NB);
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }
  ARMI.glue = glueShortWords;

  // ------------------------------------------------------------------
  // Reveals genéricos
  // ------------------------------------------------------------------
  const DUR = 1.1, EASE = 'power3.out';
  const delayOf = el => parseFloat(el.getAttribute('data-reveal-delay')) || 0;
  const markDone = el => el.classList.add('is-revealed');

  function revealElement(el) {
    const type = el.getAttribute('data-reveal') || 'fade-up';
    const delay = delayOf(el);
    const st = { trigger: el, start: 'top 88%', once: true };
    const done = () => { markDone(el); gsap.set(el, { clearProps: 'transform,opacity,clipPath' }); };
    const from = {
      'fade-up': { autoAlpha: 0, y: 28 },
      'fade': { autoAlpha: 0 },
      'scale': { autoAlpha: 0, scale: .94 },
      'mask': { clipPath: 'inset(0% 0% 100% 0%)' }
    }[type] || { autoAlpha: 0, y: 28 };
    const to = {
      'fade-up': { autoAlpha: 1, y: 0 },
      'fade': { autoAlpha: 1 },
      'scale': { autoAlpha: 1, scale: 1 },
      'mask': { clipPath: 'inset(0% 0% 0% 0%)' }
    }[type] || { autoAlpha: 1, y: 0 };
    gsap.fromTo(el, from, { ...to, duration: type === 'mask' ? 1.4 : DUR, delay, ease: type === 'mask' ? 'expo.out' : EASE, scrollTrigger: st, onStart: () => el.classList.add('is-revealing'), onComplete: done });
  }

  function revealGroup(group) {
    const kids = Array.from(group.children);
    const stagger = parseFloat(group.getAttribute('data-reveal-stagger')) || 0.09;
    gsap.fromTo(kids, { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger, delay: delayOf(group),
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      onComplete: () => { markDone(group); gsap.set(kids, { clearProps: 'transform,opacity,visibility' }); }
    });
  }

  function revealSplit(el) {
    let inners = splitLines(el);
    let played = false;
    gsap.set(inners, { yPercent: 110 });
    gsap.set(el, { autoAlpha: 1 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        played = true;
        gsap.to(inners, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.1, delay: delayOf(el), onComplete: () => markDone(el) });
      }
    });
    // refaz o split quando a largura muda (quebra de linha muda)
    let w = el.clientWidth, t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (Math.abs(el.clientWidth - w) < 2) return;
        w = el.clientWidth;
        gsap.killTweensOf(inners);
        inners = splitLines(el);
        gsap.set(inners, { yPercent: played ? 0 : 110 });
        if (played) markDone(el);
      }, 150);
    });
    ro.observe(el);
  }

  function showAllFinal() {
    document.querySelectorAll('[data-reveal], [data-reveal-group], [data-split]').forEach(markDone);
  }

  function initReveals() {
    if (reduced || !hasGSAP()) { showAllFinal(); return; }
    document.querySelectorAll('[data-split]').forEach(revealSplit);
    document.querySelectorAll('[data-reveal]').forEach(revealElement);
    document.querySelectorAll('[data-reveal-group]').forEach(revealGroup);
  }

  // ------------------------------------------------------------------
  // Links de config e refresh
  // ------------------------------------------------------------------
  function applyConfig() {
    const cfg = window.ARMI_CONFIG || {};
    document.querySelectorAll('[data-cta]').forEach(a => { if (cfg.ctaUrl) a.href = cfg.ctaUrl; if (/^https?:/.test(cfg.ctaUrl || '')) { a.target = '_blank'; a.rel = 'noopener'; } });
    document.querySelectorAll('[data-whatsapp]').forEach(a => { if (cfg.whatsappUrl) a.href = cfg.whatsappUrl; if (/^https?:/.test(cfg.whatsappUrl || '')) { a.target = '_blank'; a.rel = 'noopener'; } });
  }

  function initRefresh() {
    if (!hasGSAP()) return;
    let t;
    const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 120); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (hasGSAP()) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: EASE, duration: DUR });
      if (isTouch) ScrollTrigger.config({ ignoreMobileResize: true });
    }
    initLenis();
    if (ARMI.lenis) doc.classList.add('has-lenis');
    applyConfig();
    initAnchors();

    ARMI.ready = true;
    // Integração: os triggers são criados com a página no topo e a posição é devolvida no mesmo
    // frame (sem pintura no meio). Motivo: no ScrollTrigger 3.12.x, criar triggers com a página já
    // rolada (recarregar no meio, link com #âncora, rolar antes das fontes) faz triggers `once`
    // já ultrapassados se matarem durante o refresh interno e lança "reading 'end'"/"reading 'pin'",
    // o que trava o refresh de TODOS os triggers seguintes (reveals ficavam com opacity 0).
    const atTop = fn => {
      const y = window.scrollY;
      const jump = top => {
        window.scrollTo({ top, behavior: 'instant' });
        if (ARMI.lenis) ARMI.lenis.scrollTo(top, { immediate: true, force: true }); // mantém o estado interno do Lenis
      };
      if (y > 0 && hasGSAP()) jump(0);
      try { fn(); } finally {
        if (y > 0 && hasGSAP()) { ScrollTrigger.refresh(); jump(y); ScrollTrigger.update(); }
      }
    };
    // restauração de rolagem própria (o shell põe history.scrollRestoration = 'manual'):
    // a nativa do Chrome reaplica a posição aos poucos enquanto a página cresce, no meio da criação dos triggers
    const KEY = 'armi:scroll:' + location.pathname;
    window.addEventListener('pagehide', () => { try { sessionStorage.setItem(KEY, String(Math.round(window.scrollY))); } catch (e) { /* sem storage */ } });
    try {
      const saved = parseInt(sessionStorage.getItem(KEY), 10);
      sessionStorage.removeItem(KEY);
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      const isReturn = nav ? (nav.type === 'reload' || nav.type === 'back_forward') : false; // nova visita começa no topo
      if (isReturn && saved > 0 && !location.hash && window.scrollY === 0) window.scrollTo({ top: saved, behavior: 'instant' });
    } catch (e) { /* sem storage */ }

    atTop(() => {
      queue.splice(0).forEach(fn => { try { fn(ARMI); } catch (err) { console.error('[ARMI] erro em seção: ' + (err && err.stack || err)); } });
    });

    // reveals depois que as seções registraram seus próprios triggers;
    // split espera as fontes para medir linhas com a fonte certa
    const main = document.getElementById('main');
    if (main) { try { glueShortWords(main); } catch (err) { /* nunca bloqueia */ } }
    const go = () => atTop(() => { initReveals(); initRefresh(); });
    if (document.fonts && document.fonts.status !== 'loaded' && !reduced) {
      Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(go);
    } else go();
  });
})();
