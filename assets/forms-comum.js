/* Base comum dos formulários do site (contato.html e newsletter.html).
   - Chave pública do Web3Forms, vinculada a contato@bridgetech.ia.br
     (contato@ é encaminhado para antonio@liderancatech.com via ImprovMX).
     A chave do Web3Forms é pública por natureza: ela só permite ENVIAR para
     o e-mail cadastrado, nunca ler mensagens.
   - Data e hora no fuso America/Sao_Paulo, com offset (ex.: 2026-10-22T13:40:05-03:00),
     usada como registro do consentimento (LGPD).
   - Versões dos textos de consentimento: se o texto de uma caixinha mudar,
     suba a versão aqui e em /workspace/newsletter/inscritos/README.md. */
(function(){
  'use strict';
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function isoSaoPaulo(d){
    d = d || new Date();
    try{
      var p = {};
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo', hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).formatToParts(d).forEach(function(x){ p[x.type] = x.value; });
      var asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
      var off = Math.round((asUtc - Math.floor(d.getTime() / 1000) * 1000) / 60000);
      var sign = off < 0 ? '-' : '+';
      var a = Math.abs(off);
      return p.year + '-' + p.month + '-' + p.day + 'T' + p.hour + ':' + p.minute + ':' + p.second +
             sign + pad(Math.floor(a / 60)) + ':' + pad(a % 60);
    }catch(e){
      return d.toISOString(); // fallback em UTC (termina em Z)
    }
  }
  window.BridgeForms = {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '77778dfd-f430-4188-9a51-e6aa4b795dee',
    whatsapp: '5581971181007',
    isoSaoPaulo: isoSaoPaulo,
    versaoConsentimento: {
      contatoNewsletter: 'NL-CONTATO-v1-2026-10-22',
      paginaNewsletter: 'NL-PAGINA-v1-2026-10-22'
    }
  };
})();
