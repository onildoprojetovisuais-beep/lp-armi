// 05 — Carrossel "Conheça quem já faz parte do ARMI"
// ---------------------------------------------------------------------------
// PARA O CLIENTE: edite a lista MENTORADOS abaixo. Cada membro:
//   nome       -> nome exibido em dourado
//   instagram  -> @ do perfil
//   descricao  -> texto do card ("\n" força quebra de linha)
//   foto       -> caminho da foto (retrato 301×430 ou maior, mesma proporção)
// Membros com foto vazia ('') ficam guardados mas NÃO aparecem até a foto chegar.
// As fotos "Mask Group" já vêm com nome/@/descrição impressos na imagem; o card
// cobre essa área com o degradê e escreve o texto abaixo (fonte única para tudo).
// ---------------------------------------------------------------------------
window.MENTORADOS = [
  // --- 6 membros do layout (PDF) ---
  { nome: 'Rafael Wollmann', instagram: '@rafael.wollmann', descricao: 'Executivo C-level e PhD em Engenharia Industrial e de Sistemas. Especialista em estratégia, finanças e excelência operacional', foto: '' /* PENDENTE: o PDF só traz esta foto desfocada */ },
  { nome: 'Camila Borges', instagram: '@dracamilaborgeshof', descricao: 'Especialista em pele e harmonização e criadora do Método Código da Beleza®', foto: 'assets/img/extraido/mentorados-camila-borges.webp' },
  { nome: 'Mateus Nogueira', instagram: '@mateusnogueiraof', descricao: 'Executivo\nda @colombonorthamerica', foto: 'assets/img/extraido/mentorados-mateus-nogueira.webp' },
  { nome: 'Karina Pantaleo', instagram: '@karinapantaleo', descricao: 'Empresária e Sócia\nda Imobiliária Predial São José.', foto: 'assets/img/extraido/mentorados-karina-pantaleo.webp' },
  { nome: 'José Neder', instagram: '@drnedernetto', descricao: 'Cirurgia e Direito Médico', foto: 'assets/img/extraido/mentorados-jose-neder.webp' },
  { nome: 'Andressa Rada', instagram: '@draandressarada', descricao: 'Especialista em Rejuvenescimento Facial e criadora do Método RADA®.', foto: '' /* PENDENTE: o PDF só traz esta foto desfocada */ },

  // --- Fotos do cliente (assets/img/fotos-carrossel-mentorados) — dados transcritos da própria imagem ---
  { nome: 'Stheftanie Bittencourt', instagram: '@sthef_nutri', descricao: 'Nutricionista e Mentora Seca Com a Nutri', foto: 'assets/img/opt/mentorados/mask-group.webp' },
  { nome: 'Fernando Ferreira', instagram: '@fernandoconsultoriofinanceiro', descricao: 'Planejador financeiro e Fundador do Meu Consultório Financeiro e ARK Business Club', foto: 'assets/img/opt/mentorados/mask-group-1.webp' },
  { nome: 'Cátia Belletti', instagram: '@catiabelletti', descricao: 'Sócia Meu Consultório Financeiro', foto: 'assets/img/opt/mentorados/mask-group-2.webp' },
  { nome: 'Zhara Pimentel', instagram: '@zharapimentel', descricao: 'Co-fundadora do GL Club e Médica Nefrologista', foto: 'assets/img/opt/mentorados/mask-group-3.webp' },
  { nome: 'Gustavo Pimpão', instagram: '@drgustavopimpao', descricao: 'Cirurgião-dentista e Sócio Fundador do GP Treinamentos', foto: 'assets/img/opt/mentorados/mask-group-4.webp' },
  { nome: 'Gabrielle Matuoka', instagram: '@nutrigabe', descricao: 'Nutricionista Funcional', foto: 'assets/img/opt/mentorados/mask-group-5.webp' },
  { nome: 'Nicolle Liessi', instagram: '@nicolle_liessi', descricao: 'Escritora e Fundadora da Mentoria Mulheres Reais', foto: 'assets/img/opt/mentorados/mask-group-6.webp' },
  { nome: 'Géssica Thomas', instagram: '@dra.gessicathomas', descricao: 'Especialista em Harmonização Orofacial e Fundadora GT Aesthetic', foto: 'assets/img/opt/mentorados/mask-group-7.webp' },
  { nome: 'Ofli Guimarães', instagram: '@ofli.cg', descricao: 'Empreendedor e Sócio Fundador da Allycar, Méliuz, or3 grupo, Trintaeum e Five Founders', foto: 'assets/img/opt/mentorados/mask-group-8.webp' },
  { nome: 'Renata Guimarães', instagram: '@allycar.orlando', descricao: 'Co-fundadora Ally Car', foto: 'assets/img/opt/mentorados/mask-group-9.webp' },
  { nome: 'Gustavo Vilela', instagram: '@dr.gustavovilela', descricao: 'Cirurgião Plástico', foto: 'assets/img/opt/mentorados/mask-group-10.webp' },
  { nome: 'Andrezza Ibrahim', instagram: '@andrezzaibrahim', descricao: 'Founder B.Life Estética', foto: 'assets/img/opt/mentorados/mask-group-11.webp' },
  { nome: 'Maria Scarabelli', instagram: '@mariaascarabelli', descricao: 'Sócia Scarabelli Motors', foto: 'assets/img/opt/mentorados/mask-group-12.webp' },
  { nome: 'José Scarabelli', instagram: '@scarabellioficial', descricao: 'Sócio Scarabelli Motors', foto: 'assets/img/opt/mentorados/mask-group-13.webp' },
  { nome: 'Luciana Brito', instagram: '@luciana.britog', descricao: 'Sócia Fundadora 4Beach Gym', foto: 'assets/img/opt/mentorados/mask-group-14.webp' },
  { nome: 'Karina Aparicio', instagram: '@ka.aparicio', descricao: 'Sócia Fundadora Zark Mortgage', foto: 'assets/img/opt/mentorados/mask-group-15.webp' },
  { nome: 'Alessandre Aparicio', instagram: '@alessandre_aparici', descricao: 'Sócio Fundador Zark Mortgage', foto: 'assets/img/opt/mentorados/mask-group-16.webp' },
  { nome: 'Renato Tatagiba', instagram: '@dr.renatotatagiba_oficial', descricao: 'Cirurgião Plástico', foto: 'assets/img/opt/mentorados/mask-group-17.webp' },
  { nome: 'Cristiane Gotschall', instagram: '@dracrisgottschall', descricao: 'Médica Nutróloga', foto: 'assets/img/opt/mentorados/mask-group-18.webp' },
  { nome: 'Karla Assed', instagram: '@karlaassed', descricao: 'Dermatologista Fundadora Grupo Karla Assed', foto: 'assets/img/opt/mentorados/mask-group-19.webp' },
  { nome: 'Evandro Elias', instagram: '@oevandroelias', descricao: 'CEO e Founder LeCapital', foto: 'assets/img/opt/mentorados/mask-group-20.webp' },
  { nome: 'Guilherme Bortolon', instagram: '@guilherme.bortolon', descricao: 'Cirurgião Vascular', foto: 'assets/img/opt/mentorados/mask-group-21.webp' },
  { nome: 'Adel Bark Júnior', instagram: '@dr.adelbarkjr', descricao: 'Cirurgião Plástico Criador do Conceito Multiplanos™', foto: 'assets/img/opt/mentorados/mask-group-22.webp' },
  { nome: 'Heloisa Ciarini', instagram: '@helociarini', descricao: 'Fundadora Rede Rident', foto: 'assets/img/opt/mentorados/mask-group-23.webp' },
  { nome: 'Tábata Maia', instagram: '@aguamineral.scherr', descricao: 'CEO Água Mineral Scherr', foto: 'assets/img/opt/mentorados/mask-group-24.webp' },
  { nome: 'Adriana Ricci', instagram: '@dricaricci', descricao: 'Empresária e Fundadora do Grupo SHS Assessoria BTG', foto: 'assets/img/opt/mentorados/mask-group-25.webp' },
  { nome: 'Pedro Sousa', instagram: '@opedrosousaoficial', descricao: 'Expert em Importação e CEO Sousa importação', foto: 'assets/img/opt/mentorados/mask-group-26.webp' },
  { nome: 'Amanda Sá Freitas', instagram: '@amandasafreitass', descricao: 'Especialista em comportamento humano e saúde mental Integrativa', foto: 'assets/img/opt/mentorados/mask-group-27.webp' },
  { nome: 'Gabriela Karasek', instagram: '@gabrielakarasek', descricao: 'Empresária e Fundadora do Grupo SHS Assessoria BTG', foto: 'assets/img/opt/mentorados/mask-group-28.webp' }
];

(function () {
  'use strict';
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-mentorados');
    if (!root) return;
    const stage = root.querySelector('.s-mentorados__stage');
    const track = root.querySelector('.s-mentorados__track');
    const btnPrev = root.querySelector('.s-mentorados__arrow--prev');
    const btnNext = root.querySelector('.s-mentorados__arrow--next');
    const dotsBox = root.querySelector('.s-mentorados__dots');
    const status = root.querySelector('.s-mentorados__status');
    // título: reveal por máscara de linha
    if (!reduced && window.gsap && window.ScrollTrigger) {
      const lines = root.querySelectorAll('.s-mentorados__line > span');
      gsap.set(lines, { yPercent: 115 });
      ScrollTrigger.create({ trigger: root.querySelector('.s-mentorados__title'), start: 'top 88%', once: true,
        onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: .1 }) });
    }
    const items = (window.MENTORADOS || []).filter(m => m && m.foto);
    if (items.length < 2) return;

    // ---------- Render ----------
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    // evita palavra curta sozinha no fim da linha: une conectivos à palavra seguinte
    const glue = s => esc(s).replace(/(^|\s)(e|a|o|da|de|do|das|dos|em|no|na|com|para|por|ao|à)\s+/gi, '$1$2 ').replace(/\s+(\S+)$/, ' $1');
    const n = items.length;
    track.innerHTML = items.map((m, i) => {
      const desc = m.descricao.split('\n').map(glue).join('<br>');
      const long = m.descricao.replace(/\n/g, ' ').length > 78 ? ' is-long' : '';
      return `<li class="s-mentorados__card" data-i="${i}" aria-roledescription="slide" aria-label="${i + 1} de ${n}: ${esc(m.nome)}">
  <article class="s-mentorados__inner">
    <div class="s-mentorados__photo"><img src="${encodeURI(m.foto)}" alt="${esc(m.nome)}" width="602" height="860" loading="lazy" decoding="async" draggable="false"></div>
    <div class="s-mentorados__info"><h3 class="s-mentorados__name">${esc(m.nome)}</h3><p class="s-mentorados__handle">${esc(m.instagram)}</p><p class="s-mentorados__desc${long}">${desc}</p></div>
  </article>
</li>`;
    }).join('');
    const cards = Array.from(track.children);
    const inners = cards.map(c => c.firstElementChild);
    root.classList.add('is-enhanced');

    // ---------- Geometria ----------
    let mode = 'desk', pv = 4, cw = 300, step = 323, edge = 180;
    const measure = () => {
      const mob = ARMI.isMobile();
      const tab = !mob && window.matchMedia('(max-width: 1023px)').matches;
      mode = mob ? 'row' : 'desk';
      pv = mob ? 2 : tab ? 3 : 4;
      cw = cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(root).getPropertyValue('--card-gap')) || 0;
      // --card-gap pode vir como calc(); mede pelo layout real
      const g2 = (stage.clientWidth - pv * cw) / Math.max(1, pv - 1);
      step = cw + (mode === 'row' ? (gap || 8) : (g2 > 0 && g2 < cw ? g2 : gap));
      if (mode === 'row') step = cw + parseFloat(getComputedStyle(track).columnGap || 8);
      edge = cw * 0.6;
    };
    const wrap = d => { d = ((d % n) + n) % n; return d >= n / 2 ? d - n : d; };
    const lerp = (a, b, t) => a + (b - a) * t;

    const state = { pos: 0 };
    let target = 0;

    function placeDesk(d) {
      const last = pv - 1;
      let x, s = 1, o = 1, b = 0, ry = 0, z = 3;
      if (d >= 0 && d <= last) { x = d * step; }
      else if (d < 0 && d >= -1) { const t = -d; x = lerp(0, -edge, t); s = lerp(1, .82, t); o = lerp(1, .5, t); b = lerp(0, 2.2, t); ry = lerp(0, 9, t); z = 2; }
      else if (d > last && d <= pv) { const t = d - last; x = lerp(last * step, last * step + edge, t); s = lerp(1, .82, t); o = lerp(1, .5, t); b = lerp(0, 2.2, t); ry = lerp(0, -9, t); z = 2; }
      else if (d < -1 && d >= -2) { const t = -d - 1; x = -edge - t * cw * .25; s = lerp(.82, .7, t); o = lerp(.5, 0, t); b = 2.2; ry = 9; z = 1; }
      else if (d > pv && d <= pv + 1) { const t = d - pv; x = last * step + edge + t * cw * .25; s = lerp(.82, .7, t); o = lerp(.5, 0, t); b = 2.2; ry = -9; z = 1; }
      else return null;
      return { x, s, o, b, ry, z, edge: d < -0.5 || d > last + 0.5 };
    }
    function placeRow(d) {
      if (d <= -1 || d > pv + 1.2) return null;
      // à esquerda do primeiro card não há nada (como no PDF): o card que sai some
      const o = d < 0 ? Math.max(0, 1 + d * 1.6) : 1;
      return { x: d * step, s: 1, o, b: 0, ry: 0, z: 2, edge: false };
    }

    function render() {
      for (let i = 0; i < n; i++) {
        const d = wrap(i - state.pos);
        const p = mode === 'row' ? placeRow(d) : placeDesk(d);
        const c = cards[i];
        if (!p || p.o <= 0.01) { if (!c.classList.contains('is-off')) { c.classList.add('is-off'); c.style.opacity = 0; } continue; }
        c.classList.remove('is-off');
        c.style.transform = `translate3d(${p.x.toFixed(2)}px,0,0) perspective(1400px) rotateY(${p.ry.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
        c.style.opacity = p.o.toFixed(3);
        c.style.filter = p.b > .05 ? `blur(${p.b.toFixed(2)}px)` : '';
        c.style.zIndex = p.z;
        c.classList.toggle('is-edge', p.edge);
        c.setAttribute('aria-hidden', p.edge || p.o < .9 ? 'true' : 'false');
        const img = c.querySelector('img');
        if (img.loading === 'lazy' && Math.abs(d) <= pv + 2) img.loading = 'eager';
      }
      updateDots();
    }

    // ---------- Pontos + status ----------
    let lastIdx = -1;
    function updateDots() {
      const idx = ((Math.round(state.pos) % n) + n) % n;
      if (idx === lastIdx) return;
      lastIdx = idx;
      if (dotsBox) { dotsBox.classList.remove('is-pulse'); void dotsBox.offsetWidth; dotsBox.classList.add('is-pulse'); }
      if (status) status.textContent = `Membro ${idx + 1} de ${n}: ${items[idx].nome}`;
    }

    // ---------- Navegação ----------
    let tween = null;
    function goTo(t, dur) {
      target = t;
      if (tween) tween.kill();
      if (reduced || !window.gsap) { state.pos = t; render(); return; }
      tween = gsap.to(state, { pos: t, duration: dur ?? 1.05, ease: 'power3.out', onUpdate: render });
    }
    const next = () => goTo(Math.round(target) + 1);
    const prev = () => goTo(Math.round(target) - 1);
    btnNext.addEventListener('click', () => { stopAuto(); next(); });
    btnPrev.addEventListener('click', () => { stopAuto(); prev(); });
    dotsBox && dotsBox.addEventListener('click', e => {
      const s = e.target.closest('[data-step]'); if (!s) return;
      stopAuto(); goTo(Math.round(target) + Number(s.dataset.step));
    });
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); stopAuto(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stopAuto(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); stopAuto(); goTo(Math.round(target) - wrap(Math.round(target))); }
    });

    // ---------- Arrasto / swipe (pointer events) ----------
    let drag = null, moved = false;
    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, pos: state.pos, t: performance.now(), vx: 0, lx: e.clientX, lt: performance.now(), active: false, id: e.pointerId };
      moved = false;
    });
    stage.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; } // rolagem vertical vence
        drag.active = true; moved = true;
        stage.setPointerCapture(e.pointerId);
        stage.classList.add('is-dragging');
        if (tween) tween.kill();
        stopAuto();
      }
      const now = performance.now();
      drag.vx = (e.clientX - drag.lx) / Math.max(1, now - drag.lt);
      drag.lx = e.clientX; drag.lt = now;
      state.pos = drag.pos - dx / step;
      render();
    });
    const endDrag = e => {
      if (!drag) return;
      if (drag.active) {
        stage.classList.remove('is-dragging');
        const fling = -drag.vx * 260 / step; // px/ms -> cards
        let t = Math.round(state.pos + Math.max(-2, Math.min(2, fling)));
        if (t === Math.round(drag.pos) && Math.abs(state.pos - drag.pos) > .12) t += state.pos > drag.pos ? 1 : -1;
        goTo(t, .9);
      }
      drag = null;
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('click', e => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
      const c = e.target.closest('.s-mentorados__card.is-edge');
      if (c) { stopAuto(); const d = wrap(Number(c.dataset.i) - target); goTo(Math.round(target) + (d < 0 ? -1 : 1)); }
    }, true);

    // ---------- Autoplay lento (pausa no hover/foco/fora da tela) ----------
    let timer = null, autoOn = !reduced, hovering = false, focused = false, visible = false;
    const tick = () => { if (autoOn && !hovering && !focused && visible && !document.hidden && !drag) next(); };
    const startAuto = () => { if (!timer && autoOn) timer = setInterval(tick, 4200); };
    function stopAuto() { autoOn = false; clearInterval(timer); timer = null; }
    root.querySelector('.s-mentorados__carousel').addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
    root.querySelector('.s-mentorados__carousel').addEventListener('pointerleave', () => { hovering = false; });
    root.addEventListener('focusin', () => { focused = true; });
    root.addEventListener('focusout', () => { focused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .35 }).observe(stage);
    } else visible = true;

    // ---------- Layout inicial ----------
    // começa em Camila Borges (como no layout) se ela estiver na lista
    const start = Math.max(0, items.findIndex(m => /Camila Borges/.test(m.nome)));
    state.pos = target = start;
    measure(); render();
    let rw = window.innerWidth;
    window.addEventListener('resize', () => { if (window.innerWidth === rw) return; rw = window.innerWidth; measure(); render(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); render(); });

    // ---------- Entrada em cascata ----------
    if (reduced || !window.gsap || !window.ScrollTrigger) { startAuto(); return; }
    const visibleInners = () => cards.filter(c => !c.classList.contains('is-off')).map(c => c.firstElementChild)
      .sort((a, b) => a.parentElement.getBoundingClientRect().left - b.parentElement.getBoundingClientRect().left);
    gsap.set(inners, { autoAlpha: 0, y: 60, rotateY: -14, rotateX: 6, transformPerspective: 1100, transformOrigin: '50% 100%' });
    ScrollTrigger.create({
      trigger: stage, start: 'top 85%', once: true,
      onEnter: () => {
        const vis = visibleInners();
        gsap.set(inners.filter(x => !vis.includes(x)), { autoAlpha: 1, y: 0, rotateY: 0, rotateX: 0 });
        gsap.to(vis, {
          autoAlpha: 1, y: 0, rotateY: 0, rotateX: 0, duration: 1.3, ease: 'expo.out', stagger: .1,
          onComplete: () => { gsap.set(inners, { clearProps: 'transform,opacity,visibility' }); startAuto(); }
        });
      }
    });
  });
})();
