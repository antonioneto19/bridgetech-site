/* ============================================================
   BRIDGE — shared interactions
   ============================================================ */
(function(){
  'use strict';

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if(!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------- mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if(toggle && menu){
    toggle.addEventListener('click', ()=>{
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
      menu.classList.remove('open'); document.body.style.overflow='';
    }));
  }

  /* ---------- reveal on scroll (IO + scroll fallback) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const showInView = ()=>{
    const vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(el=>{
      if(el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if(r.top < vh*0.92 && r.bottom > 0) el.classList.add('in');
    });
  };
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
    reveals.forEach(el=>io.observe(el));
  }
  showInView();
  window.addEventListener('scroll', showInView, {passive:true});
  window.addEventListener('load', showInView);
  window.addEventListener('resize', showInView, {passive:true});
  setTimeout(showInView, 200);
  setTimeout(showInView, 700);

  /* ---------- count-up stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el)=>{
    if(el.dataset.counted) return; el.dataset.counted = '1';
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.dec|0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 1500; const start = performance.now();
    const tick = (now)=>{
      const p = Math.min((now-start)/dur, 1);
      const eased = 1-Math.pow(1-p,3);
      const val = (target*eased);
      el.textContent = prefix + val.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix;
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix;
    };
    requestAnimationFrame(tick);
  };
  const checkCounters = ()=>{
    const vh = window.innerHeight || document.documentElement.clientHeight;
    counters.forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < vh*0.9 && r.bottom > 0) runCounter(el);
    });
  };
  checkCounters();
  window.addEventListener('scroll', checkCounters, {passive:true});
  setTimeout(checkCounters, 400);

  /* ---------- command center: live animation ---------- */
  const cc = document.getElementById('command-center');
  if(cc){
    // animated counters that fluctuate
    const metrics = cc.querySelectorAll('[data-live]');
    const baseVals = new Map();
    metrics.forEach(m=>baseVals.set(m, parseFloat(m.dataset.live)));
    let mounted = true;
    if('IntersectionObserver' in window){
      const ccio = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ mounted = e.isIntersecting; });
      },{threshold:.15});
      ccio.observe(cc);
    }

    setInterval(()=>{
      if(!mounted) return;
      metrics.forEach(m=>{
        const base = baseVals.get(m);
        const jitter = base * (0.004 + Math.random()*0.01) * (Math.random()>.5?1:-1);
        const v = Math.max(0, base + jitter);
        const dec = (m.dataset.dec|0);
        const suffix = m.dataset.suffix||'';
        m.textContent = v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix;
      });
    }, 2200);

    // log feed
    const feed = cc.querySelector('.cc-feed');
    if(feed){
      const events = [
        ['ok','Agente · triagem de e-mails concluída','agora'],
        ['run','Pipeline de visão computacional processando lote','12s'],
        ['ok','Integração ERP ↔ CRM sincronizada','38s'],
        ['ai','Modelo classificou 1.204 documentos','1m'],
        ['ok','Automação de NF-e executada','2m'],
        ['run','Roteamento inteligente de chamados ativo','3m'],
        ['ai','Resumo executivo gerado para diretoria','4m'],
        ['ok','Webhook de pagamento conciliado','5m'],
      ];
      let idx = 0;
      const colorFor = t => t==='ok'?'#34d399':t==='ai'?'#00E5FF':'#fbbf24';
      const labelFor = t => t==='ok'?'OK':t==='ai'?'IA':'RUN';
      const addRow = ()=>{
        if(!mounted){ return; }
        const [type,text,time] = events[idx % events.length];
        idx++;
        const row = document.createElement('div');
        row.className='cc-row';
        row.innerHTML = `<span class="cc-tag" style="color:${colorFor(type)};border-color:${colorFor(type)}33;background:${colorFor(type)}14">${labelFor(type)}</span>`+
                        `<span class="cc-txt">${text}</span><span class="cc-time">${time}</span>`;
        feed.prepend(row);
        requestAnimationFrame(()=>row.classList.add('show'));
        while(feed.children.length>5) feed.removeChild(feed.lastChild);
      };
      addRow();addRow();addRow();
      setInterval(addRow, 2600);
    }

    // network pulse: animate packets along links
    const pulses = cc.querySelectorAll('.cc-pulse');
    pulses.forEach((p,i)=>{ p.style.animationDelay = (i*0.7)+'s'; });
  }

  /* ---------- live integration dashboard ---------- */
  const dash = document.getElementById('integration-dash');
  if(dash){
    let active = true;
    if('IntersectionObserver' in window){
      const dio = new IntersectionObserver((es)=>{es.forEach(e=>active=e.isIntersecting);},{threshold:.1});
      dio.observe(dash);
    }

    // clock
    const clockEl = dash.querySelector('[data-clock]');
    const tickClock = ()=>{ if(clockEl) clockEl.textContent = new Date().toLocaleTimeString('pt-BR',{hour12:false}); };
    tickClock(); setInterval(tickClock, 1000);

    // KPI jitter
    const kpis = dash.querySelectorAll('[data-live]');
    const base = new Map(); kpis.forEach(k=>base.set(k, parseFloat(k.dataset.live)));
    setInterval(()=>{
      if(!active) return;
      kpis.forEach(k=>{
        const b = base.get(k);
        const j = b * (0.003 + Math.random()*0.012) * (Math.random()>.5?1:-1);
        const v = Math.max(0, b + j);
        const dec = (k.dataset.dec|0), suf = k.dataset.suffix||'';
        k.textContent = v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suf;
      });
    }, 2000);

    // rolling area chart
    const area = dash.querySelector('.idash-area');
    const stroke = dash.querySelector('.idash-stroke');
    const dot = dash.querySelector('.idash-head-dot');
    const curEl = dash.querySelector('[data-chartcur]');
    const W=600,H=200,N=42;
    let val=120, data=[];
    for(let i=0;i<N;i++){ val += (Math.random()-0.5)*22; val=Math.max(40,Math.min(180,val)); data.push(val); }
    const toXY = (v,i)=>{ const x=(i/(N-1))*W; const y=H-8-((v-30)/165)*(H-30); return [x, Math.max(6,Math.min(H-4,y))]; };
    const render = ()=>{
      let line='', last=[0,0];
      data.forEach((v,i)=>{ const [x,y]=toXY(v,i); line += (i? 'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '; last=[x,y]; });
      stroke.setAttribute('d', line.trim());
      area.setAttribute('d', line.trim()+`L${W} ${H} L0 ${H} Z`);
      if(dot){ dot.setAttribute('cx',last[0]); dot.setAttribute('cy',last[1]); }
      if(curEl){ const ev = Math.round(1500 + data[N-1]*9); curEl.textContent = ev.toLocaleString('pt-BR'); }
    };
    render();
    setInterval(()=>{
      if(!active) return;
      val += (Math.random()-0.5)*26; val=Math.max(45,Math.min(178,val));
      data.push(val); data.shift(); render();
    }, 1400);

    // system bars
    const bars = dash.querySelectorAll('.sys-bar i');
    const pulseBars = ()=>{ if(!active) return; bars.forEach(b=>{ b.style.width = (55+Math.random()*42).toFixed(0)+'%'; }); };
    pulseBars(); setInterval(pulseBars, 1800);

    // event ticker
    const rows = dash.querySelector('.idash-rows');
    if(rows){
      const evs = [
        ['ERP','pedido sincronizado'],['CRM','lead atualizado'],['WA','mensagem roteada'],
        ['NF-e','nota processada'],['DB','registro gravado'],['API','requisição ok'],
        ['BI','indicador recalculado'],['IA','documento classificado'],['ERP','estoque conciliado'],
      ];
      let i=0;
      const add=()=>{
        if(!active) return;
        const [tag,txt]=evs[i%evs.length]; i++;
        const el=document.createElement('span');
        el.className='idash-ev';
        el.innerHTML=`<span class="ev-dot"></span><b>${tag}</b> ${txt}`;
        rows.prepend(el);
        requestAnimationFrame(()=>el.classList.add('show'));
        while(rows.children.length>7) rows.removeChild(rows.lastChild);
      };
      for(let k=0;k<6;k++) add();
      setInterval(add, 1700);
    }
  }

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent = new Date().getFullYear());

  /* ---------- cookie / LGPD consent banner ---------- */
  try{
    if(!localStorage.getItem('bridge_cookie_ok')){
      const b=document.createElement('div');
      b.className='cookie-banner';
      b.setAttribute('role','dialog');
      b.setAttribute('aria-label','Aviso de cookies e privacidade');
      b.innerHTML='<p>Utilizamos cookies essenciais para melhorar a sua experiência de navegação. Ao continuar, você concorda com o uso de cookies. Respeitamos a sua privacidade de acordo com a <strong>LGPD</strong> (Lei nº 13.709/2018). <a href="privacidade.html" style="color:#7fe6ff;text-decoration:underline">Política de Privacidade</a>.</p>'+
        '<div class="ck-actions"><button type="button" class="btn btn-primary" data-cookie-accept>Aceitar</button></div>';
      document.body.appendChild(b);
      requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.add('show')));
      b.querySelector('[data-cookie-accept]').addEventListener('click',()=>{
        try{ localStorage.setItem('bridge_cookie_ok','1'); }catch(e){}
        b.classList.remove('show');
        setTimeout(()=>b.remove(),520);
      });
    }
  }catch(e){}
})();
