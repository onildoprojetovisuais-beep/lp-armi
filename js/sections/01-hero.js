// 01 · HERO — entrada coreografada, parallax (scroll + mouse) e modal do vídeo.
(function () {
  'use strict';

  // ---------- URL do vídeo -> elemento incorporável ----------
  function buildPlayer(url) {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
    if (yt) return iframe(`https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`);
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/i);
    if (vm) return iframe(`https://player.vimeo.com/video/${vm[1]}?autoplay=1&title=0&byline=0&portrait=0${vm[2] ? '&h=' + vm[2] : ''}`);
    if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) {
      const v = document.createElement('video');
      v.src = url; v.controls = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('aria-label', 'Vídeo de apresentação do ARMI Club');
      return v;
    }
    return iframe(url);
  }
  function iframe(src) {
    const f = document.createElement('iframe');
    f.src = src;
    f.title = 'Vídeo de apresentação do ARMI Club';
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    return f;
  }

  function initModal(root, ARMI) {
    const card = root.querySelector('.s-hero__video-card');
    const dialog = root.querySelector('.s-hero__modal');
    const media = root.querySelector('.s-hero__modal-media');
    const closeBtn = root.querySelector('.s-hero__modal-close');
    const url = ((window.ARMI_CONFIG || {}).heroVideoUrl || '').trim();

    if (!url || !dialog || typeof dialog.showModal !== 'function') {
      // sem vídeo configurado: mostra só a capa, sem ação
      card.classList.add('is-novideo');
      card.setAttribute('aria-disabled', 'true');
      card.removeAttribute('aria-haspopup');
      card.setAttribute('aria-label', 'Vídeo de apresentação do ARMI Club (em breve)');
      return;
    }

    const open = () => {
      media.replaceChildren(buildPlayer(url));
      dialog.showModal();
      if (ARMI.lenis) ARMI.lenis.stop();
      if (window.gsap && !ARMI.reduced) {
        gsap.fromTo(dialog.querySelector('.s-hero__modal-box'), { autoAlpha: 0, y: 24, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'expo.out' });
      }
    };
    const close = () => dialog.close();

    card.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      media.replaceChildren();
      if (ARMI.lenis) ARMI.lenis.start();
      card.focus({ preventScroll: true });
    });
  }

  ARMI.onReady((A) => {
    const root = document.querySelector('.s-hero');
    if (!root) return;
    initModal(root, A);

    const hasGSAP = !!(window.gsap && window.ScrollTrigger);
    if (A.reduced || !hasGSAP) { root.classList.add('is-ready'); return; }

    const q = s => root.querySelector(s);
    const qa = s => Array.from(root.querySelectorAll(s));
    const art = q('.s-hero__art');
    const artImg = q('.s-hero__art-img');
    const artMove = q('.s-hero__art-move');
    const lines = qa('.s-hero__ln-i');
    const badges = qa('.s-hero__badge');
    const video = q('.s-hero__video');

    // estado inicial explícito (assume o lugar do CSS) e libera a seção
    gsap.set([q('.s-hero__logo'), q('.s-hero__sub'), q('.s-hero__cta'), art, video], { autoAlpha: 0 });
    gsap.set(lines, { y: 0, yPercent: 115 });
    gsap.set(badges, { autoAlpha: 0 });
    root.classList.add('is-ready');

    // ---------- Entrada ----------
    const tl = gsap.timeline({ delay: .12, defaults: { ease: 'expo.out' } });
    tl.to(art, { autoAlpha: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .fromTo(artImg, { scale: 1.07, filter: 'blur(10px)' }, { scale: 1, filter: 'blur(0px)', duration: 2.4, clearProps: 'filter' }, 0)
      .to(badges, { autoAlpha: 1, duration: 1.4, ease: 'power2.out', stagger: .12 }, .35)
      .add(() => badges.forEach((b, i) => setTimeout(() => b.classList.add('is-shine'), i * 220)), 1.6)
      .fromTo(q('.s-hero__logo'), { autoAlpha: 0, y: -14, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.3, clearProps: 'filter' }, .15)
      .to(lines, { yPercent: 0, duration: 1.3, stagger: .1 }, .4)
      .fromTo(q('.s-hero__sub'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 1.0)
      .fromTo(q('.s-hero__cta'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 1.18);

    // ---------- Card do vídeo: sobe com escala sutil ao entrar ----------
    gsap.fromTo(video, { autoAlpha: 0, y: 70, scale: .94 }, {
      autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: 'expo.out',
      delay: video.getBoundingClientRect().top < window.innerHeight ? 1.3 : 0,
      scrollTrigger: { trigger: video, start: 'top 94%', once: true }
    });

    // ---------- Parallax lento da arte no scroll ----------
    gsap.to(art, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
    });

    // ---------- Parallax leve de mouse (desktop) ----------
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    if (mq.matches) {
      const xTo = gsap.quickTo(artMove, 'x', { duration: 1.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(artMove, 'y', { duration: 1.4, ease: 'power3.out' });
      let raf = 0, mx = 0, my = 0;
      window.addEventListener('pointermove', e => {
        mx = e.clientX / window.innerWidth - .5;
        my = e.clientY / window.innerHeight - .5;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (window.scrollY > root.offsetHeight) return;
          xTo(mx * -18); yTo(my * -12);
        });
      }, { passive: true });
    }
  });
})();
