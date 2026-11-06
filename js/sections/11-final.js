// 11 — Final: zoom-out lento + parallax na imagem, bloco de ajuda em fade-up.
(function () {
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-final');
    if (!root || reduced || !window.gsap || !window.ScrollTrigger) return;
    const media = root.querySelector('.s-final__media');
    const img = root.querySelector('.s-final__img');

    // scale 1.08 → 1.02 com deslocamento vertical coberto pela folga do zoom
    gsap.fromTo(img,
      { scale: 1.08, yPercent: -2 },
      { scale: 1.02, yPercent: 1, ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom 60%', scrub: 1.2 } });

    const help = root.querySelectorAll('.s-final__title, .s-final__text, .s-final__wa');
    gsap.from(help, {
      autoAlpha: 0, y: 28, duration: 1.1, ease: 'power3.out', stagger: 0.12,
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: root.querySelector('.s-final__help'), start: 'top 88%', once: true }
    });

    gsap.from(root.querySelector('.s-final__footer p'), {
      autoAlpha: 0, duration: 1.2, ease: 'power2.out', clearProps: 'opacity,visibility',
      scrollTrigger: { trigger: root.querySelector('.s-final__footer'), start: 'top 95%', once: true }
    });
  });
})();
