// 04 — Fundadores: nomes por máscara de linha, bios em fade-up, foto com reveal lateral + parallax,
// card de vidro "ARMI CLUB" com logo surgindo e brilho dourado varrendo o vidro.
(function () {
  'use strict';
  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-fundadores');
    if (!root || reduced || !window.gsap || !window.ScrollTrigger) return;

    const ease = 'expo.out';

    // Nomes + bios
    root.querySelectorAll('.s-fundadores__person').forEach(person => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: person, start: 'top 80%', once: true } });
      tl.from(person.querySelector('.s-fundadores__line'), { yPercent: 118, duration: 1.3, ease })
        .from(person.querySelectorAll('p'), { y: 22, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, '-=0.95');
    });

    // Foto: reveal por clip-path lateral (painel, faixa e casal juntos) + parallax suave do recorte
    const media = root.querySelector('.s-fundadores__media');
    const img = root.querySelector('.s-fundadores__img');
    const stripe = root.querySelector('.s-fundadores__stripe');
    const mobile = ARMI.isMobile() || window.matchMedia('(max-width: 1023px)').matches;

    gsap.timeline({ scrollTrigger: { trigger: media, start: mobile ? 'top 85%' : 'top 70%', once: true } })
      .fromTo(media, { clipPath: 'inset(0% 0% 0% 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', clearProps: 'clipPath' })
      .from(img, { scale: 1.08, transformOrigin: '50% 100%', duration: 1.9, ease }, 0.15)
      .from(stripe, mobile ? { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power3.inOut' }
                           : { scaleY: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'power3.inOut' }, 0.5);

    // parallax sutil (±1,6%): a base do recorte fica escondida sob a faixa escura, sem abrir fresta
    gsap.fromTo(img, { yPercent: -1.6 }, {
      yPercent: 1.6, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.s-fundadores__stage'), start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Card de vidro
    const card = root.querySelector('.s-fundadores__card');
    const letters = root.querySelectorAll('.s-fundadores__letter');
    const club = root.querySelector('.s-fundadores__club');
    const sheen = root.querySelector('.s-fundadores__sheen');
    gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
      .from(card, { y: 40, autoAlpha: 0, duration: 1.2, ease: 'power3.out' })
      .from(letters, { yPercent: 40, autoAlpha: 0, duration: 1.1, ease, stagger: 0.09 }, '-=0.7')
      .from(club, { x: -12, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .fromTo(sheen, { xPercent: -120 }, { xPercent: 380, duration: 1.8, ease: 'power2.inOut' }, '-=0.9');

    // brilho volta a varrer o vidro no hover (desktop)
    if (!ARMI.isTouch) {
      card.addEventListener('mouseenter', () => {
        gsap.fromTo(sheen, { xPercent: -120 }, { xPercent: 380, duration: 1.4, ease: 'power2.inOut', overwrite: true });
      });
    }
  });
})();
