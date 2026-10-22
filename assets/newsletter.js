/* Ponte IA — inscrição na newsletter
   Envia a inscrição pelo Web3Forms (mesma chave do formulário de contato, em assets/forms-comum.js)
   para contato@bridgetech.ia.br (encaminhado ao time via ImprovMX).
   Não há confirmação dupla automática (sem ferramenta paga): o e-mail de boas-vindas
   é enviado manualmente por bridgetechia.br@gmail.com e a inscrição é registrada na
   planilha controlada de inscritos (ver /workspace/newsletter/inscritos/README.md).
   Nada é gravado em localStorage, cookie ou servidor próprio. */
(function(){
  'use strict';
  var BF = window.BridgeForms || {};
  var agora = BF.isoSaoPaulo || function(){ return new Date().toISOString(); };
  var form = document.getElementById('newsletterForm');
  var note = document.getElementById('newsletterNote');
  if(!form || !note) return;

  function erro(msg, campo){
    note.textContent = msg;
    note.classList.add('err');
    if(campo && campo.focus) campo.focus();
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    note.className = 'form-note';
    note.textContent = '';

    // honeypot anti-spam: se um bot preencher o campo oculto, abortamos em silêncio
    var trap = form.querySelector('[name="botcheck"]');
    if(trap && String(trap.value || '').trim() !== '') return;

    var nome = (form.nome.value || '').trim();
    var email = (form.email.value || '').trim();
    var org = form.organizacao ? (form.organizacao.value || '').trim() : '';
    var consent = form.consent && form.consent.checked;

    if(!nome) return erro('Informe seu nome.', form.nome);
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erro('Informe um e-mail válido.', form.email);
    if(!consent) return erro('É preciso autorizar o envio da newsletter (LGPD).', form.consent);
    if(!BF.accessKey) return erro('Não foi possível concluir a inscrição agora. Escreva para contato@bridgetech.ia.br.');

    var textoConsent = form.querySelector('[data-consent-text]');
    var payload = {
      access_key: BF.accessKey,
      subject: 'Nova inscrição Ponte IA — ' + nome,
      from_name: 'Site BRIDGE — Ponte IA',
      replyto: email,
      botcheck: false,
      Nome: nome,
      Email: email,
      'Organização': org,
      Newsletter: 'Sim',
      'Origem da inscrição': 'newsletter.html',
      'Consentimento newsletter (data/hora)': agora(),
      'Consentimento newsletter (versão do texto)': (BF.versaoConsentimento || {}).paginaNewsletter || '',
      'Texto do consentimento': textoConsent ? textoConsent.textContent.replace(/\s+/g, ' ').trim() : ''
    };

    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    note.textContent = 'Enviando...';
    fetch(BF.endpoint || 'https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(r){ return r.json(); }).then(function(d){
      if(d && d.success){
        note.textContent = 'Inscrição recebida! Em breve você recebe um e-mail de boas-vindas de bridgetechia.br@gmail.com. Se não chegar, confira a caixa de spam.';
        note.classList.add('ok');
        form.reset();
        if(typeof window.gtag === 'function'){
          window.gtag('event', 'sign_up', { method: 'newsletter_ponte_ia' });
        }
      } else { throw new Error('fail'); }
    }).catch(function(){
      note.textContent = 'Não foi possível concluir a inscrição agora. Tente de novo em alguns minutos ou escreva para contato@bridgetech.ia.br.';
      note.classList.add('err');
    }).finally(function(){ if(btn) btn.disabled = false; });
  });
})();
