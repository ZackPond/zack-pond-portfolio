// V184: Consistent brief fade on all internal page links, including header tabs.
(()=>{
 const reduce=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const veil=document.createElement('div');veil.className='site-travel-veil';veil.setAttribute('aria-hidden','true');document.body.appendChild(veil);
 let departing=false;
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self')||reduce())return;
  const destination=new URL(link.href,location.href);
  if(destination.protocol!=='http:'&&destination.protocol!=='https:')return;
  if(destination.origin!==location.origin||destination.pathname===location.pathname&&destination.search===location.search)return;
  if(departing){event.preventDefault();return;}
  event.preventDefault();departing=true;document.body.classList.add('site-travel-departing');
  window.setTimeout(()=>location.assign(destination.href),145);
 });
 window.addEventListener('pageshow',()=>{departing=false;document.body.classList.remove('site-travel-departing')});
})();
