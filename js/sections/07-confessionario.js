/* 07 — Momento Confessionário: carrossel infinito (setas, swipe, teclado) + modal de vídeo. */
(function () {
  /* ================================================================
     DADOS DOS DEPOIMENTOS — o cliente troca aqui.
     PENDENTE: nomes, especializações e trechos reais (hoje são os placeholders do layout).
     As URLs dos vídeos ficam em js/config.js -> ARMI_CONFIG.confessionarioVideos[i] (mesma ordem).
     ================================================================ */
  const CONFESSIONARIO = [
    {
      nome: 'Participante',
      especializacao: 'Especialização',
      trecho: 'trecho marcante do depoimento do participante no confessionário no evento presencial ARMI.',
      thumb: 'assets/img/extraido/confessionario-1.webp',
      alt: 'Participante sentada na poltrona do confessionário do evento ARMI'
    },
    {
      nome: 'Participante',
      especializacao: 'Especialização',
      trecho: 'trecho marcante do depoimento do participante no confessionário no evento presencial ARMI.',
      thumb: 'assets/img/extraido/confessionario-2.webp',
      alt: 'Participante sentado na poltrona do confessionário do evento ARMI'
    },
    {
      nome: 'Participante',
      especializacao: 'Especialização',
      trecho: 'trecho marcante do depoimento do participante no confessionário no evento presencial ARMI.',
      thumb: 'assets/img/extraido/confessionario-3.webp',
      alt: 'Participante de terno sentado na poltrona do confessionário do evento ARMI'
    }
  ];

  const QUOTE_PATH =
    'M20.27 23.9C20.27 29.33 16.48 33.45 10.71 33.45C4.94 33.45 0 28.84 0 20.6C0 10.39 7.75 1.65 17.8 0L17.8 6.1C12.03 7.25 7.75 11.37 7.75 16.15C8.73 15.49 10.05 15 12.19 15C16.48 15 20.27 18.13 20.27 23.9Z' +
    'M46.96 23.9C46.96 29.33 43.01 33.45 37.24 33.45C31.64 33.45 26.53 28.84 26.53 20.6C26.53 10.39 34.27 1.65 44.49 0L44.49 6.1C38.72 7.25 34.44 11.37 34.44 15.99C35.43 15.33 36.91 15 38.89 15C43.17 15 46.96 18.13 46.96 23.9Z';

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // evita palavra órfã: une as duas últimas palavras com &nbsp;
  const noOrphan = s => esc(s).replace(/\s+(\S+)$/, '&nbsp;$1');

  function videoUrl(i) {
    const list = (window.ARMI_CONFIG && ARMI_CONFIG.confessionarioVideos) || [];
    return (list[i] || '').trim();
  }

  function slideHTML(d, i) {
    const url = videoUrl(i);
    const play = url
      ? `<button class="s-confessionario__play" type="button" data-conf-play="${i}" aria-label="Assistir ao depoimento de ${esc(d.nome)} (${i + 1} de ${CONFESSIONARIO.length})"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z"/></svg></button>`
      : `<button class="s-confessionario__play" type="button" data-conf-play="${i}" aria-disabled="true" aria-label="Vídeo do depoimento de ${esc(d.nome)} disponível em breve"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z"/></svg></button><span class="s-confessionario__soon" aria-hidden="true">Vídeo em breve</span>`;
    return `<li class="s-confessionario__slide" data-index="${i}">
      <article class="s-confessionario__card">
        <div class="s-confessionario__thumb">
          <img src="${esc(d.thumb)}" width="960" height="693" alt="${esc(d.alt)}" loading="lazy" decoding="async" draggable="false">
          ${play}
        </div>
        <div class="s-confessionario__body">
          <p class="s-confessionario__name">${esc(d.nome)}</p>
          <p class="s-confessionario__role">${esc(d.especializacao)}</p>
          <svg class="s-confessionario__marks" viewBox="-1 -1 49 36" aria-hidden="true"><path d="${QUOTE_PATH}"/></svg>
          <blockquote class="s-confessionario__quote"><p>“${noOrphan(d.trecho)}”</p></blockquote>
        </div>
      </article>
    </li>`;
  }

  ARMI.onReady(({ reduced }) => {
    const root = document.querySelector('.s-confessionario');
    if (!root) return;
    const viewport = root.querySelector('[data-conf-viewport]');
    const track = root.querySelector('[data-conf-track]');
    const btnPrev = root.querySelector('[data-conf-prev]');
    const btnNext = root.querySelector('[data-conf-next]');
    const dotsEl = root.querySelector('[data-conf-dots]');
    const live = root.querySelector('[data-conf-live]');
    const modal = root.querySelector('[data-conf-modal]');
    const media = root.querySelector('[data-conf-media]');
    const n = CONFESSIONARIO.length;
    const hasGsap = !!window.gsap;

    /* ---------- Render: originais + 1 cópia (loop infinito). Posição 0 = buffer "anterior". ---------- */
    const html = CONFESSIONARIO.map(slideHTML).join('');
    track.innerHTML = html + html;
    // começa com o último item no buffer à esquerda -> o primeiro visível é o índice 0
    track.insertBefore(track.lastElementChild, track.firstElementChild);

    dotsEl.innerHTML = CONFESSIONARIO.map(() => '<span class="s-confessionario__dot"></span>').join('');
    const dots = [...dotsEl.children];

    let step = 0, busy = false;
    const setX = x => { hasGsap ? gsap.set(track, { x }) : (track.style.transform = `translate3d(${x}px,0,0)`); };
    const measure = () => {
      const a = track.children[0], b = track.children[1];
      step = b.getBoundingClientRect().left - a.getBoundingClientRect().left;
      setX(-step);
    };
    const visibleCount = () => Math.max(1, Math.round((viewport.clientWidth + 1) / step));
    const current = () => +track.children[1].dataset.index;

    function syncState(announce) {
      const vis = visibleCount();
      [...track.children].forEach((li, pos) => {
        const shown = pos >= 1 && pos <= vis;
        li.setAttribute('aria-hidden', shown ? 'false' : 'true');
        li.querySelectorAll('button').forEach(b => { b.tabIndex = shown ? 0 : -1; });
      });
      const c = current();
      dots.forEach((d, i) => d.classList.toggle('is-active', i === c));
      if (announce) live.textContent = `Depoimento ${c + 1} de ${n}`;
    }

    function go(dir) {
      if (busy || !step) return;
      busy = true;
      const done = () => {
        if (dir > 0) track.appendChild(track.firstElementChild);
        else track.insertBefore(track.lastElementChild, track.firstElementChild);
        setX(-step); busy = false; syncState(true);
      };
      const target = dir > 0 ? -2 * step : 0;
      if (reduced || !hasGsap) { done(); return; }
      gsap.to(track, { x: target, duration: 0.9, ease: 'power3.out', overwrite: true,
        onComplete: done });
    }

    btnPrev.addEventListener('click', () => go(-1));
    btnNext.addEventListener('click', () => go(1));
    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    /* ---------- Swipe / arraste com resposta em tempo real ---------- */
    let startX = 0, startY = 0, dx = 0, dragging = false, moved = false, pid = null;
    viewport.addEventListener('pointerdown', e => {
      if (busy || e.button !== 0) return;
      startX = e.clientX; startY = e.clientY; dx = 0; dragging = true; moved = false; pid = e.pointerId;
    });
    viewport.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== pid) return;
      dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - startY) > Math.abs(dx)) { dragging = false; return; } // rolagem vertical
        moved = true; viewport.classList.add('is-dragging');
        try { viewport.setPointerCapture(pid); } catch (_) {}
      }
      const x = Math.max(-2 * step, Math.min(0, -step + dx));
      setX(x);
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false; viewport.classList.remove('is-dragging');
      if (!moved) return;
      const th = Math.min(60, step * 0.18);
      if (dx < -th) go(1);
      else if (dx > th) go(-1);
      else if (hasGsap && !reduced) gsap.to(track, { x: -step, duration: 0.6, ease: 'power3.out', overwrite: true });
      else setX(-step);
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    // um arraste não deve disparar o play
    viewport.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

    /* ---------- Modal de vídeo ---------- */
    let lastFocus = null;
    function embed(url) {
      const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
      if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1" title="Vídeo do confessionário" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vm) return `<iframe src="https://player.vimeo.com/video/${vm[1]}?autoplay=1&title=0&byline=0" title="Vídeo do confessionário" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) return `<video src="${esc(url)}" controls autoplay playsinline></video>`;
      return `<iframe src="${esc(url)}" title="Vídeo do confessionário" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
    function openVideo(i, trigger) {
      const url = videoUrl(i);
      if (!url || !modal || typeof modal.showModal !== 'function') return;
      lastFocus = trigger;
      media.innerHTML = embed(url);
      modal.showModal();
      ARMI.lenis && ARMI.lenis.stop();
    }
    function closeVideo() { if (modal.open) modal.close(); }
    modal && modal.addEventListener('close', () => {
      media.innerHTML = '';
      ARMI.lenis && ARMI.lenis.start();
      lastFocus && lastFocus.focus({ preventScroll: true });
    });
    modal && modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
    root.querySelector('[data-conf-close]').addEventListener('click', closeVideo);

    track.addEventListener('click', e => {
      const b = e.target.closest('[data-conf-play]');
      if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') {
        // estado "em breve": mostra o selo por um instante (toque no mobile)
        const soon = b.nextElementSibling;
        if (soon) { soon.classList.add('is-visible'); clearTimeout(soon._t); soon._t = setTimeout(() => soon.classList.remove('is-visible'), 1800); }
        return;
      }
      openVideo(+b.dataset.confPlay, b);
    });

    /* ---------- Layout ---------- */
    measure(); syncState(false);
    let rz;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { measure(); syncState(false); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); });

    /* ---------- Motion ---------- */
    const drawMarks = (svg, delay = 0) => {
      const p = svg.querySelector('path');
      if (!p || !hasGsap) return;
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 },
        { strokeDashoffset: 0, duration: 1.3, delay, ease: 'power2.inOut' });
      gsap.to(p, { fillOpacity: 1, duration: 0.7, delay: delay + 0.9, ease: 'power2.out' });
    };

    if (reduced || !hasGsap || !window.ScrollTrigger) return;

    const title = root.querySelectorAll('.s-confessionario__line');
    const lead = root.querySelector('.s-confessionario__lead');
    gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 78%', once: true } })
      .from(title, { yPercent: 70, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.3, stagger: 0.12, ease: 'expo.out', clearProps: 'clipPath' })
      .from(lead, { y: 18, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.9')
      .from([btnPrev, btnNext], { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.6');

    const visCards = () => [...track.children].slice(1, 1 + visibleCount());
    const cardsTl = gsap.timeline({ scrollTrigger: { trigger: viewport, start: 'top 82%', once: true } });
    const vc = visCards();
    vc.forEach(li => {
      const marks = li.querySelector('.s-confessionario__marks path');
      gsap.set(marks, { fillOpacity: 0 });
    });
    cardsTl
      .from(vc.map(li => li.querySelector('.s-confessionario__card')), {
        y: 70, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity'
      })
      .from(vc.map(li => li.querySelector('.s-confessionario__thumb img')), {
        scale: 1.18, duration: 1.8, stagger: 0.12, ease: 'expo.out', clearProps: 'transform'
      }, 0)
      .fromTo(vc.map(li => li.querySelector('.s-confessionario__quote')), { '--conf-line': 0 }, {
        '--conf-line': 1, duration: 1.2, stagger: 0.12, ease: 'expo.inOut'
      }, 0.35)
      .add(() => vc.forEach((li, k) => drawMarks(li.querySelector('.s-confessionario__marks'), k * 0.12)), 0.45);

    // hover: aspas se redesenham
    track.querySelectorAll('.s-confessionario__card').forEach(card => {
      card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') drawMarks(card.querySelector('.s-confessionario__marks')); });
    });
  });
})();
