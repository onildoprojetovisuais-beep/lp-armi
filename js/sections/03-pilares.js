// 03 — Os pilares do ARMI: colunas se erguendo, linhas que crescem do centro, brilho nos ícones.
(function () {
  'use strict';
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-pilares');
    if (!root || reduced || !window.gsap || !window.ScrollTrigger) return;

    const ease = 'expo.out';

    // Título: revelação por máscara de linha
    gsap.from(root.querySelector('.s-pilares__title .s-pilares__line'), {
      yPercent: 115, duration: 1.3, ease,
      scrollTrigger: { trigger: root.querySelector('.s-pilares__title'), start: 'top 85%', once: true }
    });

    // Hexágonos: parallax muito sutil
    gsap.fromTo(root.querySelector('.s-pilares__hex'), { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Cada pilar: ícone -> nome -> linha -> texto -> coluna se erguendo
    const items = gsap.utils.toArray(root.querySelectorAll('.s-pilares__item'));
    items.forEach((item, i) => {
      const tile = item.querySelector('.s-pilares__tile');
      const name = item.querySelector('.s-pilares__name .s-pilares__line');
      const rule = item.querySelector('.s-pilares__rule');
      const text = item.querySelector('.s-pilares__text');
      const col = item.querySelector('.s-pilares__col');
      const img = col.querySelector('img');
      // no desktop os pares da mesma linha entram escalonados; no mobile cada um entra sozinho
      const delay = ARMI.isMobile() ? 0 : (i % 2) * 0.18;

      const tl = gsap.timeline({
        delay,
        defaults: { ease },
        scrollTrigger: { trigger: item, start: 'top 82%', once: true }
      });
      tl.from(tile, { scale: 0.7, autoAlpha: 0, duration: 0.9, ease: 'power3.out' })
        .from(name, { yPercent: 115, duration: 1.1 }, '<0.08')
        .from(rule, { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, '<0.1')
        .from(text, { y: 18, autoAlpha: 0, duration: 1 }, '<0.25')
        .fromTo(col, { clipPath: 'inset(100% 0% 0% 0%)', y: 26 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.6, ease: 'power3.out', clearProps: 'clipPath' }, '<0.1')
        // brilho dourado quando a coluna termina de subir
        .fromTo(img, { filter: 'brightness(1) drop-shadow(0 0 0 rgba(208,190,144,0))' },
          { filter: 'brightness(1.25) drop-shadow(0 0 14px rgba(208,190,144,.5))', duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 1, clearProps: 'filter' }, '-=0.45')
        // reflexo varrendo o tile do ícone
        .add(() => { tile.classList.add('is-shine'); }, '<');
    });
  });
})();
