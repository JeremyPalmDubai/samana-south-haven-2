document.documentElement.classList.add('js');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.menu-button'),mobile=document.querySelector('.mobile-nav');
function setMenu(open){menu?.setAttribute('aria-expanded',String(open));mobile?.classList.toggle('open',open);if(mobile)mobile.inert=!open;}
setMenu(false);
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
mobile?.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=menu?.getAttribute('aria-expanded')==='true';setMenu(false);if(wasOpen)menu.focus()}});
// Native disclosure keeps language navigation usable without JavaScript.
const languagePicker=document.querySelector('[data-language-picker]');
const languageTrigger=languagePicker?.querySelector('summary');
languagePicker?.addEventListener('toggle',()=>{if(languagePicker.open)setMenu(false)});
menu?.addEventListener('click',()=>{if(languagePicker)languagePicker.open=false});
document.addEventListener('click',event=>{if(languagePicker&&!languagePicker.contains(event.target))languagePicker.open=false});
document.addEventListener('focusin',event=>{if(languagePicker&&!languagePicker.contains(event.target))languagePicker.open=false});
languagePicker?.addEventListener('keydown',event=>{if(event.key==='Escape'&&languagePicker.open){event.preventDefault();event.stopPropagation();languagePicker.open=false;languageTrigger.focus()}});
// One-shot, staggered entrances. Native scrolling stays untouched.
let revealObserver;
const candidates=[...document.querySelectorAll('.reveal,.feature-heading,.gallery-two figure,.amenity-list article,.residence-card,.visa-card,.faq>div,.contact>div,.steps article,.subhero>*,.plan-card')];
function setupReveals(){
 revealObserver?.disconnect();
 if(reducedMotion.matches){candidates.forEach(el=>el.classList.remove('pending'));return;}
 revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 candidates.forEach(el=>{if(el.parentElement.closest('.reveal'))return;el.classList.add('reveal');const siblings=[...el.parentElement.children].filter(n=>candidates.includes(n));el.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(el),3)*65}ms`);if(el.getBoundingClientRect().bottom>0){el.classList.add('pending');revealObserver.observe(el)}});
}
setupReveals();
// Smooth expansion preserves native details/summary keyboard behaviour.
const faqAnimations=new Map();
document.querySelectorAll('.faq details').forEach(detail=>{
 const summary=detail.querySelector('summary');let expanded=detail.open;
 summary.addEventListener('click',event=>{
  if(reducedMotion.matches)return;
  event.preventDefault();const start=detail.getBoundingClientRect().height;
  faqAnimations.get(detail)?.cancel();expanded=!expanded;detail.open=true;
  const target=expanded?detail.scrollHeight:summary.getBoundingClientRect().height;
  detail.style.overflow='hidden';detail.classList.toggle('is-expanded',expanded);
  const animation=detail.animate([{height:`${start}px`},{height:`${target}px`}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  faqAnimations.set(detail,animation);
  animation.onfinish=()=>{detail.open=expanded;detail.style.overflow='';faqAnimations.delete(detail)};
 });
});
const sticky=document.querySelector('.sticky-cta'),contact=document.querySelector('#contact'),hero=document.querySelector('.hero');
let framePending=false;
function updateScroll(){
 framePending=false;
 if(sticky){const rect=contact?.getBoundingClientRect();sticky.classList.toggle('visible',scrollY>500&&(!rect||rect.top>innerHeight||rect.bottom<0))}
 if(hero&&!reducedMotion.matches){const rect=hero.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const travel=Math.max(0,-rect.top);hero.style.setProperty('--hero-drift',`${Math.min(travel*.08,45)}px`)}}
}
addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(updateScroll)}},{passive:true});
reducedMotion.addEventListener('change',()=>{setupReveals();if(reducedMotion.matches){hero?.style.setProperty('--hero-drift','0px');for(const [detail,animation] of faqAnimations){animation.finish();detail.style.overflow=''}}});
updateScroll();
// Load the supplied Tally embed only near the contact section.
const embed=document.querySelector('iframe[data-tally-src]');
function loadForm(){if(!embed)return;embed.src=embed.dataset.tallySrc;const script=document.createElement('script');script.src='https://tally.so/widgets/embed.js';script.async=true;script.onload=()=>window.Tally?.loadEmbeds();document.body.append(script)}
if(embed&&'IntersectionObserver'in window){const o=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){loadForm();o.disconnect()}},{rootMargin:'700px'});o.observe(embed)}else loadForm();
// Plan gallery: links still open the original image when JavaScript is unavailable.
const planDialog=document.querySelector('.plan-dialog'),planImage=planDialog?.querySelector('[data-plan-image]'),planStage=planDialog?.querySelector('.plan-stage');
let planScale=1,planFitWidth=0,planOpener;
function fitPlan(){planScale=1;planStage?.classList.remove('zoomed');if(planImage){planImage.style.width='';planImage.style.height='';}if(planStage){planStage.scrollTop=0;planStage.scrollLeft=0}planDialog?.querySelector('[data-plan-zoom="out"]')?.setAttribute('disabled','');planDialog?.querySelector('[data-plan-zoom="in"]')?.removeAttribute('disabled');}
document.querySelectorAll('[data-plan]').forEach(link=>link.addEventListener('click',event=>{
 if(!planDialog?.showModal||event.ctrlKey||event.metaKey||event.shiftKey)return;
 event.preventDefault();planOpener=link;planImage.onload=()=>{fitPlan();planFitWidth=planImage.getBoundingClientRect().width};planImage.src=link.href;planImage.alt=link.dataset.planTitle;planDialog.querySelector('#plan-dialog-title').textContent=link.dataset.planTitle;planDialog.querySelector('[data-plan-download]').href=link.href;fitPlan();planDialog.showModal();document.body.style.overflow='hidden';
}));
planDialog?.querySelector('[data-plan-close]')?.addEventListener('click',()=>planDialog.close());
planDialog?.addEventListener('close',()=>{document.body.style.overflow='';planOpener?.focus()});
planDialog?.addEventListener('click',event=>{if(event.target===planDialog)planDialog.close()});
planDialog?.querySelectorAll('[data-plan-zoom]').forEach(button=>button.addEventListener('click',()=>{
 if(button.dataset.planZoom==='fit'){fitPlan();return;}
 if(!planFitWidth)planFitWidth=planImage.getBoundingClientRect().width;
 planScale=Math.max(1,Math.min(4,planScale+(button.dataset.planZoom==='in'?.5:-.5)));
 if(planScale===1){fitPlan();return;}
 planStage.classList.add('zoomed');planImage.style.width=`${planFitWidth*planScale}px`;planImage.style.height='auto';planDialog.querySelector('[data-plan-zoom="out"]').disabled=false;planDialog.querySelector('[data-plan-zoom="in"]').disabled=planScale===4;
}));
addEventListener('resize',()=>{if(planDialog?.open){fitPlan();planFitWidth=planImage.getBoundingClientRect().width}});
document.querySelectorAll('[data-plan-filter]').forEach(button=>button.addEventListener('click',()=>{
 const section=button.closest('.plans-hub');section.querySelectorAll('[data-plan-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));section.querySelectorAll('[data-plan-group]').forEach(card=>{card.hidden=button.dataset.planFilter!=='all'&&card.dataset.planGroup!==button.dataset.planFilter});
}));
