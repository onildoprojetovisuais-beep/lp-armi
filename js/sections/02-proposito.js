// 02 · PROPÓSITO — foto com reveal por clip-path + parallax, frase final linha a linha,
// barra de números com contador. Título e corpo usam data-split / data-reveal-group do core.
(function () {
  'use strict';
  ARMI.onReady((A) => {
    const root = document.querySelector('.s-proposito');
    if (!root || A.reduced || !(window.gsap && window.ScrollTrigger)) return;

    const q = s => root.querySelector(s);
    const clip = q('.s-proposito__media-par');
    const pic = q('.s-proposito__media-par picture');
    const img = q('.s-proposito__img');
    const lines = Array.from(root.querySelectorAll('.s-proposito__ln-i'));
    const stats = q('.s-proposito__stats');
    const counts = Array.from(root.querySelectorAll('.s-proposito__count'));
    const desktop = () => window.matchMedia('(min-width: 1200px)').matches;

    // ---------- Foto: cortina por clip-path + leve zoom-out ----------
    const hidden = desktop() ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';
    gsap.set(clip, { clipPath: hidden });
    gsap.set(img, { scale: 1.12, transformOrigin: '50% 30%' });
    const photoTl = gsap.timeline({ scrollTrigger: { trigger: q('.s-proposito__media'), start: 'top 78%', once: true } });
    photoTl.to(clip, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
           .to(img, { scale: 1, duration: 2.2, ease: 'expo.out' }, .2);

    // ---------- Parallax lento da foto ----------
    gsap.fromTo(pic, { yPercent: 0 }, {
      yPercent: -5, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // ---------- Frase final: máscara linha a linha ----------
    gsap.set(lines, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: q('.s-proposito__quote'), start: 'top 85%', once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .11 })
    });

    // ---------- Barra de números + contador ----------
    counts.forEach(el => {
      // trava a largura final para o contador não deslocar o layout
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      el.textContent = '0';
    });
    gsap.set(stats, { autoAlpha: 0, y: 40 });
    ScrollTrigger.create({
      trigger: stats, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(stats, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' });
        counts.forEach((el, i) => {
          const to = parseInt(el.dataset.to, 10) || 0;
          const o = { v: 0 };
          gsap.to(o, {
            v: to, duration: 2.2, delay: .25 + i * .12, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(o.v); },
            onComplete: () => { el.textContent = to; }
          });
        });
      }
    });

    // fontes podem mudar a largura final: recalcula a trava
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      counts.forEach(el => {
        const cur = el.textContent; el.style.minWidth = ''; el.textContent = el.dataset.to;
        el.style.minWidth = el.getBoundingClientRect().width + 'px'; el.textContent = cur;
      });
    });
  });
})();
