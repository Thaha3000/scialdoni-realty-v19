/* Scialdoni Realty V17 contact form; no fake success notifications. */
(function(){
  'use strict';
  var form=document.getElementById('lead-contact-form');
  if(!form)return;
  var status=document.getElementById('form-status');
  var submit=form.querySelector('[type="submit"]');
  var endpoint=((window.SCIALDONI_CONTACT_CONFIG||{}).endpoint||'').trim();
  var configured=/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec(?:\?.*)?$/.test(endpoint);
  if(!configured){
    submit.textContent='EMAIL MY INQUIRY ↗';
    status.textContent='This opens your email app with your inquiry ready. Review it and click Send to contact our team.';
    status.classList.remove('error');
  } else {
    form.action=endpoint;
    form.method='POST';
    form.target='_blank';
    submit.textContent='SEND MESSAGE →';
    status.textContent='';
  }
  form.addEventListener('submit',function(event){
    if(!form.reportValidity()){event.preventDefault();return;}
    var data=new FormData(form);
    if(!configured){
      event.preventDefault();
      var fields=['Name: '+(data.get('name')||''),'Email: '+(data.get('email')||''),'Phone: '+(data.get('phone')||''),'Reason: '+(data.get('inquiry')||''),'','Message:',(data.get('message')||'')];
      var subject='Website inquiry — '+String(data.get('inquiry')||'Scialdoni Realty');
      var mailto='mailto:ed@scialdonirealty.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(fields.join('\n'));
      status.classList.remove('error');
      status.textContent='Your email app should open now. This form has not sent anything automatically; click Send in your email app.';
      window.location.href=mailto;
      return;
    }
    // A normal browser POST is more reliable for Google Apps Script than a cross-origin fetch.
    // Do not report success until the new tab confirms that the Google Sheet received the record.
    status.classList.remove('error');
    status.textContent='A confirmation page is opening in a new tab. Your inquiry is only submitted when that page says “Message received.”';
  });
})();
