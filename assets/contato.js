(function(){
  // Chave Web3Forms e utilitários ficam em assets/forms-comum.js (carregado antes deste arquivo).
  var BF = window.BridgeForms || {};
  var WEB3FORMS_ACCESS_KEY = BF.accessKey || '';
  var WHATS = BF.whatsapp || '5581971181007';
  var agora = BF.isoSaoPaulo || function(){ return new Date().toISOString(); };
  var f=document.getElementById('contactForm'),note=document.getElementById('formNote');
  if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    // honeypot anti-spam: se um bot preencher o campo oculto, abortamos em silêncio
    if(f.botcheck && f.botcheck.checked){ return; }
    var nome=f.nome.value.trim(),email=f.email.value.trim(),msg=f.msg.value.trim();
    note.className='form-note';
    if(!nome||!email||!msg){note.textContent='Preencha nome, e-mail e mensagem.';note.classList.add('err');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){note.textContent='Informe um e-mail válido.';note.classList.add('err');return;}
    if(f.consent && !f.consent.checked){note.textContent='É preciso aceitar o tratamento de dados (LGPD).';note.classList.add('err');return;}

    // Newsletter Ponte IA: caixa separada, opcional e desmarcada por padrão.
    var querNewsletter = !!(f.newsletter && f.newsletter.checked);

    // Fallback enquanto não há chave de e-mail configurada: envia pelo WhatsApp
    if(!WEB3FORMS_ACCESS_KEY){
      var txt='Olá! Sou '+nome+(f.empresa.value?' ('+f.empresa.value+')':'')+'. Interesse: '+f.interesse.value+'. '+msg;
      note.textContent='Redirecionando para o WhatsApp...';note.classList.add('ok');
      window.open('https://wa.me/'+WHATS+'?text='+encodeURIComponent(txt),'_blank','noopener');
      setTimeout(function(){f.reset();},800);
      return;
    }

    var payload = {
      access_key:WEB3FORMS_ACCESS_KEY,
      subject:'Novo contato pelo site — '+nome+(querNewsletter?' · quer a Ponte IA':''),
      from_name:'Site BRIDGE',
      replyto:email,
      botcheck:false,
      Nome:nome, Email:email, WhatsApp:f.tel.value, 'Empresa/Órgão':f.empresa.value,
      Interesse:f.interesse.value, Mensagem:msg,
      Newsletter: querNewsletter ? 'Sim' : 'Não'
    };
    if(querNewsletter){
      payload['Consentimento newsletter (data/hora)'] = agora();
      payload['Consentimento newsletter (versão do texto)'] = (BF.versaoConsentimento||{}).contatoNewsletter || '';
      payload['Origem da inscrição'] = 'contato.html';
    }

    var btn=f.querySelector('button[type="submit"]');
    if(btn) btn.disabled=true;
    note.textContent='Enviando...';
    fetch(BF.endpoint || 'https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(payload)
    }).then(function(r){return r.json();}).then(function(d){
      if(d && d.success){
        note.textContent='Mensagem enviada! Retornaremos em até 1 dia útil.';note.classList.add('ok');
        f.reset();
      } else { throw new Error('fail'); }
    }).catch(function(){
      note.textContent='Não foi possível enviar agora. Chame no WhatsApp que respondemos rápido.';
      note.classList.add('err');
    }).finally(function(){ if(btn) btn.disabled=false; });
  });
})();
