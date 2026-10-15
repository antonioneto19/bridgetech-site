/* Ponte IA — inscrição na newsletter
   TODO: conectar este formulário a uma ferramenta de e-mail.
   A ferramenta ainda não foi definida. Até lá:
   - não fazer fetch, POST, mailto nem qualquer outro envio;
   - não gravar nome ou e-mail em localStorage, cookie ou servidor;
   - não encaminhar dados a terceiros.
   A mensagem de sucesso é apenas local, neste navegador. */
(function(){
  'use strict';
  var form = document.getElementById('newsletterForm');
  var note = document.getElementById('newsletterNote');
  if(!form || !note) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    note.className = 'form-note';
    note.textContent = '';

    var trap = form.querySelector('[name="botcheck"]');
    if(trap && String(trap.value || '').trim() !== '') return;

    var email = (form.email.value || '').trim();
    var consent = form.consent && form.consent.checked;

    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      note.textContent = 'Informe um e-mail válido.';
      note.classList.add('err');
      if(form.email) form.email.focus();
      return;
    }
    if(!consent){
      note.textContent = 'É preciso autorizar o envio da newsletter (LGPD).';
      note.classList.add('err');
      if(form.consent) form.consent.focus();
      return;
    }

    // TODO: quando a ferramenta de e-mail existir, enviar daqui apenas
    // nome (opcional), e-mail e o registro de consentimento.
    // Enquanto o bloco acima for o comportamento final, nenhum dado sai da página.
    note.textContent = 'Inscrição anotada neste navegador. Nenhum dado foi enviado: a ferramenta de e-mail da Ponte IA ainda será conectada.';
    note.classList.add('ok');
    form.reset();
  });
})();
