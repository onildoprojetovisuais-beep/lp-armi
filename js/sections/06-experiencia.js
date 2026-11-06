// 06 — Experiência presencial: reveal dos tiles por clip-path, parallax por coluna, borda do card desenhando
(function () {
  'use strict';
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-experiencia');
    if (!root || reduced || !window.gsap || !window.ScrollTrigger) return;

    // ---------- Título: máscara de linha ----------
    const lines = root.querySelectorAll('.s-experiencia__line > span');
    gsap.set(lines, { yPercent: 115 });
    ScrollTrigger.create({ trigger: root.querySelector('.s-experiencia__title'), start: 'top 88%', once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: .1 }) });

    // ---------- Galeria ----------
    const amp = [-5, 4, -3]; // deslocamento (% da altura da imagem) por coluna — direções alternadas
    root.querySelectorAll('.s-experiencia__gallery').forEach(gal => {
      const tiles = Array.from(gal.querySelectorAll('.s-experiencia__tile'));
      // ordem de leitura: de cima para baixo, esquerda para direita
      const ordered = tiles.slice().sort((a, b) =>
        (parseFloat(a.style.getPropertyValue('--t')) - parseFloat(b.style.getPropertyValue('--t'))) * 3 +
        (parseFloat(a.style.getPropertyValue('--l')) - parseFloat(b.style.getPropertyValue('--l'))));
      const imgs = ordered.map(t => t.querySelector('img'));

      gsap.set(ordered, { clipPath: 'inset(100% 0% 0% 0% round 10px)' });
      gsap.set(imgs, { scale: 1.18 });
      ScrollTrigger.create({
        trigger: gal, start: 'top 82%', once: true,
        onEnter: () => {
          gsap.to(ordered, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.35, ease: 'expo.out', stagger: .085,
            onComplete: () => gsap.set(ordered, { clearProps: 'clipPath' }) });
          gsap.to(imgs, { scale: 1, duration: 1.8, ease: 'expo.out', stagger: .085 });
        }
      });

      // parallax diferencial por coluna (move a imagem dentro do tile; sem layout shift)
      tiles.forEach(t => {
        const col = Number(t.dataset.col) || 0;
        const a = amp[col % amp.length];
        gsap.fromTo(t.querySelector('img'), { yPercent: -a }, {
          yPercent: a, ease: 'none',
          scrollTrigger: { trigger: gal, start: 'top bottom', end: 'bottom top', scrub: .6 }
        });
      });
    });

    // ---------- Card do próximo evento ----------
    const card = root.querySelector('.s-experiencia__event');
    if (card) {
      const rect = card.querySelector('.s-experiencia__border rect');
      const kids = Array.from(card.querySelectorAll('.s-experiencia__icon, .s-experiencia__event-eyebrow, .s-experiencia__event-date, .s-experiencia__event-note'));
      const rule = card.querySelector('.s-experiencia__event-rule');
      gsap.set(rect, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(kids, { autoAlpha: 0, y: 22 });
      gsap.set(rule, { scaleX: 0 });
      const tl = gsap.timeline({ paused: true });
      tl.to(rect, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to(kids, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: .12 }, .35)
        .to(rule, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, .8);
      ScrollTrigger.create({ trigger: card, start: 'top 85%', once: true, onEnter: () => tl.play() });
    }
  });
})();
