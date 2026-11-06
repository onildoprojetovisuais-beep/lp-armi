// 09 — Como funciona: estrada que se pavimenta, tracejado em fluxo, etapas reveladas por hover/foco/toque
(function () {
  const warn = e => { try { console.warn('[09-como-funciona]', e); } catch (_) {} };
  // nunca derruba o resto da página: qualquer falha volta ao estado estático (tudo visível)
  const fallback = () => {
    const r = document.querySelector('.s-como-funciona');
    if (!r) return;
    r.classList.remove('is-armed');
    r.querySelectorAll('[style]').forEach(el => { if (!el.matches('.cf-hit, .cf-text')) el.removeAttribute('style'); });
    r.querySelectorAll('.cf-text, .cf-text *, .cf-node, .cf-node *, .cf-stem, .cf-stem *, .cf-road-shadow, .cf-pave-path').forEach(el => {
      ['opacity', 'transform', 'clip-path', 'translate', 'rotate', 'scale', 'visibility'].forEach(k => el.style && el.style.removeProperty(k));
    });
    const pave = r.querySelector('.cf-pave-path');
    if (pave) { pave.removeAttribute('stroke-dasharray'); pave.removeAttribute('stroke-dashoffset'); }
  };
  const safe = fn => (...a) => { try { return fn(...a); } catch (e) { warn(e); fallback(); } };

  ARMI.onReady(safe(({ reduced }) => {
    const root = document.querySelector('.s-como-funciona');
    if (!root || reduced || !window.gsap || !window.ScrollTrigger) return; // estado estático: tudo visível

    const $ = (s, el = root) => el.querySelector(s);
    const $$ = (s, el = root) => Array.from(el.querySelectorAll(s));
    const stage = $('.cf-stage');
    const pave = $('.cf-pave-path');
    const dash = $('.cf-dash');
    const shadow = $('.cf-road-shadow');
    const CX = [246.75, 528.99, 811.23, 1093.47], CY = 307.04;
    const steps = [1, 2, 3, 4].map(n => ({
      n,
      node: $(`.cf-node[data-step="${n}"]`),
      stem: $(`.cf-stem[data-step="${n}"]`),
      li: $(`.cf-step[data-step="${n}"]`)
    }));
    steps.forEach(s => {
      s.hit = $('.cf-hit', s.li); s.text = $('.cf-text', s.li);
      s.disc = $$('.cf-node > path, .cf-cshadow', s.node);
      s.icon = $('.cf-icon', s.node);
      s.halo = $('.cf-halo', s.node); s.glow = $('.cf-glow', s.node);
      s.line = $('.cf-stem-line', s.stem); s.pin = $('.cf-pin', s.stem);
      s.tag = $('.cf-tag', s.text); s.title = $('.cf-line', s.text); s.body = $('.cf-body', s.text);
    });

    root.classList.add('is-armed');
    const hint = $('.cf-hint-txt');
    const touchOnly = window.matchMedia('(hover: none)').matches;
    if (hint && touchOnly) hint.textContent = hint.dataset.touch;

    // fluxo contínuo e lento do tracejado (pausa fora da tela)
    const flow = gsap.to(dash, { strokeDashoffset: -42.25 * 20, duration: 44, ease: 'none', repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: st => st.isActive ? flow.play() : flow.pause() });

    // momento (0–1) em que a pavimentação passa pelo centro de cada círculo (ease sine.inOut)
    const at = p => Math.acos(1 - 2 * p) / Math.PI;
    const PAVE = 2.6;

    function introTimeline(tlVars) {
      gsap.set(pave, { attr: { 'stroke-dasharray': '1000 1100', 'stroke-dashoffset': 1001 } });
      gsap.set(shadow, { opacity: 0 });
      steps.forEach(s => {
        gsap.set(s.disc, { opacity: 0 });
        gsap.set(s.node, { scale: .35, svgOrigin: `${CX[s.n - 1]} ${CY}` });
        gsap.set(s.icon, { opacity: 0, scale: .55, transformOrigin: '50% 50%' });
      });
      const tl = gsap.timeline(tlVars);
      tl.to(pave, { attr: { 'stroke-dashoffset': 0 }, duration: PAVE, ease: 'sine.inOut' }, 0)
        .to(shadow, { opacity: 1, duration: PAVE, ease: 'power2.in' }, .1);
      steps.forEach((s, i) => {
        const t = at((i + .5) / 4) * PAVE - .28;
        tl.to(s.disc, { opacity: 1, duration: .5, ease: 'power2.out' }, t)
          .to(s.node, { scale: 1, duration: 1.05, ease: 'expo.out' }, t)
          .to(s.icon, { opacity: 1, scale: 1, duration: .8, ease: 'power3.out' }, t + .28);
      });
      return tl;
    }

    const mm = gsap.matchMedia();

    // ---------------- DESKTOP: hover / foco / toque ----------------
    mm.add('(min-width: 1200px)', safe(() => {
      let active = 0, source = null, ready = false, visible = false;
      let idleTimer = 0, autoTimer = 0, autoIdx = 0, lastPointer = 'kbd';
      const hoverCount = [0, 0, 0, 0, 0];

      steps.forEach(s => {
        const down = s.n % 2 === 1;
        gsap.set(s.line, { scaleY: 0, transformOrigin: down ? '50% 0%' : '50% 100%' });
        gsap.set(s.pin, { opacity: 0, scale: .3, transformOrigin: '50% 50%' });
        gsap.set(s.halo, { opacity: 0, scale: .92, svgOrigin: `${CX[s.n - 1]} ${CY}` });
        gsap.set(s.glow, { opacity: 0 });
        gsap.set(s.tag, { clipPath: 'inset(0% 100% 0% 0%)' });
        gsap.set(s.title, { yPercent: 115 });
        gsap.set(s.body, { opacity: 0, y: 12 });
        s.tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } })
          .to(s.glow, { opacity: 1, duration: .8, ease: 'power2.out' }, 0)
          .to(s.halo, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out' }, 0)
          .to(s.line, { scaleY: 1, duration: .6, ease: 'power3.inOut' }, .05)
          .to(s.pin, { opacity: 1, scale: 1, duration: .45, ease: 'power3.out' }, .5)
          .to(s.tag, { clipPath: 'inset(0% 0% 0% 0%)', duration: .55, ease: 'power3.out' }, .42)
          .to(s.title, { yPercent: 0, duration: .8, ease: 'expo.out' }, .5)
          .to(s.body, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, .62);
      });

      function setActive(n, src) {
        if (n === active) { source = src; return; }
        if (active) { const p = steps[active - 1]; p.tl.timeScale(1.7).reverse(); p.node.classList.remove('is-active'); p.stem.classList.remove('is-active'); p.hit.setAttribute('aria-expanded', 'false'); }
        active = n; source = src;
        stage.classList.toggle('has-active', !!n);
        if (n) { const s = steps[n - 1]; s.tl.timeScale(1).play(); s.node.classList.add('is-active'); s.stem.classList.add('is-active'); s.hit.setAttribute('aria-expanded', 'true'); }
      }

      // ciclo automático lento para quem não interage
      function stopAuto() { clearTimeout(autoTimer); autoTimer = 0; if (source === 'auto') setActive(0, null); }
      function autoStep() {
        if (!visible || (source && source !== 'auto')) return;
        autoIdx = autoIdx % 4 + 1;
        setActive(autoIdx, 'auto');
        autoTimer = setTimeout(() => {
          if (autoIdx === 4) { setActive(0, null); autoTimer = setTimeout(autoStep, 1600); }
          else autoStep();
        }, 3000);
      }
      function armIdle(delay = 3500) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { if (ready && visible && !source && !autoTimer) autoStep(); }, delay);
      }
      function userTouch() { root.classList.add('is-touched'); stopAuto(); armIdle(7000); }

      const onEnter = n => e => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        hoverCount[n]++; userTouch(); setActive(n, 'hover');
      };
      const onLeave = n => e => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        hoverCount[n] = Math.max(0, hoverCount[n] - 1);
        setTimeout(() => { if (!hoverCount[n] && active === n && source === 'hover') setActive(0, null); }, 140);
      };
      const listeners = [];
      const on = (el, ev, fn) => { el.addEventListener(ev, fn); listeners.push(() => el.removeEventListener(ev, fn)); };

      steps.forEach(s => {
        [s.hit, s.text].forEach(el => { on(el, 'pointerenter', onEnter(s.n)); on(el, 'pointerleave', onLeave(s.n)); });
        on(s.hit, 'pointerdown', e => { lastPointer = e.pointerType; });
        on(s.hit, 'click', () => {
          userTouch();
          const wasMouse = lastPointer === 'mouse';
          lastPointer = 'kbd';
          if (wasMouse) { setActive(s.n, 'hover'); return; }
          // toque e teclado (Enter/Espaço) alternam a etapa
          if (active === s.n && source !== 'auto') setActive(0, null); else setActive(s.n, 'tap');
        });
        on(s.hit, 'focus', () => { if (s.hit.matches(':focus-visible')) { userTouch(); setActive(s.n, 'focus'); } });
        on(s.hit, 'blur', () => { if (active === s.n && source === 'focus') setActive(0, null); });
      });
      on(root, 'keydown', e => { if (e.key === 'Escape' && active) { setActive(0, null); } });
      on(document, 'pointerdown', e => { if (source === 'tap' && !e.target.closest('.cf-hit')) setActive(0, null); });

      const intro = introTimeline({ paused: true, onComplete: () => { ready = true; armIdle(); } });
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top 72%', end: 'bottom 15%',
        onEnter: () => intro.play(),
        onToggle: self => { visible = self.isActive; if (visible) armIdle(); else { clearTimeout(idleTimer); stopAuto(); } }
      });
      if (st.progress > 0 || st.isActive) intro.play();

      return () => { listeners.forEach(f => f()); clearTimeout(idleTimer); clearTimeout(autoTimer); stage.classList.remove('has-active'); steps.forEach(s => { s.node.classList.remove('is-active'); s.stem.classList.remove('is-active'); s.hit.setAttribute('aria-expanded', 'false'); }); };
    }));

    // ---------------- MOBILE / TABLET: trilha vertical guiada pelo scroll ----------------
    mm.add('(max-width: 1199px)', safe(() => {
      const tl = introTimeline({ paused: true });
      ScrollTrigger.create({
        trigger: $('.cf-road-wrap'), start: 'top 82%', end: 'bottom 55%',
        animation: tl, scrub: .8
      });
      steps.forEach(s => {
        gsap.from(s.li, {
          opacity: 0, y: 22, duration: .9, ease: 'power3.out',
          // sem `once` (matar o trigger durante um refresh quebrava o ScrollTrigger global)
          scrollTrigger: { trigger: s.li, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });
    }));
  }));
})();
