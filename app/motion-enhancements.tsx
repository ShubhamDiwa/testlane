'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function MotionEnhancements(){const pathname=usePathname();useEffect(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const cards='.step,.lane-card,.listing-card,.panel:not(:has(.comment-reply)),.comment-reply,.prose>h2,.faq-list details';
 const elements=Array.from(document.querySelectorAll<HTMLElement>('.section,.benefits-section,.final-cta,.facts-strip,'+cards));
 let observer:IntersectionObserver|undefined;
 function setup(){observer?.disconnect();for(const el of elements)el.removeAttribute('data-reveal');if(preference.matches||!('IntersectionObserver' in window))return;
 observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.reveal=(entry.target as HTMLElement).dataset.reveal==='card-pending'?'card-visible':'visible';observer?.unobserve(entry.target)}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 for(const el of elements){
  if(el.getBoundingClientRect().top<=innerHeight)continue;
  el.dataset.reveal=el.matches(cards)?'card-pending':'pending';
  observer.observe(el);
 }
 }
 setup();preference.addEventListener('change',setup);return()=>{observer?.disconnect();preference.removeEventListener('change',setup);for(const el of elements)el.removeAttribute('data-reveal')};
 },[pathname]);return null}
