/* 08 — Depoimentos: cascata de cards + marca-texto que "passa a caneta"; carrossel nativo no mobile. */
(function () {
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-depoimentos');
    if (!root) return;
    const track = root.querySelector('[data-dep-track]');
    const items = [...track.children];
    const btnPrev = root.querySelector('[data-dep-prev]');
    const btnNext = root.querySelector('[data-dep-next]');
    const dotsEl = root.querySelector('[data-dep-dots]');

    /* ---------- Carrossel mobile (scroll-snap nativo = swipe + teclado) ---------- */
    dotsEl.innerHTML = items.map(() => '<span class="s-depoimentos__dot"></span>').join('');
    const dots = [...dotsEl.children];
    const isCarousel = () => getComputedStyle(track).display === 'flex';
    const idx = () => Math.round(track.scrollLeft / (items[1].offsetLeft - items[0].offsetLeft || 1));
    function sync() {
      const carousel = isCarousel();
      const i = carousel ? Math.max(0, Math.min(items.length - 1, idx())) : -1;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      items.forEach((li, k) => li.setAttribute('aria-hidden', carousel && k !== i ? 'true' : 'false'));
      btnPrev.setAttribute('aria-disabled', String(carousel && i === 0));
      btnNext.setAttribute('aria-disabled', String(carousel && i === items.length - 1));
    }
    const goTo = i => {
      i = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    };
    btnPrev.addEventListener('click', () => goTo(idx() - 1));
    btnNext.addEventListener('click', () => goTo(idx() + 1));
    track.addEventListener('keydown', e => {
      if (!isCarousel()) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx() - 1); }
    });
    let st; track.addEventListener('scroll', () => { cancelAnimationFrame(st); st = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', sync);
    sync();

    /* ---------- Motion ---------- */
    if (reduced || !window.gsap || !window.ScrollTrigger) return;

    const lines = root.querySelectorAll('.s-depoimentos__line');
    const lead = root.querySelector('.s-depoimentos__lead');
    gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 75%', once: true } })
      .from(lines, { yPercent: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.3, stagger: 0.1, ease: 'expo.out', clearProps: 'clipPath' })
      .from(lead, { y: 18, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.9');

    const cards = items.map(li => li.querySelector('.s-depoimentos__card'));
    const marks = cards.map(c => [...c.querySelectorAll('mark')]);
    marks.flat().forEach(m => gsap.set(m, { '--hl': '0%' }));

    // marca-texto: duração proporcional ao comprimento do trecho (caneta em velocidade constante)
    const sweep = (list, delay) => {
      let t = delay;
      list.forEach(m => {
        const d = Math.min(1.4, 0.35 + m.textContent.length * 0.018);
        gsap.to(m, { '--hl': '100%', duration: d, delay: t, ease: 'power1.inOut' });
        t += d * 0.85;
      });
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const rot = [-2.2, 1.4, -1.2, 2];
      gsap.timeline({ scrollTrigger: { trigger: track, start: 'top 85%', once: true } })
        .from(cards, {
          y: 90, opacity: 0, rotation: i => rot[i % rot.length], transformOrigin: '50% 100%',
          duration: 1.3, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity'
        })
        .add(() => marks.forEach((list, i) => sweep(list, i * 0.22)), 0.55);
    });
    mm.add('(max-width: 767px)', () => {
      gsap.from(cards[0], {
        y: 60, opacity: 0, rotation: -1.5, transformOrigin: '50% 100%', duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: track, start: 'top 85%', once: true },
        onStart: () => sweep(marks[0], 0.5)
      });
      // demais cards: a caneta passa quando o card chega ao centro do carrossel
      const done = new Set([0]);
      track.addEventListener('scroll', () => {
        const i = Math.max(0, Math.min(items.length - 1, idx()));
        if (!done.has(i)) { done.add(i); sweep(marks[i], 0.25); }
      }, { passive: true });
    });
  });
})();
