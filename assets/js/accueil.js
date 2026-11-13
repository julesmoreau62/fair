/* FAIR · Accueil (refonte). Sans dépendance obligatoire : Lenis est utilisé s'il est chargé. */
(function () {
  'use strict';
  const d = document, root = d.documentElement;
  const $ = (s, c) => (c || d).querySelector(s), $$ = (s, c) => Array.from((c || d).querySelectorAll(s));
  const mk = (t, c, x) => { const e = d.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let paused = reduce;
  root.classList.add('js');

  /* ---------- Défilement doux ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.11 });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch (e) { lenis = null; }
  }
  d.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(t, { offset: t.id === 'top' ? 0 : -70 });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });

  /* ---------- Menu ---------- */
  const menu = $('#menu'), menuBtn = $('#menu-btn');
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    root.classList.remove('menu-open');
    if (lenis) lenis.start();
  }
  menuBtn.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    root.classList.add('menu-open');
    if (lenis) lenis.stop();
    const first = $('a', menu);
    if (first) first.focus({ preventScroll: true });
  });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuBtn.focus(); } });
  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Vidéos ---------- */
  const load = v => { if (!v.src && v.dataset.src) v.src = v.dataset.src; };
  const play = v => { if (paused) return; load(v); const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const heroVids = $$('.hv');
  let heroI = 0, heroTimer = 0;
  function heroNext() {
    const next = heroVids[(heroI + 1) % heroVids.length];
    load(next);
    const swap = () => {
      heroVids[heroI].classList.remove('is-on');
      const old = heroVids[heroI];
      setTimeout(() => old.pause(), 1700);
      heroI = (heroI + 1) % heroVids.length;
      next.currentTime = 0;
      next.classList.add('is-on');
      play(next);
    };
    if (next.readyState >= 2) swap(); else next.addEventListener('canplay', swap, { once: true });
  }
  function heroStart() {
    heroVids.forEach(v => { v.loop = true; });
    play(heroVids[0]);
    clearInterval(heroTimer);
    heroTimer = setInterval(() => { if (!paused && !d.hidden && scrollY < innerHeight) heroNext(); }, 8000);
  }
  const autoVids = $$('video[data-auto], .tl-media video');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      e.target._vis = e.isIntersecting;
      if (e.isIntersecting) play(e.target); else e.target.pause();
    }), { rootMargin: '100px' });
    autoVids.forEach(v => vio.observe(v));
  }
  const vbtn = $('#vbtn'), vbtnL = $('#vbtn-l');
  function setPaused(p) {
    paused = p;
    root.classList.toggle('paused', p);
    vbtn.setAttribute('aria-pressed', String(p));
    vbtnL.textContent = p ? 'Relancer les vidéos et animations' : 'Mettre en pause les vidéos et animations';
    if (p) $$('video').forEach(v => v.pause());
    else { play(heroVids[heroI]); autoVids.forEach(v => { if (v._vis) play(v); }); }
  }
  vbtn.addEventListener('click', () => setPaused(!paused));
  setPaused(paused);
  if (!paused) heroStart();

  /* ---------- Bandes défilantes ---------- */
  $$('[data-mq] .mq-track').forEach(tr => {
    if (reduce) return;
    Array.from(tr.children).forEach(li => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      const v = $('video', c);
      if (v) { v.removeAttribute('data-auto'); v.removeAttribute('data-src'); }
      tr.appendChild(c);
    });
  });
  const peek = $('#peek'), peekImg = $('img', peek), words = $('.words');
  if (peek && words && matchMedia('(hover:hover)').matches) {
    words.addEventListener('mouseover', e => {
      const li = e.target.closest('li[data-img]');
      if (!li) return;
      peekImg.src = 'assets/img/sports/' + li.dataset.img + '.jpg';
      peek.classList.add('is-on');
    });
    words.addEventListener('mousemove', e => { peek.style.left = e.clientX + 'px'; peek.style.top = (e.clientY - 150) + 'px'; });
    words.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
  }

  /* ---------- Apparitions ---------- */
  const rises = $$('[data-rise]');
  if ('IntersectionObserver' in window && !reduce) {
    const rio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const sib = Array.from(e.target.parentNode.children).filter(x => x.hasAttribute('data-rise'));
      e.target.style.setProperty('--d', (sib.indexOf(e.target) * 0.08) + 's');
      e.target.classList.add('in');
      rio.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    rises.forEach(r => rio.observe(r));
  } else rises.forEach(r => r.classList.add('in'));

  /* ---------- Titre mot à mot ---------- */
  const wordsEl = $('[data-words]');
  let wordSpans = [];
  if (wordsEl && !reduce) {
    const txt = wordsEl.textContent.trim().split(/\s+/);
    wordsEl.setAttribute('aria-label', txt.join(' '));
    wordsEl.textContent = '';
    wordsEl.classList.add('split');
    txt.forEach((w, i) => {
      const s = mk('span', 'w', w);
      s.setAttribute('aria-hidden', 'true');
      wordsEl.appendChild(s);
      if (i < txt.length - 1) wordsEl.appendChild(d.createTextNode(' '));
    });
    wordSpans = $$('.w', wordsEl);
  }

  /* ---------- Thèmes (accordéon) ---------- */
  const themes = $$('.theme');
  function setTheme(t) {
    themes.forEach(x => {
      const on = x === t;
      x.classList.toggle('is-on', on);
      $('button', x).setAttribute('aria-expanded', String(on));
    });
    sizeThemes();
  }
  function sizeThemes() {
    themes.forEach(x => x.style.setProperty('--bh', ($('.theme-b', x).offsetHeight + 4) + 'px'));
  }
  themes.forEach(t => {
    $('button', t).addEventListener('click', () => setTheme(t));
    t.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover) and (min-width:761px)').matches) setTheme(t); });
  });
  addEventListener('resize', sizeThemes);
  addEventListener('load', sizeThemes);
  sizeThemes();

  /* ---------- Tableau d'affichage + soirée + mots : tout suit le défilement ---------- */
  const board = $('#board'), bP = $('#b-p'), bT = $('#b-t'), bClock = $('#b-clock'), bPhase = $('#b-phase');
  const goal = $('#goal'), goalT = $('#goal-t');
  const markers = $$('[data-score],[data-phase]');
  const steps = $$('.tl li'), medias = $$('.tm'), clock = $('#clock');
  let score = [0, 0], stepI = 0, goalTimer = 0, ticking = false;
  function showGoal(text, pap) {
    goalT.textContent = text;
    goal.classList.toggle('pap', pap);
    goal.classList.add('is-on');
    clearTimeout(goalTimer);
    goalTimer = setTimeout(() => goal.classList.remove('is-on'), 2600);
  }
  function setStep(i) {
    if (i === stepI) return;
    stepI = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    medias.forEach((m, k) => m.classList.toggle('is-on', k === i));
    clock.textContent = steps[i].dataset.time;
  }
  function update() {
    ticking = false;
    const y = scrollY, vh = innerHeight, max = Math.max(1, d.body.scrollHeight - vh);
    root.classList.toggle('scrolled', y > vh * 0.55);
    board.classList.toggle('is-hero', y < 40);

    let s = [0, 0], phase = "Coup d'envoi", text = '', last = null;
    for (const m of markers) {
      if (m.getBoundingClientRect().top > vh * 0.62) break;
      last = m;
      if (m.dataset.phase) phase = m.dataset.phase;
      if (m.dataset.score) { s = m.dataset.score.split(',').map(Number); text = m.dataset.goal || ''; }
    }
    const final = last && last.id === 'contact';
    bPhase.textContent = phase;
    bClock.textContent = final ? "90'" : String(Math.min(89, Math.round(y / max * 90))).padStart(2, '0') + "'";
    if (s[0] !== score[0] || s[1] !== score[1]) {
      const up = s[0] + s[1] > score[0] + score[1], pap = s[0] > score[0];
      bP.textContent = s[0]; bT.textContent = s[1];
      if (up && !reduce) {
        const el = pap ? bP : bT;
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
        if (text) showGoal(text, pap);
      }
      score = s;
    }

    if (steps.length) {
      let best = 0, bd = Infinity;
      steps.forEach((li, i) => {
        const r = li.getBoundingClientRect(), dist = Math.abs(r.top + r.height / 2 - vh * 0.58);
        if (dist < bd) { bd = dist; best = i; }
      });
      setStep(best);
    }
    if (wordSpans.length) {
      const r = wordsEl.getBoundingClientRect();
      const p = clamp((vh * 0.92 - r.top) / (vh * 0.55), 0, 1) * (wordSpans.length + 1);
      wordSpans.forEach((w, i) => w.style.setProperty('--o', clamp(p - i, 0.14, 1).toFixed(2)));
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();

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
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const chipEl = c => mk('span', 'chip' + (c[0] ? ' ' + c[0] : ''), c[1]);
  async function typeWords(el, text, ms, live) {
    const w = nb(text).split(' ');
    el.classList.add('caret');
    for (let i = 0; i < w.length; i++) {
      if (!live()) return false;
      el.textContent = w.slice(0, i + 1).join(' ');
      await wait(ms);
    }
    el.classList.remove('caret');
    return true;
  }
  async function renderDemo(k, animate) {
    animate = animate && !reduce && !paused;
    const D = DEMO[k], id = ++runId, live = () => id === runId;
    panel.setAttribute('aria-busy', 'true');
    panel.textContent = '';
    const user = mk('div', 'msg-user'), ai = mk('div', 'msg-ai');
    const intro = mk('p', 'ai-intro', nb(D.intro));
    const doc = mk('div', 'doc'), body = mk('div', 'doc-text'), chips = mk('div', 'chips');
    doc.append(mk('span', 'doc-title', D.title), body);
    if (!animate) {
      user.textContent = nb(D.prompt);
      if (D.text) body.appendChild(mk('p', '', nb(D.text)));
      else { const ul = mk('ul'); D.list.forEach(t => ul.appendChild(mk('li', '', nb(t)))); body.appendChild(ul); }
      D.chips.forEach(c => chips.appendChild(chipEl(c)));
      ai.append(intro, doc, chips);
      panel.append(user, ai);
      panel.removeAttribute('aria-busy');
      return;
    }
    panel.appendChild(user);
    if (!await typeWords(user, D.prompt, 34, live)) return;
    const dots = mk('div', 'dots');
    dots.innerHTML = '<i></i><i></i><i></i>';
    panel.appendChild(dots);
    await wait(700);
    if (!live()) return;
    dots.remove();
    ai.append(intro, doc);
    panel.appendChild(ai);
    if (D.text) {
      const p = mk('p');
      body.appendChild(p);
      if (!await typeWords(p, D.text, 26, live)) return;
    } else {
      const ul = mk('ul');
      body.appendChild(ul);
      for (const t of D.list) {
        const li = mk('li');
        ul.appendChild(li);
        if (!await typeWords(li, t, 30, live)) return;
      }
    }
    ai.appendChild(chips);
    for (const c of D.chips) {
      if (!live()) return;
      chips.appendChild(chipEl(c));
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
  if (!reduce && 'IntersectionObserver' in window) {
    const dio = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { dio.disconnect(); renderDemo(demoKey, true); }
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
    b.addEventListener('click', async () => {
      const text = $('#' + b.dataset.target).textContent;
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const ta = mk('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        d.body.appendChild(ta); ta.select();
        try { d.execCommand('copy'); } catch (e2) {}
        ta.remove();
      }
      b.textContent = 'Copié'; b.classList.add('done');
      setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1800);
    });
  });
})();
