(() => {
  'use strict';
  const d = document, w = window, root = d.documentElement;
  root.lang = 'fr';
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = !!(w.gsap && w.ScrollTrigger);
  if (G) gsap.registerPlugin(ScrollTrigger);
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const mk = (tag, cls, txt) => { const e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const hasIO = 'IntersectionObserver' in w;

  /* ---------- Défilement doux ---------- */
  let lenis = null;
  if (!reduce && fine && w.Lenis) {
    lenis = new w.Lenis({ lerp: 0.1, smoothWheel: true });
    if (G) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Menu ---------- */
  const hdr = $('#hdr'), menuBtn = $('#menu-btn'), menu = $('#menu');
  const menuBackground = $$('main, footer');
  const desktop = w.matchMedia('(min-width: 1001px)');
  let menuOpen = false, menuFocus = null, closeTimer = null;
  const backgroundInert = new Map();
  const menuLinks = () => $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', menu).filter(el => el.getClientRects().length);
  function openMenu() {
    if (desktop.matches || menuOpen) return;
    clearTimeout(closeTimer);
    menuFocus = d.activeElement;
    menu.hidden = false;
    menu.inert = false;
    void menu.offsetWidth;
    menu.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('.mb-l', menuBtn).textContent = 'Fermer';
    root.classList.add('menu-open');
    menuOpen = true;
    menuBackground.forEach(el => { backgroundInert.set(el, el.inert); el.inert = true; });
    if (lenis) lenis.stop();
    (menuLinks()[0] || menuBtn).focus();
  }
  function closeMenu(restoreFocus = true, immediate = false) {
    if (!menuOpen) return;
    menu.classList.remove('is-open');
    menu.inert = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    $('.mb-l', menuBtn).textContent = 'Menu';
    root.classList.remove('menu-open');
    menuOpen = false;
    menuBackground.forEach(el => { el.inert = backgroundInert.get(el); });
    backgroundInert.clear();
    if (lenis) lenis.start();
    clearTimeout(closeTimer);
    if (immediate) menu.hidden = true;
    else closeTimer = setTimeout(() => { if (!menuOpen) menu.hidden = true; }, reduce ? 0 : 700);
    if (restoreFocus) {
      const target = menuFocus && menuFocus.isConnected && menuFocus.getClientRects().length ? menuFocus : $('.brand', hdr);
      if (target) target.focus({ preventScroll: true });
    }
  }
  menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  d.addEventListener('keydown', e => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const items = [menuBtn, ...menuLinks()];
    const index = items.indexOf(d.activeElement);
    if (e.shiftKey && index <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && (index === -1 || index === items.length - 1)) { e.preventDefault(); items[0].focus(); }
  });
  d.addEventListener('focusin', e => {
    if (menuOpen && e.target !== menuBtn && !menu.contains(e.target)) (menuLinks()[0] || menuBtn).focus();
  });
  desktop.addEventListener('change', e => { if (e.matches) closeMenu(true, true); });

  /* ---------- Ancres ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const t = id && d.getElementById(id);
    if (!t) return;
    e.preventDefault();
    const wasOpen = menuOpen;
    closeMenu(false);
    const go = () => {
      if (lenis) lenis.scrollTo(t, { duration: 1.4 });
      else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
    };
    if (wasOpen) setTimeout(go, 80); else go();
  }));

  /* ---------- Vidéos : chargement différé, pause hors écran ---------- */
  let paused = false;
  const vids = $$('video');
  const stepOk = v => v.dataset.gated !== 'step' || v.classList.contains('is-on');
  function playVid(v) {
    if (paused) return;
    if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
  const vio = hasIO ? new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    v._vis = en.isIntersecting;
    if (en.isIntersecting) { if (stepOk(v)) playVid(v); } else v.pause();
  }), { rootMargin: '200px 0px' }) : null;
  vids.forEach(v => { v.muted = true; if (vio) vio.observe(v); else if (stepOk(v)) playVid(v); });

  /* ---------- La deuxième soirée : étapes automatiques ou au clic ---------- */
  const STEP_MS = 3200;
  const sBtns = $$('.tl button'), sMedia = $$('#soiree .sm');
  const clock = $('#clock'), sCap = $('#s-cap'), sProg = $('#s-prog');
  let cur = 0, auto = null, sVis = false, userPicked = false, hover = false;
  function tickClock(target) {
    clearInterval(clock._t);
    if (reduce || paused) { clock.textContent = target; return; }
    let f = 0;
    clock._t = setInterval(() => {
      f++;
      clock.textContent = target.replace(/\d/g, (c, i) => (f > 5 + i ? c : String((Math.random() * 10) | 0)));
      if (f > 6 + target.length) { clearInterval(clock._t); clock.textContent = target; }
    }, 40);
  }
  function runProg() {
    sProg.classList.remove('run');
    if (!auto) return;
    void sProg.offsetWidth;
    sProg.style.setProperty('--sdur', STEP_MS + 'ms');
    sProg.classList.add('run');
  }
  function setStep(i) {
    cur = i;
    sBtns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    sMedia.forEach(m => {
      const on = +m.dataset.step === i;
      m.classList.toggle('is-on', on);
      if (m.tagName === 'VIDEO') { if (on && m._vis !== false) playVid(m); else m.pause(); }
    });
    tickClock($('time', sBtns[i]).textContent);
    sCap.textContent = sBtns[i].dataset.cap;
    runProg();
  }
  function startAuto() {
    if (auto || reduce || paused || userPicked || hover || !sVis) return;
    auto = setInterval(() => setStep((cur + 1) % sBtns.length), STEP_MS);
    runProg();
  }
  function stopAuto() {
    clearInterval(auto);
    auto = null;
    sProg.classList.remove('run');
  }
  sBtns.forEach((b, i) => b.addEventListener('click', () => { userPicked = true; stopAuto(); setStep(i); }));
  const sGrid = $('.soiree-grid');
  sGrid.addEventListener('mouseenter', () => { hover = true; stopAuto(); });
  sGrid.addEventListener('mouseleave', () => { hover = false; startAuto(); });
  if (hasIO) {
    new IntersectionObserver(es => es.forEach(en => { sVis = en.isIntersecting; if (sVis) startAuto(); else stopAuto(); }), { threshold: 0.35 }).observe($('#soiree'));
  }

  /* ---------- Pause globale (vidéos, étapes) ---------- */
  const vbtn = $('#vbtn');
  let settleDemo = null;
  function setPaused(p) {
    paused = p;
    root.classList.toggle('is-paused', p);
    vbtn.setAttribute('aria-pressed', String(p));
    $('.vb-l', vbtn).textContent = p ? 'Lecture' : 'Pause';
    vbtn.setAttribute('aria-label', p ? 'Relancer les vidéos et animations' : 'Mettre en pause les vidéos et animations');
    vids.forEach(v => { if (p) v.pause(); else if (v._vis && stepOk(v)) playVid(v); });
    if (p) {
      stopAuto();
      clearInterval(clock._t);
      clock.textContent = $('time', sBtns[cur]).textContent;
      if (settleDemo) settleDemo();
    } else startAuto();
  }
  vbtn.addEventListener('click', () => setPaused(!paused));
  setPaused(reduce);

  /* ---------- En-tête, barre de progression ---------- */
  const bar = $('.progress i');
  let lastY = w.scrollY, ticking = false;
  function onScroll() {
    const y = w.scrollY, max = root.scrollHeight - w.innerHeight;
    hdr.classList.toggle('is-scrolled', y > 30);
    if (!menuOpen) {
      if (y > 420 && y > lastY + 1) hdr.classList.add('is-hidden');
      else if (y < lastY - 1 || y <= 420) hdr.classList.remove('is-hidden');
    }
    lastY = y;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  w.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  w.addEventListener('resize', onScroll);
  hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));
  onScroll();

  /* ---------- Démo de l'assistant ---------- */
  const DEMO = {
    sub: {
      prompt: 'À partir de notre fiche club, rédige la partie « projet associatif » de notre demande de subvention. Ton simple, quinze lignes maximum.',
      intro: 'Voici une première version, à relire avec votre bureau :',
      title: 'Projet associatif 2026-2027',
      text: 'Notre club accueille des pratiquants de 6 à 70 ans autour de trois priorités : rendre le sport accessible à tous, former nos jeunes éducateurs et renforcer notre présence dans le quartier. Cette saison, nous voulons ouvrir un créneau découverte le samedi matin et accompagner deux bénévoles vers un diplôme d\'encadrement.',
      chips: [['ok', 'Aucune donnée personnelle'], ['', 'À relire par le bureau']]
    },
    aff: {
      prompt: 'Propose trois accroches pour l\'affiche du match de dimanche, 15 h, au stade municipal. Ton chaleureux, public familial.',
      intro: 'Trois pistes, à adapter aux couleurs du club :',
      title: 'Affiche · Match de dimanche',
      list: ['Dimanche 15 h, tout le club au bord du terrain.', 'Venez en famille, la buvette ouvre dès 14 h.', 'Un match, un quartier, un club : on vous attend.'],
      chips: [['ok', 'Formats affiche et réseaux sociaux'], ['', 'À valider par le bureau']]
    },
    spo: {
      prompt: 'Écris un mail court pour proposer à la boulangerie du quartier de devenir partenaire du club. Trois contreparties concrètes, ton direct.',
      intro: 'Un premier jet, à personnaliser avant l\'envoi :',
      title: 'Proposition de partenariat',
      list: ['Votre logo sur l\'affiche de chaque match à domicile', 'Une publication de remerciement par mois sur nos réseaux', 'Une table réservée à votre stand lors du tournoi de fin de saison'],
      chips: [['ok', 'Contreparties réalistes'], ['', 'À relire par le trésorier']]
    },
    cr: {
      prompt: 'Remets au propre ces notes de bureau : décisions, responsables, échéances. Remplace les noms par les fonctions.',
      intro: 'Compte rendu structuré, prêt à relire :',
      title: 'Réunion de bureau · Compte rendu',
      list: ['Tournoi des jeunes : date validée, le secrétaire réserve le gymnase.', 'Subvention municipale : la trésorière prépare le budget prévisionnel.', 'Prochaine réunion : dans un mois, même horaire.'],
      chips: [['ok', 'Noms remplacés par les fonctions'], ['', 'À diffuser après relecture']]
    },
    ins: {
      prompt: 'Liste les champs d\'un formulaire d\'inscription pour la saison. Seulement ce qui est nécessaire.',
      intro: 'Une proposition sobre, qui ne collecte que l\'essentiel :',
      title: 'Inscription · Saison 2026-2027',
      list: ['Nom, prénom et date de naissance du licencié', 'Catégorie et créneau souhaités', 'Contact d\'un responsable légal pour les mineurs', 'Autorisation de prise de photos : oui ou non'],
      chips: [['ok', 'Données limitées au nécessaire'], ['', 'Prêt pour un formulaire gratuit']]
    }
  };
  const nb = s => s.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
  const tabs = $$('.demo-tabs [role="tab"]'), panel = $('#demo-panel');
  let demoKey = 'sub', runId = 0;
  settleDemo = () => { if (panel.getAttribute('aria-busy') === 'true') renderDemo(demoKey, false); };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function chipEl(c, animate) {
    const s = mk('span', 'chip' + (c[0] ? ' ' + c[0] : '') + (animate ? ' pop' : ''));
    if (c[0] === 'ok') s.innerHTML = '<svg class="ico-ck" aria-hidden="true"><use href="#check"/></svg>';
    s.appendChild(d.createTextNode(c[1]));
    return s;
  }
  async function renderDemo(k, animate) {
    animate = animate && !reduce && !paused;
    const D = DEMO[k], id = ++runId, live = () => id === runId;
    panel.setAttribute('aria-busy', 'true');
    panel.textContent = '';
    const user = mk('div', 'msg-user'), ai = mk('div', 'msg-ai');
    const intro = mk('p', 'ai-intro', nb(D.intro));
    const doc = mk('div', 'doc'), title = mk('span', 'doc-title', D.title), body = mk('div', 'doc-text');
    const chips = mk('div', 'chips');
    doc.append(title, body);
    if (!animate) {
      user.textContent = nb(D.prompt);
      if (D.text) body.appendChild(mk('p', '', nb(D.text)));
      else { const ul = mk('ul'); D.list.forEach(t => ul.appendChild(mk('li', '', nb(t)))); body.appendChild(ul); }
      D.chips.forEach(c => chips.appendChild(chipEl(c, false)));
      ai.append(intro, doc, chips);
      panel.append(user, ai);
      panel.removeAttribute('aria-busy');
      return;
    }
    const prompt = nb(D.prompt);
    user.classList.add('caret');
    panel.appendChild(user);
    const per = Math.min(16, 1500 / prompt.length);
    for (let i = 1; i <= prompt.length; i += 2) {
      if (!live()) return;
      user.textContent = prompt.slice(0, i);
      await wait(per * 2);
    }
    if (!live()) return;
    user.textContent = prompt;
    user.classList.remove('caret');
    const dots = mk('div', 'dots');
    dots.innerHTML = '<i></i><i></i><i></i>';
    panel.appendChild(dots);
    await wait(750);
    if (!live()) return;
    dots.remove();
    intro.classList.add('fade-in');
    doc.classList.add('fade-in');
    ai.append(intro, doc);
    panel.appendChild(ai);
    await wait(250);
    if (D.text) {
      const p = mk('p', 'caret');
      body.appendChild(p);
      const words = nb(D.text).split(' ');
      for (let i = 0; i < words.length; i++) {
        if (!live()) return;
        p.textContent = words.slice(0, i + 1).join(' ');
        await wait(26);
      }
      p.classList.remove('caret');
    } else {
      const ul = mk('ul');
      body.appendChild(ul);
      for (const t of D.list) {
        const li = mk('li', 'caret');
        ul.appendChild(li);
        const words = nb(t).split(' ');
        for (let i = 0; i < words.length; i++) {
          if (!live()) return;
          li.textContent = words.slice(0, i + 1).join(' ');
          await wait(30);
        }
        li.classList.remove('caret');
        await wait(120);
      }
    }
    ai.appendChild(chips);
    for (const c of D.chips) {
      if (!live()) return;
      chips.appendChild(chipEl(c, true));
      await wait(160);
    }
    panel.removeAttribute('aria-busy');
  }
  function selectTab(btn, animate) {
    tabs.forEach(t => {
      const on = t === btn;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', btn.id);
    demoKey = btn.dataset.k;
    renderDemo(demoKey, animate);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t, true));
    t.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j < 0) return;
      e.preventDefault();
      tabs[j].focus();
      selectTab(tabs[j], true);
    });
  });
  $('#replay').addEventListener('click', () => renderDemo(demoKey, true));
  if (!reduce && hasIO) {
    const dio = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { dio.disconnect(); if (!paused) renderDemo(demoKey, true); }
    }, { threshold: 0.45 });
    dio.observe($('#demo'));
  }

  /* ---------- Auto-diagnostic ---------- */
  /* Hypothèses : 15 h par dossier de subvention (45 % gagnés) plus 1 h de courriers et comptes rendus, 40 min par publication (50 %),
     4 min par mail (35 %), suivi des inscriptions selon l'outil actuel ; 4,3 semaines par mois. */
  const dForm = $('#diag-form');
  function diag() {
    const v = n => $('input[name="' + n + '"]:checked', dForm);
    const lbl = n => $('label[for="' + v(n).id + '"]', dForm).textContent;
    const admin = +v('sub').value * 15 * 0.45 / 12 + 1;
    const comm = +v('com').value * (40 / 60) * 0.5 * 4.3 + +v('mail').value * (4 / 60) * 0.35 * 4.3;
    const tools = +v('ins').value;
    const h = Math.max(1, Math.round(admin + comm + tools));
    const prio = admin >= comm && admin >= tools ? "L'administratif" : comm >= tools ? 'La communication' : 'Les outils sans code';
    $('#d-h').textContent = h;
    $('#d-prio').textContent = prio;
    const body = 'Bonjour,\n\nNotre auto-diagnostic FAIR : environ ' + h + ' h récupérables par mois. Thème prioritaire : ' + prio + '.\n' +
      '(Subventions par an : ' + lbl('sub') + ' · Publications par semaine : ' + lbl('com') + ' · Mails par semaine : ' + lbl('mail') + ' · Inscriptions : ' + lbl('ins').toLowerCase() + ')\n\n' +
      'Je suis [votre rôle] au club [nom du club], à [ville].\nSport : [discipline] · Bénévoles actifs : [nombre]\n\nMerci et à bientôt,\n[prénom, nom, téléphone]';
    $('#d-cta').href = 'mailto:contact@fairassociation.fr?subject=' + encodeURIComponent('Demande d\'atelier FAIR') + '&body=' + encodeURIComponent(body);
  }
  dForm.addEventListener('change', diag);
  dForm.addEventListener('submit', e => e.preventDefault());
  diag();

  /* ---------- Copier ---------- */
  $$('.copy').forEach(b => {
    const label = b.textContent;
    b.addEventListener('click', () => {
      const el = d.getElementById(b.dataset.target);
      const done = () => {
        b.textContent = 'Copié';
        b.setAttribute('data-done', '');
        setTimeout(() => { b.textContent = label; b.removeAttribute('data-done'); }, 1800);
      };
      const fallback = () => {
        try {
          const r = d.createRange(); r.selectNodeContents(el);
          const s = w.getSelection(); s.removeAllRanges(); s.addRange(r);
          b.textContent = 'Texte sélectionné';
          setTimeout(() => { b.textContent = label; }, 2200);
        } catch (err) { /* sélection impossible */ }
      };
      try { navigator.clipboard.writeText(el.innerText).then(done, fallback); } catch (err) { fallback(); }
    });
  });

  /* ---------- Animations au défilement ---------- */
  if (!G) return;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-title, .hero-row, .hero-visual', { y: 18, duration: 0.8, ease: 'power2.out', stagger: 0.08, delay: 0.1 });
    $$('[data-rise]').forEach(el => gsap.from(el, { y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    gsap.fromTo('.steps-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 85%', end: 'bottom 55%', scrub: true } });
    gsap.fromTo('.r-fill', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.ap-head', start: 'top 85%', end: 'bottom 40%', scrub: true } });
  });
  w.addEventListener('load', () => ScrollTrigger.refresh());
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => ScrollTrigger.refresh());
})();
