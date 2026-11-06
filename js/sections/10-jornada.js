// 10 — Jornada: cards em cascata + spotlight no hover. Título (data-split) e CTA (data-reveal) ficam com o core.js.
(function () {
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-jornada');
    if (!root) return;
    const cards = root.querySelectorAll('.s-jornada__card');

    // Spotlight seguindo o mouse (só ponteiro fino). Não depende de GSAP.
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(card => {
        let raf = 0;
        card.addEventListener('pointermove', e => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
          });
        });
      });
    }

    if (reduced || !window.gsap || !window.ScrollTrigger) return;

    gsap.from(cards, {
      autoAlpha: 0, y: 48, scale: 0.965, duration: 1.1, ease: 'power3.out',
      stagger: 0.09, clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: root.querySelector('.s-jornada__grid'), start: 'top 82%', once: true }
    });

  });
})();
