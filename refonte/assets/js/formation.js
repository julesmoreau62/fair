// Formation FAIR · comportements communs : onglets, copie, check-lists, progression
var FAIR=(function(){
  // Les modules du niveau 0 : clé de la check-list et nombre de cases
  var MODULES=[
    {key:'fair-module1',n:7,url:'formation-1.html',name:'Créer ses comptes'},
    {key:'fair-module2',n:6,url:'formation-2.html',name:'Bien demander'},
    {key:'fair-module3',n:6,url:'formation-3.html',name:"L'IA sans risque"},
    {key:'fair-module4',n:6,url:'formation-4.html',name:'Fichiers, photos, voix'},
    {key:'fair-module5',n:6,url:'formation-5.html',name:'Mon premier dossier'}
  ];
  // Les modules du niveau 1, même principe (blocs .st[data-lv="1"])
  var N1=[
    {key:'fair-n1-module1',n:9,url:'formation-n1-1.html',name:'Écrire aux adhérents'},
    {key:'fair-n1-module2',n:9,url:'formation-n1-2.html',name:'Réseaux et affiches'},
    {key:'fair-n1-module3',n:9,url:'formation-n1-3.html',name:'Réunions et AG'},
    {key:'fair-n1-module4',n:9,url:'formation-n1-4.html',name:'Préparer ses séances'},
    {key:'fair-n1-module5',n:8,url:'formation-n1-5.html',name:'La rentrée du club'}
  ];

  // Mémoire sur l'appareil, sans planter si le stockage est bloqué
  function store(k,v){
    try{
      if(v===undefined)return JSON.parse(localStorage.getItem(k))||{};
      localStorage.setItem(k,JSON.stringify(v));
    }catch(e){return {}}
  }

  // Copier un texte, avec repli si le presse-papiers est indisponible
  function copy(btn,el,txt){
    var label=btn.dataset.label||(btn.dataset.label=btn.textContent);
    function ok(){btn.textContent='Copié';setTimeout(function(){btn.textContent=label},1800)}
    function fallback(){
      var r=document.createRange();r.selectNodeContents(el);
      var s=getSelection();s.removeAllRanges();s.addRange(r);
      try{document.execCommand('copy');ok()}catch(e){btn.textContent='Sélectionné, faites Ctrl+C'}
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,fallback)}else{fallback()}
  }

  // Nombre de cases cochées d'un module
  function count(key){
    var s=store(key);
    return Object.keys(s).filter(function(k){return s[k]===true}).length;
  }
  function done(m){return count(m.key)>=m.n}

  // Affiche l'état de chaque module dans les blocs .st[data-m]
  function progress(){
    [].forEach.call(document.querySelectorAll('.st[data-m]'),function(st){
      var m=(st.dataset.lv==='1'?N1:MODULES)[+st.dataset.m-1],n=count(m.key);
      st.textContent=n>=m.n?'Validé':n?n+' sur '+m.n+' cochés':'Pas commencé';
      st.classList.toggle('done',n>=m.n);
    });
    document.dispatchEvent(new CustomEvent('fair:progress'));
  }

  // Onglets accessibles : flèches gauche / droite
  [].forEach.call(document.querySelectorAll('[role="tablist"]'),function(list){
    var tabs=[].slice.call(list.querySelectorAll('[role="tab"]'));
    function pick(t,focus){
      tabs.forEach(function(x){
        var on=x===t;
        x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
        document.getElementById(x.getAttribute('aria-controls')).hidden=!on;
      });
      if(focus)t.focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){pick(t)});
      t.addEventListener('keydown',function(e){
        var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
        if(d){e.preventDefault();pick(tabs[(i+d+tabs.length)%tabs.length],true)}
      });
    });
  });

  // Boutons [data-copy] : copient le texte (q ou pre) de leur bloc
  [].forEach.call(document.querySelectorAll('[data-copy]'),function(btn){
    var el=btn.closest('li,.card,.prompt').querySelector('q,pre');
    btn.addEventListener('click',function(){copy(btn,el,el.textContent)});
  });

  // La fiche du club, si elle existe, remplace « [Fiche du club] » dans les bibliothèques et les pre[data-club]
  var fiche=club();
  if(fiche)[].forEach.call(document.querySelectorAll('.lib pre,pre[data-club]'),function(p){
    if(p.textContent.indexOf('[Fiche du club]')>-1)p.innerHTML=green(p.textContent.replace('[Fiche du club]',fiche));
  });

  // Filtres de bibliothèque : <div class="filters" data-for="id"> + <button class="chip" data-filter="cat|all">
  // les cartes de #id portent data-cat="cat1 cat2"
  [].forEach.call(document.querySelectorAll('.filters[data-for]'),function(bar){
    var chips=[].slice.call(bar.querySelectorAll('[data-filter]'));
    var cards=[].slice.call(document.getElementById(bar.dataset.for).querySelectorAll('[data-cat]'));
    chips.forEach(function(c){
      c.setAttribute('aria-pressed',c.dataset.filter==='all');
      c.addEventListener('click',function(){
        var f=c.dataset.filter;
        chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
        cards.forEach(function(k){k.hidden=f!=='all'&&(' '+k.dataset.cat+' ').indexOf(' '+f+' ')<0});
      });
    });
  });

  // Repérez les erreurs : <div class="spot"> avec des <button class="s" data-err="explication">
  // (sans data-err : phrase correcte), un bouton .spot-go et un <p class="spot-res">
  [].forEach.call(document.querySelectorAll('.spot'),function(sp){
    var bits=[].slice.call(sp.querySelectorAll('button.s'));
    var res=sp.querySelector('.spot-res');
    var errs=bits.filter(function(b){return b.dataset.err}).length;
    bits.forEach(function(b){
      b.type='button';b.setAttribute('aria-pressed','false');
      b.addEventListener('click',function(){
        if(sp.classList.contains('shown'))return;
        b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');
      });
    });
    sp.querySelector('.spot-go').addEventListener('click',function(){
      var found=0,wrong=0;
      bits.forEach(function(b){
        var on=b.getAttribute('aria-pressed')==='true';
        if(b.dataset.err){
          if(on)found++;
          b.classList.add(on?'hit':'miss');
          var n=document.createElement('span');n.className='s-why';n.textContent=b.dataset.err;
          if(!b.nextElementSibling||!b.nextElementSibling.classList.contains('s-why'))b.after(n);
        }else if(on){wrong++;b.classList.add('false')}
      });
      sp.classList.add('shown');
      sp.querySelector('.spot-go').hidden=true;
      res.textContent=found+' erreur'+(found>1?'s':'')+' trouvée'+(found>1?'s':'')+' sur '+errs+(wrong?' · '+wrong+' phrase'+(wrong>1?'s':'')+' correcte'+(wrong>1?'s':'')+' signalée'+(wrong>1?'s':'')+' à tort':'')+(found===errs&&!wrong?' · Sans faute, bravo !':' · Les explications sont dans le texte.');
    });
  });

  // Check-list de fin : <div class="check" id="check" data-key="…" data-name="Module N">
  // (l'icône SVG <symbol id="check"> partage cet id : on cible le bloc qui porte data-key)
  var check=document.querySelector('#check[data-key]');
  if(check){
    var boxes=[].slice.call(check.querySelectorAll('input'));
    var score=document.getElementById('score');
    var saved=store(check.dataset.key);
    var update=function(){
      var n=boxes.filter(function(b){return b.checked}).length;
      score.textContent=n===boxes.length?n+' sur '+n+' · '+check.dataset.name+' validé, bravo !':n+' sur '+boxes.length;
      score.classList.toggle('done',n===boxes.length);
      progress();
    };
    boxes.forEach(function(b){
      b.checked=saved[b.dataset.k]===true;
      b.addEventListener('change',function(){
        saved[b.dataset.k]=b.checked;
        store(check.dataset.key,saved);
        update();
      });
    });
    update();
  }else{
    progress();
  }

  // Échappe le texte, et affiche en vert les passages entre crochets
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function green(s){return esc(s).replace(/\[[^\]]+\]/g,function(m){return '<i>'+m+'</i>'})}

  // La fiche du club (niveau 1, module 1) : réutilisée en tête des demandes des autres modules
  function club(){
    var v=store('fair-n1-club'),t=[];
    if(v.role||v.club||v.sport){
      var s='Je suis '+(v.role||'[rôle]')+(v.club?' du club '+v.club+(v.sport||v.taille?', un club':''):' dans un club');
      s+=(v.sport?' de '+v.sport:'')+(v.taille?' de '+v.taille+' licenciés':'')+(v.lieu?', à '+v.lieu:'');
      t.push(s+'.');
    }
    if(v.publics)t.push('Nos adhérents : '+v.publics+'.');
    if(v.ton)t.push('Notre façon d\'écrire : '+v.ton+'.');
    if(v.adresse)t.push(v.adresse+'.');
    if(v.emoji)t.push(v.emoji+'.');
    if(v.eviter)t.push('À éviter : '+v.eviter+'.');
    if(v.signature)t.push('Signature : '+v.signature+'.');
    return t.join(' ');
  }

  // Générateur de demande : champs [data-f] dans root, rendu dans root pre[data-out]
  // render(v) renvoie le texte de la demande ; les champs sont gardés sous key
  function builder(root,key,render){
    var fields=[].slice.call(root.querySelectorAll('[data-f]'));
    var out=root.querySelector('pre[data-out]');
    var saved=store(key);
    function read(){
      var v={};
      fields.forEach(function(f){
        if(f.type==='radio'){if(f.checked)v[f.dataset.f]=f.value}
        else if(f.type==='checkbox'){v[f.dataset.f]=v[f.dataset.f]||[];if(f.checked)v[f.dataset.f].push(f.value)}
        else v[f.dataset.f]=f.value.trim();
      });
      return v;
    }
    function paint(save){
      var v=read();
      if(save)store(key,v);
      out.innerHTML=green(render(v));
    }
    fields.forEach(function(f){
      var s=saved[f.dataset.f];
      if(s!==undefined){
        if(f.type==='radio')f.checked=f.value===s;
        else if(f.type==='checkbox')f.checked=[].concat(s).indexOf(f.value)>-1;
        else f.value=s;
      }
      f.addEventListener(f.tagName==='SELECT'||f.type==='radio'||f.type==='checkbox'?'change':'input',function(){paint(true)});
    });
    paint();
    return {paint:paint,read:read};
  }

  // Quiz : QUIZ = [[question, [réponses], index de la bonne, explication], …]
  // Le meilleur score est gardé sous key ; à la réussite, coche la case data-k="quiz" de la check-list
  function quiz(form,key,QUIZ,pass,after){
    var res=document.getElementById(form.id+'-res');
    QUIZ.forEach(function(q,i){
      var fs=document.createElement('fieldset');fs.className='q';
      var lg=document.createElement('legend');
      var num=document.createElement('span');num.textContent=(i+1<10?'0':'')+(i+1);
      lg.appendChild(num);lg.appendChild(document.createTextNode(q[0]));fs.appendChild(lg);
      q[1].forEach(function(a,j){
        var l=document.createElement('label');
        var r=document.createElement('input');r.type='radio';r.name=form.id+'-'+i;r.value=j;
        l.appendChild(r);l.appendChild(document.createTextNode(a));fs.appendChild(l);
      });
      var why=document.createElement('p');why.className='why';why.hidden=true;why.textContent=q[3];fs.appendChild(why);
      form.appendChild(fs);
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var good=0,missing=0;
      QUIZ.forEach(function(q,i){
        var fs=form.children[i];
        var pick=form.querySelector('[name="'+form.id+'-'+i+'"]:checked');
        if(!pick){missing++;return}
        fs.classList.add('graded');
        [].forEach.call(fs.querySelectorAll('label'),function(l,j){
          l.classList.toggle('right',j===q[2]);
          l.classList.toggle('wrong',j===+pick.value&&j!==q[2]);
        });
        fs.querySelector('.why').hidden=false;
        if(+pick.value===q[2])good++;
      });
      if(missing){res.className='quiz-res ko';res.textContent='Il reste '+missing+(missing>1?' questions':' question')+' sans réponse.';return}
      var best=Math.max(good,store(key).best||0);
      store(key,{best:best});
      res.className='quiz-res '+(good>=pass?'ok':'ko');
      res.textContent=good+' sur '+QUIZ.length+' · '+(good>=pass?'Quiz réussi !':'Il en faut '+pass+' : relisez les explications et recommencez.');
      var box=good>=pass&&document.querySelector('#check[data-key] input[data-k="quiz"]');
      if(box&&!box.checked){box.checked=true;box.dispatchEvent(new Event('change'))}
      if(after)after(good);
    });
    var again=document.getElementById(form.id+'-reset');
    if(again)again.addEventListener('click',function(){
      form.reset();res.textContent='';
      [].forEach.call(form.children,function(fs){
        fs.classList.remove('graded');
        fs.querySelector('.why').hidden=true;
        [].forEach.call(fs.querySelectorAll('label'),function(l){l.classList.remove('right','wrong')});
      });
      form.scrollIntoView({block:'start'});
    });
  }

  return {store:store,copy:copy,count:count,done:done,progress:progress,esc:esc,green:green,club:club,builder:builder,quiz:quiz,MODULES:MODULES,N1:N1};
})();
