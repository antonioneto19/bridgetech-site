(function(){
  // Após criar o e-mail contato@bridgetech.ia.br, gere uma chave GRATUITA em https://web3forms.com
  // (informando esse e-mail como destino) e cole entre as aspas abaixo.
  // Enquanto estiver vazia, o formulário continua enviando pelo WhatsApp automaticamente.
  var WEB3FORMS_ACCESS_KEY = '0c08e9cc-01f3-45df-94c3-4ea3c9c0b159';
  var WHATS = '5581971171007';
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

    // Fallback enquanto não há chave de e-mail configurada: envia pelo WhatsApp
    if(!WEB3FORMS_ACCESS_KEY){
      var txt='Olá! Sou '+nome+(f.empresa.value?' ('+f.empresa.value+')':'')+'. Interesse: '+f.interesse.value+'. '+msg;
      note.textContent='Redirecionando para o WhatsApp...';note.classList.add('ok');
      window.open('https://wa.me/'+WHATS+'?text='+encodeURIComponent(txt),'_blank','noopener');
      setTimeout(function(){f.reset();},800);
      return;
    }

    var btn=f.querySelector('button[type="submit"]');
    if(btn) btn.disabled=true;
    note.textContent='Enviando...';
    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({
        access_key:WEB3FORMS_ACCESS_KEY,
        subject:'Novo contato pelo site — '+nome,
        from_name:'Site BRIDGE',
        botcheck:false,
        Nome:nome, Email:email, WhatsApp:f.tel.value, 'Empresa/Órgão':f.empresa.value,
        Interesse:f.interesse.value, Mensagem:msg
      })
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
